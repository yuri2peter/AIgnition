import { IconPencilPlus } from '@tabler/icons-react';
import { ICommand, group } from 'src/renderer/components/ReactMD/commands';
import { svgIconProps } from 'src/renderer/components/ReactMD/commands/defines';
import { z } from 'zod';
import { zodSafeString } from 'src/common/utils/type';
import { fetchEventSource } from 'src/renderer/helpers/fetchEventSource';
import { customEnhancement } from './customEnhancement';
import { alertSelectionIsEmpty } from '../../utils';
import { GeneratingText } from './defines';
import { customContinueWriting } from './autocomplete';

const enhancementCommands = [
  {
    name: 'Polish',
    commandPrompt:
      'Improve the selected text by enhancing grammar, clarity, and overall readability, while maintaining the original language.',
  },
  {
    name: 'Expand',
    commandPrompt:
      'Improve the selected text by generating longer, more detailed content, while maintaining the original language.',
  },
  {
    name: 'Simplify',
    commandPrompt:
      'Improve the selected text by making it shorter and concise, while maintaining the original language.',
  },
  {
    name: 'Formal Style',
    commandPrompt:
      'Rewrite the text in the same language, but in a more formal tone, perfect for academic or professional writing, while maintaining the original language.',
  },
  {
    name: 'Informal Style',
    commandPrompt:
      'Rewrite the text in the same language, but in a more conversational and casual tone, ideal for blog posts or social media content, while maintaining the original language.',
  },
  {
    name: 'Translate to English',
    commandPrompt: 'Rewrite the text in English.',
  },
].map(enhancementCommandFactory);

export const enhancementGroup = group(
  [...enhancementCommands, customEnhancement, customContinueWriting],
  {
    name: 'enhancementGroup',
    groupName: 'enhancementGroup',
    title: 'More AI enhancement',
    icon: <IconPencilPlus {...svgIconProps} />,
  }
);

type EnhancementCommandProps = {
  name: string;
  commandPrompt: string;
};
function enhancementCommandFactory({
  name,
  commandPrompt,
}: EnhancementCommandProps) {
  const command: ICommand = {
    name,
    keyCommand: name,
    title: commandPrompt,
    execute: async (state, api, ctx) => {
      const { text, selectedText } = state;
      if (!selectedText) {
        alertSelectionIsEmpty();
        return;
      }
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
            start: start,
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
    },
  };
  return command;
}
