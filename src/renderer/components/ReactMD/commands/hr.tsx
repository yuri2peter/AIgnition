import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';
import { svgIconProps } from './defines';
import { selectWord, executeCommand } from '../utils/markdownUtils';
import { IconSeparator } from '@tabler/icons-react';

export const hr: ICommand = {
  name: 'hr',
  keyCommand: 'hr',
  shortcuts: 'ctrlcmd+h',
  prefix: '\n\n---\n',
  suffix: '',
  buttonProps: {
    'aria-label': 'Insert HR (ctrl + h)',
    title: 'Insert HR (ctrl + h)',
  },
  icon: <IconSeparator {...svgIconProps} />,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    const newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix!,
      suffix: state.command.suffix,
    });
    let state1 = api.setSelectionRange(newSelectionRange);
    if (
      state1.selectedText.length >= state.command.prefix!.length &&
      state1.selectedText.startsWith(state.command.prefix!)
    ) {
      // Remove
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix!,
        suffix: state.command.suffix,
      });
    } else {
      // Add
      state1 = api.setSelectionRange({
        start: state.selection.start,
        end: state.selection.start,
      });
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix!,
        suffix: state.command.suffix,
      });
    }
  },
};
