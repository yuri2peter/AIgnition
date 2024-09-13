import { IconArrowForwardUp } from '@tabler/icons-react';
import { ICommand, TextAreaTextApi, TextState } from '.';
import { svgIconProps } from './defines';
import { ContextStore } from '../Context';

export const redo: ICommand = {
  name: 'Redo',
  keyCommand: 'redo',
  shortcuts: 'ctrlcmd+shift+z',
  title: 'Redo (Ctrl + Shift + Z)',
  icon: <IconArrowForwardUp {...svgIconProps} />,
  execute: (state: TextState, api: TextAreaTextApi, ctx?: ContextStore) => {
    const s = ctx!.historyManager!.redo();
    if (s && ctx) {
      ctx.dispatch!({
        markdown: s.markdown,
      });
      setTimeout(() => {
        api.textArea.focus();
        api.textArea.setSelectionRange(s.selection.start, s.selection.end);
      }, 10);
    }
  },
};
