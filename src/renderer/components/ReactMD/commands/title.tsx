import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';
import { title1 } from './title1';
import { selectLine, executeCommand } from '../utils/markdownUtils';
import { svgIconProps } from './defines';
import { IconPilcrow } from '@tabler/icons-react';

export function titleExecute({
  state,
  api,
  prefix,
  suffix = prefix,
}: {
  state: ExecuteState;
  api: TextAreaTextApi;
  prefix: string;
  suffix?: string;
}) {
  const newSelectionRange = selectLine({
    text: state.text,
    selection: state.selection,
  });
  const state1 = api.setSelectionRange(newSelectionRange);
  executeCommand({
    api,
    selectedText: state1.selectedText,
    selection: state.selection,
    prefix,
    suffix,
  });
}

export const title: ICommand = {
  ...title1,
  icon: <IconPilcrow {...svgIconProps} />,
};
