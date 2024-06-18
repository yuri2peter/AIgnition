import React from 'react';
import { ICommand, ICommandChildCommands, ICommandChildHandle } from '.';
import { svgIconProps } from './defines';
import { IconMenu2 } from '@tabler/icons-react';

export type GroupOptions = Omit<ICommand<string>, 'children'> & {
  children?: ICommandChildHandle['children'];
};

export const group = (
  arr: ICommandChildCommands['children'],
  options?: GroupOptions
): ICommand<string> => {
  const data = {
    children: arr as any,
    icon: <IconMenu2 {...svgIconProps} />,
    execute: () => {},
    ...options,
    keyCommand: 'group',
  };
  if (Array.isArray(data.children)) {
    data.children = data.children.map((child) => {
      const { ...item } = child as any as ICommand;
      item.parent = data;
      return { ...item };
    });
  }
  return data;
};
