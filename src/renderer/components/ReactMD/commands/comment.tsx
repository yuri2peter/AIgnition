import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';
import { selectWord, executeCommand } from '../utils/markdownUtils';
import { svgIconProps } from './defines';
import { IconMessage } from '@tabler/icons-react';

export const comment: ICommand = {
  name: 'Comment',
  keyCommand: 'comment',
  shortcuts: 'ctrlcmd+/',
  prefix: '<!-- ',
  suffix: ' -->',
  title: 'Insert comment (Ctrl + /)',
  icon: <IconMessage {...svgIconProps} />,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    const newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix!,
      suffix: state.command.suffix,
    });
    const state1 = api.setSelectionRange(newSelectionRange);
    executeCommand({
      api,
      selectedText: state1.selectedText,
      selection: state.selection,
      prefix: state.command.prefix!,
      suffix: state.command.suffix,
    });
  },
};
