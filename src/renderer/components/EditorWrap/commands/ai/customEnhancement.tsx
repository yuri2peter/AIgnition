import React from 'react';
import { Button, TextInput } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { zodSafeString } from 'src/common/utils/type';
import { ICommand } from 'src/renderer/components/ReactMD';
import { fetchEventSource } from 'src/renderer/helpers/fetchEventSource';
import { z } from 'zod';
import { alertSelectionIsEmpty } from '../../utils';
import { GeneratingText } from './defines';

export const customEnhancement: ICommand = {
  name: 'More rewrite style...',
  keyCommand: 'customEnhancement',
  shortcuts: 'ctrlcmd+/',
  title: 'More rewrite style (Ctrl + /)',
  execute: async (state, api, ctx) => {
    const { text, selectedText } = state;
    if (!selectedText) {
      alertSelectionIsEmpty();
      return;
    }
    modals.open({
      title: 'More rewrite style',
      children: (
        <CustomPromptModal
          onSubmit={async (commandPrompt) => {
            modals.closeAll();
            const { start, end } = state.selection;
            let lastInsertedTextLength = end - start;
            const insertText = (text: string) => {
              if (text) {
                ctx?.historyManager?.ignoreNextPush();
                api.setSelectionRange({
                  start,
                  end: start + lastInsertedTextLength,
                });
                api.replaceSelection(text);
                lastInsertedTextLength = text.length;
                api.setSelectionRange({
                  start,
                  end: start + lastInsertedTextLength,
                });
              }
            };
            insertText(GeneratingText);
            await fetchEventSource('/api/ai/edit-replace', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                stream: true,
                documentPrefix: text.slice(0, start),
                documentSuffix: text.slice(end),
                documentSelection: selectedText,
                command: commandPrompt,
              }),
              onmessage: (ev) => {
                const {
                  data: { totalText },
                } = z
                  .object({
                    data: z.object({
                      totalText: zodSafeString(),
                      chunkText: zodSafeString(),
                    }),
                  })
                  .parse(JSON.parse(ev.data));
                insertText(totalText);
              },
              onerror: console.error,
            });
            ctx?.historyManager?.cancelIgnore();
          }}
        />
      ),
    });
  },
};

let defaultPrompt = '';
const CustomPromptModal: React.FC<{
  onSubmit?: (value: string) => void;
}> = ({
  onSubmit = () => {
    modals.closeAll();
  },
}) => {
  const [value, setValue] = useInputState(defaultPrompt);
  return (
    <form
      onSubmit={(e) => {
        defaultPrompt = value;
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <TextInput
        data-autofocus
        label={'Prompt'}
        required
        placeholder=".e.g. Rewrite the content to make it more interesting"
        value={value}
        onChange={setValue}
      />
      <Button fullWidth type="submit" disabled={!value} mt="md">
        Apply
      </Button>
    </form>
  );
};
