import { IconArrowBackUp } from '@tabler/icons-react';
import { ICommand } from '.';
import { svgIconProps } from './defines';

export const undo: ICommand = {
  name: 'undo',
  keyCommand: 'undo',
  buttonProps: { 'aria-label': 'Undo', title: 'Undo (ctrl + shift + z)' },
  icon: <IconArrowBackUp {...svgIconProps} />,
  execute: () => {
    document.execCommand('undo', false);
  },
};
