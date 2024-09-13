import React from 'react';
import { ICommand, TextState, TextAreaTextApi } from '.';
import { ContextStore, ExecuteCommandState } from '../Context';
import { svgIconProps } from './defines';

export const codePreview: ICommand = {
  name: 'Preview',
  keyCommand: 'preview',
  value: 'preview',
  shortcuts: 'alt+9',
  title: 'Preview mode (Alt + 9)',
  icon: (
    <svg
      {...svgIconProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="tabler-icon"
    >
      <path d="M4 4h2v16h-2" />
      <path d="M20 4h-10v16h10" />
    </svg>
  ),
  execute: (
    state: TextState,
    api: TextAreaTextApi,
    ctx?: ContextStore,
    executeCommandState?: ExecuteCommandState,
    shortcuts?: string[]
  ) => {
    api.textArea.focus();
    if (shortcuts && ctx?.dispatch && executeCommandState) {
      ctx?.dispatch({ preview: 'preview' });
    }
  },
};

export const codeEdit: ICommand = {
  name: 'Edit',
  keyCommand: 'preview',
  value: 'edit',
  shortcuts: 'alt+7',
  title: 'Edit mode (Alt + 7)',
  icon: (
    <svg
      {...svgIconProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="tabler-icon"
    >
      <path d="M4 4h10v16h-10" />
      <path d="M20 4h-2v16h2" />
    </svg>
  ),
  execute: (
    state: TextState,
    api: TextAreaTextApi,
    ctx?: ContextStore,
    executeCommandState?: ExecuteCommandState,
    shortcuts?: string[]
  ) => {
    api.textArea.focus();
    if (shortcuts && ctx?.dispatch && executeCommandState) {
      ctx?.dispatch({ preview: 'edit' });
    }
  },
};

export const codeLive: ICommand = {
  name: 'Live',
  keyCommand: 'preview',
  value: 'live',
  shortcuts: 'alt+8',
  title: 'Live mode (Alt + 8)',
  icon: (
    <svg
      {...svgIconProps}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="tabler-icon"
    >
      <path d="M4 4h6v16h-6" />
      <path d="M20 4h-6v16h6" />
    </svg>
  ),
  execute: (
    state: TextState,
    api: TextAreaTextApi,
    ctx?: ContextStore,
    executeCommandState?: ExecuteCommandState,
    shortcuts?: string[]
  ) => {
    api.textArea.focus();
    if (shortcuts && ctx?.dispatch && executeCommandState) {
      ctx?.dispatch({ preview: 'live' });
    }
  },
};
