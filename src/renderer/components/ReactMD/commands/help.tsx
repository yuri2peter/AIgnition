import { IconHelp } from '@tabler/icons-react';
import { ICommand } from '.';
import { svgIconProps } from './defines';

export const help: ICommand = {
  name: 'help',
  keyCommand: 'help',
  buttonProps: { 'aria-label': 'Open help', title: 'Open help' },
  icon: <IconHelp {...svgIconProps} />,
  execute: () => {
    window.open(
      'https://www.markdownguide.org/basic-syntax/',
      '_blank',
      'noreferrer'
    );
  },
};
