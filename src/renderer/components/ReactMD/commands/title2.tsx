import { titleExecute } from './title';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';

export const title2: ICommand = {
  name: 'Title2',
  keyCommand: 'title2',
  shortcuts: 'ctrlcmd+2',
  prefix: '## ',
  suffix: '',
  title: 'Insert title2 (Ctrl + 2)',
  icon: <span>##</span>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    titleExecute({
      state,
      api,
      prefix: state.command.prefix!,
      suffix: state.command.suffix,
    });
  },
};
