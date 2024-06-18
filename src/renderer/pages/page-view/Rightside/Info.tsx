import { Badge, Group, Stack, Text, Tooltip } from '@mantine/core';
import React from 'react';
import { formatTime } from 'src/common/utils/time';
import { usePageStore } from 'src/renderer/store/usePageStore';
import dayjs from 'dayjs';

const Info: React.FC<{}> = () => {
  const currentPage = usePageStore((s) => s.currentPage);
  if (!currentPage) return null;
  return (
    <Stack gap={4}>
      <Group gap={'xs'}>
        <Text c="gray">Creation time:</Text>
        <Tooltip label={formatTime(currentPage.createdAt)}>
          <Text c="gray" style={{ cursor: 'pointer' }}>
            {dayjs(currentPage.createdAt).fromNow()}
          </Text>
        </Tooltip>
      </Group>
      <Group gap={'xs'}>
        <Text c="gray">Last modified: </Text>
        <Tooltip label={formatTime(currentPage.updatedAt)}>
          <Text c="gray" style={{ cursor: 'pointer' }}>
            {dayjs(currentPage.updatedAt).fromNow()}
          </Text>
        </Tooltip>
      </Group>
      <Group gap={'xs'}>
        <Text c="gray">Visibility: </Text>
        <Tooltip label={`${currentPage.privateViews} private views`}>
          <Badge
            style={{ cursor: 'pointer' }}
            color={currentPage.isPublic ? 'gray' : 'grape'}
            variant={currentPage.isPublic ? 'light' : 'filled'}
          >
            Private
          </Badge>
        </Tooltip>
        <Tooltip label={`${currentPage.publicViews} public views`}>
          <Badge
            style={{ cursor: 'pointer' }}
            color={currentPage.isPublic ? 'green' : 'gray'}
            variant={currentPage.isPublic ? 'filled' : 'light'}
          >
            Public
          </Badge>
        </Tooltip>
      </Group>
    </Stack>
  );
};

export default Info;
