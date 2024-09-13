import React from 'react';
import { titleExecute } from './title';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';

export const title4: ICommand = {
  name: 'Title4',
  keyCommand: 'title4',
  shortcuts: 'ctrlcmd+4',
  prefix: '#### ',
  suffix: '',
  title: 'Insert title4 (Ctrl + 4)',
  icon: <span>####</span>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    titleExecute({
      state,
      api,
      prefix: state.command.prefix!,
      suffix: state.command.suffix,
    });
  },
};
