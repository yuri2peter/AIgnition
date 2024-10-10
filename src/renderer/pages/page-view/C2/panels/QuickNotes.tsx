import React from 'react';
import { Group, Stack, Text, Textarea, Tooltip } from '@mantine/core';
import { zodSafeNumber, zodSafeString } from 'src/common/utils/type';
import usePluginStorage from 'src/renderer/hooks/usePluginStorage';
import { z } from 'zod';
import dayjs from 'dayjs';
import { formatTime } from 'src/common/utils/time';
import { useNow } from 'src/renderer/hooks/useNow';

export const QuickNotes: React.FC<{ show: boolean }> = ({ show }) => {
  useNow(5000);
  const { storage, saveStorage, loaded } = usePluginStorage(
    'quickNotes',
    schema
  );
  const { content, updatedAt } = storage;
  return (
    <Stack p={16} gap={16} h={'100%'} display={show ? undefined : 'none'}>
      <Stack gap={0}>
        <Text fw={'bold'}>Quick Notes</Text>
        {updatedAt > 0 && (
          <Group gap={'xs'}>
            <Text c="gray.6" size="sm">
              Last modified:{' '}
            </Text>
            <Tooltip label={formatTime(updatedAt)}>
              <Text c="gray.6" size="sm" style={{ cursor: 'pointer' }}>
                {dayjs(updatedAt).fromNow()}
              </Text>
            </Tooltip>
          </Group>
        )}
      </Stack>
      {loaded && (
        <Textarea
          minRows={8}
          variant="unstyled"
          spellCheck={false}
          autoFocus
          autosize
          placeholder="Start typing..."
          value={content}
          onChange={(e) => {
            saveStorage({
              ...storage,
              content: e.target.value,
              updatedAt: Date.now(),
            });
          }}
        />
      )}
    </Stack>
  );
};

const schema = z.object({
  content: zodSafeString(),
  updatedAt: zodSafeNumber(),
});
