import React from 'react';
import { ICommand, TextState, TextAreaTextApi } from '.';
import { ContextStore, ExecuteCommandState } from '../Context';
import { svgIconProps } from './defines';

export const codePreview: ICommand = {
  name: 'preview',
  keyCommand: 'preview',
  value: 'preview',
  shortcuts: 'ctrlcmd+9',
  buttonProps: {
    'aria-label': 'Preview code (ctrl + 9)',
    title: 'Preview code (ctrl + 9)',
  },
  icon: (
    <svg
      {...svgIconProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="tabler-icon"
    >
      <path d="M4 4h2v16h-2" />
      <path d="M20 4h-10v16h10" />
    </svg>
  ),
  execute: (
    state: TextState,
    api: TextAreaTextApi,
    dispatch?: React.Dispatch<ContextStore>,
    executeCommandState?: ExecuteCommandState,
    shortcuts?: string[]
  ) => {
    api.textArea.focus();
    if (shortcuts && dispatch && executeCommandState) {
      dispatch({ preview: 'preview' });
    }
  },
};

export const codeEdit: ICommand = {
  name: 'edit',
  keyCommand: 'preview',
  value: 'edit',
  shortcuts: 'ctrlcmd+7',
  buttonProps: {
    'aria-label': 'Edit code (ctrl + 7)',
    title: 'Edit code (ctrl + 7)',
  },
  icon: (
    <svg
      {...svgIconProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="tabler-icon"
    >
      <path d="M4 4h10v16h-10" />
      <path d="M20 4h-2v16h2" />
    </svg>
  ),
  execute: (
    state: TextState,
    api: TextAreaTextApi,
    dispatch?: React.Dispatch<ContextStore>,
    executeCommandState?: ExecuteCommandState,
    shortcuts?: string[]
  ) => {
    api.textArea.focus();
    if (shortcuts && dispatch && executeCommandState) {
      dispatch({ preview: 'edit' });
    }
  },
};

export const codeLive: ICommand = {
  name: 'live',
  keyCommand: 'preview',
  value: 'live',
  shortcuts: 'ctrlcmd+8',
  buttonProps: {
    'aria-label': 'Live code (ctrl + 8)',
    title: 'Live code (ctrl + 8)',
  },
  icon: (
    <svg
      {...svgIconProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="tabler-icon"
    >
      <path d="M4 4h6v16h-6" />
      <path d="M20 4h-6v16h6" />
    </svg>
  ),
  execute: (
    state: TextState,
    api: TextAreaTextApi,
    dispatch?: React.Dispatch<ContextStore>,
    executeCommandState?: ExecuteCommandState,
    shortcuts?: string[]
  ) => {
    api.textArea.focus();
    if (shortcuts && dispatch && executeCommandState) {
      dispatch({ preview: 'live' });
    }
  },
};
