import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';
import { selectWord, executeCommand } from '../utils/markdownUtils';
import { svgIconProps } from './defines';
import { IconCode, IconCodeDots } from '@tabler/icons-react';

export const codeBlock: ICommand = {
  name: 'codeBlock',
  keyCommand: 'codeBlock',
  shortcuts: 'ctrlcmd+shift+j',
  prefix: '```',
  buttonProps: {
    'aria-label': 'Insert Code Block (ctrl + shift + j)',
    title: 'Insert Code Block (ctrl + shift +j)',
  },
  icon: <IconCodeDots {...svgIconProps} />,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    const newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: '```\n',
      suffix: '\n```',
    });
    const state1 = api.setSelectionRange(newSelectionRange);

    // Based on context determine if new line is needed or not
    let prefix = '\n```\n';
    let suffix = '\n```\n';

    if (
      state1.selectedText.length >= prefix.length + suffix.length - 2 &&
      state1.selectedText.startsWith(prefix) &&
      state1.selectedText.endsWith(suffix)
    ) {
      // Remove code block
      prefix = '```\n';
      suffix = '\n```';
    } else {
      // Add code block
      if (
        (state1.selection.start >= 1 &&
          state.text.slice(
            state1.selection.start - 1,
            state1.selection.start
          ) === '\n') ||
        state1.selection.start === 0
      ) {
        prefix = '```\n';
      }
      if (
        (state1.selection.end <= state.text.length - 1 &&
          state.text.slice(state1.selection.end, state1.selection.end + 1) ===
            '\n') ||
        state1.selection.end === state.text.length
      ) {
        suffix = '\n```';
      }
    }

    const newSelectionRange2 = selectWord({
      text: state.text,
      selection: state.selection,
      prefix,
      suffix,
    });
    const state2 = api.setSelectionRange(newSelectionRange2);
    executeCommand({
      api,
      selectedText: state2.selectedText,
      selection: state.selection,
      prefix,
      suffix,
    });
  },
};

export const code: ICommand = {
  name: 'code',
  keyCommand: 'code',
  shortcuts: 'ctrlcmd+j',
  prefix: '`',
  buttonProps: {
    'aria-label': 'Insert code (ctrl + j)',
    title: 'Insert code (ctrl + j)',
  },
  icon: <IconCode {...svgIconProps} />,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    if (state.selectedText.indexOf('\n') === -1) {
      const newSelectionRange = selectWord({
        text: state.text,
        selection: state.selection,
        prefix: state.command.prefix!,
      });
      const state1 = api.setSelectionRange(newSelectionRange);
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix!,
      });
    } else {
      codeBlock.execute!(state, api);
    }
  },
};
