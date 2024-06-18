import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';
import { selectWord, executeCommand } from '../utils/markdownUtils';
import { svgIconProps } from './defines';
import { IconTable } from '@tabler/icons-react';

export const table: ICommand = {
  name: 'table',
  keyCommand: 'table',
  prefix: `
| Header | Header | Header | Header |
|--------|--------|--------|--------|
|  Cell  |  Cell  |  Cell  |  Cell  |
|  Cell  |  Cell  |  Cell  |  Cell  |
|  Cell  |  Cell  |  Cell  |  Cell  |

`,
  suffix: '',
  buttonProps: { 'aria-label': 'Add table', title: 'Add table' },
  icon: <IconTable {...svgIconProps} />,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    const newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix!,
      suffix: state.command.suffix,
    });
    let state1 = api.setSelectionRange(newSelectionRange);
    if (
      state1.selectedText.length >=
        state.command.prefix!.length + state.command.suffix!.length &&
      state1.selectedText.startsWith(state.command.prefix!)
    ) {
      // Remove
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix!,
        suffix: state.command.suffix,
      });
    } else {
      // Add
      state1 = api.setSelectionRange({
        start: state.selection.start,
        end: state.selection.start,
      });
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix!,
        suffix: state.command.suffix,
      });
    }
  },
};
