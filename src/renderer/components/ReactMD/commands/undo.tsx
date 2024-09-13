import { IconArrowBackUp } from '@tabler/icons-react';
import { ICommand, TextAreaTextApi, TextState } from '.';
import { svgIconProps } from './defines';
import { ContextStore } from '../Context';

export const undo: ICommand = {
  name: 'undo',
  keyCommand: 'undo',
  shortcuts: 'ctrlcmd+z',
  title: 'Undo (Ctrl + Z)',
  icon: <IconArrowBackUp {...svgIconProps} />,
  execute: (state: TextState, api: TextAreaTextApi, ctx?: ContextStore) => {
    const s = ctx!.historyManager!.undo();
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
