import { IconArrowForwardUp } from '@tabler/icons-react';
import { ICommand } from '.';
import { svgIconProps } from './defines';

export const redo: ICommand = {
  name: 'redo',
  keyCommand: 'redo',
  buttonProps: { 'aria-label': 'Redo', title: 'Redo (ctrl + z)' },
  icon: <IconArrowForwardUp {...svgIconProps} />,
  execute: () => {
    document.execCommand('redo', false);
  },
};
