import { IconTextPlus } from '@tabler/icons-react';
import {
  codeBlock,
  image,
  orderedListCommand,
  table,
  unorderedListCommand,
  group,
} from 'src/renderer/components/ReactMD/commands';
import { svgIconProps } from 'src/renderer/components/ReactMD/commands/defines';
import { upload } from './upload';

export const formatGroup1 = group(
  [unorderedListCommand, orderedListCommand, image, table, codeBlock, upload],
  {
    name: 'formatGroup',
    groupName: 'formatGroup',
    icon: <IconTextPlus {...svgIconProps} />,
    title: 'More format',
  }
);
