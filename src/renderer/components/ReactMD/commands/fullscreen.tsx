import React from 'react';
import { ICommand, TextState, TextAreaTextApi } from '.';
import { ContextStore, ExecuteCommandState } from '../Context';
import { svgIconProps } from './defines';
import { IconArrowsMaximize } from '@tabler/icons-react';

export const fullscreen: ICommand = {
  name: 'fullscreen',
  keyCommand: 'fullscreen',
  shortcuts: 'ctrlcmd+0',
  value: 'fullscreen',
  buttonProps: {
    'aria-label': 'Toggle fullscreen (ctrl + 0)',
    title: 'Toggle fullscreen (ctrl+ 0)',
  },
  icon: <IconArrowsMaximize {...svgIconProps} />,
  execute: (
    state: TextState,
    api: TextAreaTextApi,
    dispatch?: React.Dispatch<ContextStore>,
    executeCommandState?: ExecuteCommandState,
    shortcuts?: string[]
  ) => {
    api.textArea.focus();
    if (shortcuts && dispatch && executeCommandState) {
      dispatch({ fullscreen: !executeCommandState.fullscreen });
    }
  },
};
