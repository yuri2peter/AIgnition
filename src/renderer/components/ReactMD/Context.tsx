import React from 'react';
import { ICommand, TextAreaCommandOrchestrator, TextRange } from './commands';
import { HistoryManager } from './utils/HistoryManager';

export type PreviewType = 'live' | 'edit' | 'preview';

export interface ContextStore {
  commands?: ICommand<string>[];
  extraCommands?: ICommand<string>[];
  markdown?: string;
  markdownLazy?: string;
  preview?: PreviewType;
  height?: React.CSSProperties['height'];
  fullscreen?: boolean;
  autoFocus?: boolean;
  textarea?: HTMLTextAreaElement;
  commandOrchestrator?: TextAreaCommandOrchestrator;
  textareaWarp?: HTMLDivElement;
  textareaPre?: HTMLPreElement;
  container?: HTMLDivElement | null;
  dispatch?: React.Dispatch<ContextStore>;
  barPopup?: Record<string, boolean>;
  tabSize?: number;
  defaultTabEnable?: boolean;
  historyManager?: HistoryManager<{
    markdown: string;
    selection: TextRange;
  }>;
  textSelection?: TextRange;
  [key: string]: any;
}

export type ExecuteCommandState = Pick<ContextStore, 'fullscreen' | 'preview'>;

export function reducer(state: ContextStore, action: ContextStore) {
  return { ...state, ...action };
}

export const EditorContext = React.createContext<ContextStore>({
  markdown: '',
});
