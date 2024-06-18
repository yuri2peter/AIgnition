import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';
import { selectWord, executeCommand } from '../utils/markdownUtils';
import { svgIconProps } from './defines';
import { IconBold } from '@tabler/icons-react';

export const bold: ICommand = {
  name: 'bold',
  keyCommand: 'bold',
  shortcuts: 'ctrlcmd+b',
  prefix: '**',
  buttonProps: {
    'aria-label': 'Add bold text (ctrl + b)',
    title: 'Add bold text (ctrl + b)',
  },
  icon: <IconBold {...svgIconProps} />,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
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
  },
};
