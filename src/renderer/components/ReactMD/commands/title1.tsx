import { titleExecute } from './title';
import { ICommand, ExecuteState, TextAreaTextApi } from '.';

export const title1: ICommand = {
  name: 'Title1',
  keyCommand: 'title1',
  shortcuts: 'ctrlcmd+1',
  prefix: '# ',
  suffix: '',
  title: 'Insert title1 (Ctrl + 1)',
  icon: <span>#</span>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    titleExecute({
      state,
      api,
      prefix: state.command.prefix!,
      suffix: state.command.suffix,
    });
  },
};
