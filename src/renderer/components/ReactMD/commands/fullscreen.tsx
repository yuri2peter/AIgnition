import React from 'react';
import { ICommand, TextState, TextAreaTextApi } from '.';
import { ContextStore, ExecuteCommandState } from '../Context';
import { svgIconProps } from './defines';
import { IconArrowsMaximize } from '@tabler/icons-react';

export const fullscreen: ICommand = {
  name: 'Fullscreen',
  keyCommand: 'fullscreen',
  shortcuts: 'alt+0',
  value: 'fullscreen',
  title: 'Toggle fullscreen (Alt + 0)',
  icon: <IconArrowsMaximize {...svgIconProps} />,
  execute: (
    state: TextState,
    api: TextAreaTextApi,
    ctx?: ContextStore,
    executeCommandState?: ExecuteCommandState,
    shortcuts?: string[]
  ) => {
    api.textArea.focus();
    if (shortcuts && ctx?.dispatch && executeCommandState) {
      ctx?.dispatch({ fullscreen: !executeCommandState.fullscreen });
    }
  },
};
