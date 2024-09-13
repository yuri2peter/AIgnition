import { createZustandStore } from 'src/common/libs/createZustand';
import { ChatHistory } from 'src/common/type/ai';
import { fetchEventSource } from '../helpers/fetchEventSource';
import { z } from 'zod';
import { zodSafeString } from 'src/common/utils/type';
import { selectCurrentPage, usePageStore } from './usePageStore';
import { eventEmitter } from '../hooks/useEvent';

interface Store {
  usePageContent: boolean;
  processing: boolean;
  prompt: string;
  history: ChatHistory;
  abortController: AbortController;
}

const defaultStore: Store = {
  usePageContent: false,
  processing: false,
  prompt: '',
  history: [],
  abortController: new AbortController(),
};

export const useAichatStore = createZustandStore(defaultStore, (set, get) => {
  const setPrompt = (prompt: string) => {
    set({ prompt });
  };
  const send = async (additionalPrompt = '') => {
    const currentPageContent =
      selectCurrentPage(usePageStore.getState())?.content || '';
    const abortController = new AbortController();
    const scrollToBottom = () => {
      eventEmitter.emit('EVENT__PANEL_AICHAT_SCROLL_TO_BOTTOM');
    };
    const { prompt: inputPrompt, history, usePageContent } = get();
    const prompt = additionalPrompt || inputPrompt;
    set({ processing: true, abortController });
    if (!additionalPrompt) {
      set({ prompt: '' });
    }
    set((d) => {
      d.history.push({
        user: prompt,
        model: '',
      });
    });
    scrollToBottom();
    await query({
      prompt: prompt,
      history: [
        ...(currentPageContent && usePageContent
          ? [
              {
                user: [
                  'Please use the following text as known context in our conversation from now on:',
                  '-----------------------------------------------------------------------',
                  currentPageContent,
                ].join('\n'),
                model:
                  'OK. I will use it as context for the next conversation.',
              },
            ]
          : []),
        ...history,
      ],
      signal: abortController.signal,
      onUpdate: (chunkText) => {
        set((d) => {
          d.history[d.history.length - 1]!.model += chunkText;
        });
        scrollToBottom();
      },
    }).catch((e) => {
      console.error(e);
    });
    set({ processing: false });
  };
  const abort = () => {
    get().abortController.abort();
  };
  const clearHistory = () => {
    set({ history: [] });
  };
  const setUsePageContent = (value: boolean) => {
    set({ usePageContent: value });
  };
  const removeHistoryFromIndex = (index: number) => {
    set((d) => {
      d.history.splice(index, 9999);
    });
  };
  const regenerateFromIndex = async (index: number) => {
    const { history } = get();
    const prompt = history[index]!.user;
    removeHistoryFromIndex(index);
    await send(prompt);
  };
  return {
    actions: {
      setPrompt,
      send,
      abort,
      clearHistory,
      setUsePageContent,
      removeHistoryFromIndex,
      regenerateFromIndex,
    },
  };
});

async function query({
  prompt,
  history,
  signal,
  onUpdate,
}: {
  prompt: string;
  history: ChatHistory;
  signal?: AbortSignal;
  onUpdate?: (text: string) => void;
}) {
  await fetchEventSource('/api/ai/chat', {
    signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      stream: true,
      history,
    }),
    onmessage: (ev) => {
      const {
        data: { chunkText },
      } = z
        .object({
          data: z.object({
            totalText: zodSafeString(),
            chunkText: zodSafeString(),
          }),
        })
        .parse(JSON.parse(ev.data));
      onUpdate?.(chunkText);
    },
    onerror: console.error,
  });
}
