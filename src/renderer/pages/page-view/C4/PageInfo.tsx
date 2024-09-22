import { Group, Stack, Text } from '@mantine/core';
import React from 'react';
import Toc from '../miscs/Toc';
import { ContiguousPageLite } from '../miscs/ContiguousPage';
import { IconListDetails } from '@tabler/icons-react';

const PageInfo: React.FC = () => {
  return (
    <Stack h={'100%'} gap={0}>
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
        <IconListDetails size={20} stroke={1.5} />
        <Text mr={'auto'} truncate td={'none'}>
          Table of Contents
        </Text>
      </Group>
      <Stack
        style={{ overflow: 'auto', flexGrow: 1 }}
        gap={'xl'}
        px={24}
        py={24}
        align="stretch"
      >
        <Toc tiny />
        <ContiguousPageLite />
      </Stack>
    </Stack>
  );
};

export default PageInfo;
