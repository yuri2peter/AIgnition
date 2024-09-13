import { IconTextPlus } from '@tabler/icons-react';
import {
  codeBlock,
  image,
  orderedListCommand,
  table,
  unorderedListCommand,
  group,
  bold,
  strikethrough,
  link,
  quote,
  code,
} from 'src/renderer/components/ReactMD/commands';
import { svgIconProps } from 'src/renderer/components/ReactMD/commands/defines';
import { upload } from './upload';
import { emojiSelector } from './emoji';

export const formatGroup2 = group(
  [
    bold,
    strikethrough,
    link,
    quote,
    code,
    unorderedListCommand,
    orderedListCommand,
    image,
    table,
    codeBlock,
    emojiSelector,
    upload,
  ],
  {
    name: 'formatGroup',
    groupName: 'formatGroup',
    icon: <IconTextPlus {...svgIconProps} />,
    title: 'More format',
  }
);
