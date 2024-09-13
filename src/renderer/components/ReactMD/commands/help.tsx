import { IconHelp } from '@tabler/icons-react';
import { ICommand } from '.';
import { svgIconProps } from './defines';

export const help: ICommand = {
  name: 'Help',
  keyCommand: 'help',
  icon: <IconHelp {...svgIconProps} />,
  title: 'Open help',
  execute: () => {
    window.open(
      'https://www.markdownguide.org/basic-syntax/',
      '_blank',
      'noreferrer'
    );
  },
};
