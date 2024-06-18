import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';
import { selectWord, executeCommand } from '../utils/markdownUtils';
import { svgIconProps } from './defines';
import { IconPhoto } from '@tabler/icons-react';

export const image: ICommand = {
  name: 'image',
  keyCommand: 'image',
  shortcuts: 'ctrlcmd+k',
  prefix: '![image](',
  suffix: ')',
  buttonProps: {
    'aria-label': 'Add image (ctrl + k)',
    title: 'Add image (ctrl + k)',
  },
  icon: <IconPhoto {...svgIconProps} />,
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
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix!,
        suffix: state.command.suffix,
      });
    } else {
      newSelectionRange = selectWord({
        text: state.text,
        selection: state.selection,
        prefix: '![',
        suffix: ']()',
      });
      state1 = api.setSelectionRange(newSelectionRange);
      if (state1.selectedText.length === 0) {
        executeCommand({
          api,
          selectedText: state1.selectedText,
          selection: state.selection,
          prefix: '![image',
          suffix: '](url)',
        });
      } else {
        executeCommand({
          api,
          selectedText: state1.selectedText,
          selection: state.selection,
          prefix: '![',
          suffix: ']()',
        });
      }
    }
  },
};
