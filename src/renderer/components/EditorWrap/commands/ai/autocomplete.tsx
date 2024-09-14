import { IconPencil } from '@tabler/icons-react';
import { zodSafeString } from 'src/common/utils/type';
import {
  ContextStore,
  ExecuteState,
  ICommand,
  TextAreaTextApi,
} from 'src/renderer/components/ReactMD';
import { svgIconProps } from 'src/renderer/components/ReactMD/commands/defines';
import { modals } from '@mantine/modals';
import { z } from 'zod';
import { GeneratingText } from './defines';
import { useInputState } from '@mantine/hooks';
import { Button, TextInput } from '@mantine/core';
import { eventApi } from 'src/renderer/helpers/api';

export const continueWriting: ICommand = {
  name: 'continueWriting',
  keyCommand: 'continueWriting',
  shortcuts: 'ctrlcmd+m',
  title: 'Continue writing based on the context (Ctrl + M)',
  icon: <IconPencil {...svgIconProps} />,
  execute: async (state, api, ctx) => {
    await handleInsert({ state, api, ctx });
  },
};

export const customContinueWriting: ICommand = {
  name: 'More continue writing...',
  keyCommand: 'customContinueWriting',
  shortcuts: 'ctrlcmd+,',
  title: 'More continue writing (Ctrl + ,)',
  execute: async (state, api, ctx) => {
    modals.open({
      title: 'Continue writing',
      children: (
        <CustomPromptModal
          onSubmit={async (commandPrompt) => {
            modals.closeAll();
            await handleInsert({ state, api, ctx, command: commandPrompt });
          }}
        />
      ),
    });
  },
};

async function handleInsert({
  state,
  api,
  ctx,
  command = 'Continue writing the text from the current cursor position while maintaining the context and tone of the existing text.',
}: {
  state: ExecuteState;
  api: TextAreaTextApi;
  ctx?: ContextStore;
  command?: string;
}) {
  const { text } = state;
  const { end: insertIndex } = state.selection;
  let lastInsertedTextLength = 0;
  const insertText = (text: string) => {
    if (text) {
      ctx?.historyManager?.ignoreNextPush();
      api.setSelectionRange({
        start: insertIndex,
        end: insertIndex + lastInsertedTextLength,
      });
      api.replaceSelection(text);
      lastInsertedTextLength = text.length;
      api.setSelectionRange({
        start: insertIndex,
        end: insertIndex + lastInsertedTextLength,
      });
    }
  };
  insertText(GeneratingText);
  await eventApi(
    '/api/ai/edit-insert',
    {
      stream: true,
      documentPrefix: text.slice(0, insertIndex),
      documentSuffix: text.slice(insertIndex),
      command,
    },
    (ev) => {
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
    }
  );
  ctx?.historyManager?.cancelIgnore();
}

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
        e.preventDefault();
        defaultPrompt = value;
        onSubmit(value);
      }}
    >
      <TextInput
        data-autofocus
        label={'Prompt'}
        required
        placeholder=".e.g. Insert a markdown table with 5 rows and 3 columns"
        value={value}
        onChange={setValue}
      />
      <Button fullWidth type="submit" disabled={!value} mt="md">
        Apply
      </Button>
    </form>
  );
};
