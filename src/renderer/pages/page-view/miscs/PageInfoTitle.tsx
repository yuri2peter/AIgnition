import { Group, Text } from '@mantine/core';
import React from 'react';
import {
  selectCurrentPage,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import { IconBrandFeedly } from '@tabler/icons-react';
import { getPageTitleFixed } from 'src/renderer/helpers/miscs';
import { ButtonOpenPageActionsMenu } from './openPageActionsMenu';

const PageInfoTitle: React.FC<{}> = () => {
  const currentPage = usePageStore(selectCurrentPage);
  if (!currentPage) return null;
  const title = getPageTitleFixed(currentPage.title);
  return (
    <Group
      gap={'sm'}
      wrap="nowrap"
      px={16}
      py={8}
      h={56}
      style={{
        borderBottom: '1px solid var(--divider-color)',
        flexShrink: 0,
      }}
    >
      <IconBrandFeedly size={20} stroke={1.5} />
      <Text mr={'auto'} truncate td={'none'}>
        {title}
      </Text>
      <ButtonOpenPageActionsMenu itemId={currentPage.id} />
    </Group>
  );
};

export default PageInfoTitle;
