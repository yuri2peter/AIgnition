import { group, title1, title2, title3, title4 } from '.';
import { IconHeading } from '@tabler/icons-react';
import { svgIconProps } from './defines';

export const titleGroup = group([title1, title2, title3, title4], {
  name: 'title',
  groupName: 'title',
  icon: <IconHeading {...svgIconProps} />,
  title: 'Insert title',
});
