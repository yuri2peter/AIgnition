import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';
import { selectWord, executeCommand } from '../utils/markdownUtils';
import { svgIconProps } from './defines';
import { IconItalic } from '@tabler/icons-react';

export const italic: ICommand = {
  name: 'Italic',
  keyCommand: 'italic',
  shortcuts: 'ctrlcmd+i',
  prefix: '*',
  title: 'Add italic text (Ctrl + I)',
  icon: <IconItalic data-name="italic" {...svgIconProps} />,
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
