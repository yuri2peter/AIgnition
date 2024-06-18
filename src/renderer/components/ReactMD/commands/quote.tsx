import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';
import { selectLine, executeCommand } from '../utils/markdownUtils';
import { svgIconProps } from './defines';
import { IconQuote } from '@tabler/icons-react';

export const quote: ICommand = {
  name: 'quote',
  keyCommand: 'quote',
  shortcuts: 'ctrlcmd+q',
  prefix: '> ',
  suffix: '',
  buttonProps: {
    'aria-label': 'Insert a quote (ctrl + q)',
    title: 'Insert a quote (ctrl + q)',
  },
  icon: <IconQuote {...svgIconProps} />,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    const newSelectionRange = selectLine({
      text: state.text,
      selection: state.selection,
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
