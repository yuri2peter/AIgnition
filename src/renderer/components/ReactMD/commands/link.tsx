import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';
import { selectWord, executeCommand } from '../utils/markdownUtils';
import { svgIconProps } from './defines';
import { IconLink } from '@tabler/icons-react';

export const link: ICommand = {
  name: 'link',
  keyCommand: 'link',
  shortcuts: 'ctrlcmd+l',
  prefix: '[',
  suffix: '](url)',
  buttonProps: {
    'aria-label': 'Add a link (ctrl + l)',
    title: 'Add a link (ctrl + l)',
  },
  icon: <IconLink data-name="link" {...svgIconProps} />,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    let newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix!,
      suffix: state.command.suffix,
    });
    let state1 = api.setSelectionRange(newSelectionRange);
    if (
      state1.selectedText.includes('http') ||
      state1.selectedText.includes('www')
    ) {
      newSelectionRange = selectWord({
        text: state.text,
        selection: state.selection,
        prefix: '[](',
        suffix: ')',
      });
      state1 = api.setSelectionRange(newSelectionRange);
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: '[](',
        suffix: ')',
      });
    } else {
      if (state1.selectedText.length === 0) {
        executeCommand({
          api,
          selectedText: state1.selectedText,
          selection: state.selection,
          prefix: '[title',
          suffix: '](url)',
        });
      } else {
        executeCommand({
          api,
          selectedText: state1.selectedText,
          selection: state.selection,
          prefix: state.command.prefix!,
          suffix: state.command.suffix,
        });
      }
    }
  },
};
