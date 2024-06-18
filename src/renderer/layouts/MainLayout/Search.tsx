import { Button, Text } from '@mantine/core';
import React from 'react';
import { IconSearch } from '@tabler/icons-react';

export const SearchTrigger: React.FC<{}> = () => {
  return (
    <Button
      justify="space-between"
      variant="outline"
      color="gray"
      leftSection={<IconSearch color="gray" stroke={1.5} size={14} />}
      w={264}
      rightSection={
        <Text
          c="black.7"
          size="xs"
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--mantine-color-gray-1)',
            padding: '2px 8px',
            borderRadius: '4px',
          }}
        >
          ⌘ + K
        </Text>
      }
    >
      <Text c="gray" fw={400}>
        Search
      </Text>
    </Button>
  );
};
