import { Anchor, Group, Text } from '@mantine/core';
import React from 'react';

const PoweredBy: React.FC<{}> = () => {
  return (
    <Group
      wrap="nowrap"
      px={16}
      py={8}
      style={{
        borderTop: '1px solid var(--mantine-color-gray-3)',
      }}
      justify="center"
    >
      <Text c={'gray.5'} size={'sm'}>
        Powered by{' '}
        <Anchor
          href="https://github.com/yuri2peter/AIgnition"
          c={'inherit'}
          target="_blank"
          underline="always"
        >
          AIgnition
        </Anchor>
      </Text>
    </Group>
  );
};

export default PoweredBy;
