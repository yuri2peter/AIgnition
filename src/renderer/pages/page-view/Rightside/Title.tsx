import { Group, Text } from '@mantine/core';
import React from 'react';
import { Helmet } from 'react-helmet';
import { PageActionsClickMenu } from '../PageActionsMenu';
import { usePageStore } from 'src/renderer/store/usePageStore';

const Title: React.FC<{}> = () => {
  const currentPage = usePageStore((s) => s.currentPage);
  if (!currentPage) return null;
  const title = currentPage.title || 'Untitled';
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Group
        wrap="nowrap"
        px={16}
        py={8}
        h={56}
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          flexShrink: 0,
        }}
      >
        <Text mr={'auto'}>{title}</Text>
        <PageActionsClickMenu
          nodeId={currentPage.id}
          triggerType="click-hover"
          actionIconProps={{
            color: 'gray',
            variant: 'subtle',
          }}
        />
      </Group>
    </>
  );
};

export default Title;
