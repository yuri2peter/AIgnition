import React from 'react';
import { titleExecute } from './title';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';

export const title3: ICommand = {
  name: 'Title3',
  keyCommand: 'title3',
  shortcuts: 'ctrlcmd+3',
  prefix: '### ',
  suffix: '',
  title: 'Insert title3 (Ctrl + 3)',
  icon: <span>###</span>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    titleExecute({
      state,
      api,
      prefix: state.command.prefix!,
      suffix: state.command.suffix,
    });
  },
};
