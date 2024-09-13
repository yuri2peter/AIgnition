import { Badge, Group, Stack, Text, Tooltip } from '@mantine/core';
import React from 'react';
import { formatTime } from 'src/common/utils/time';
import {
  selectCurrentNavTreeItem,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import dayjs from 'dayjs';
import { PrivacyLevelData } from 'src/common/type/page';
import { useNow } from 'src/renderer/hooks/useNow';
import FlexGrow from 'src/renderer/components/miscs/FlexGrow';
import { ButtonOpenPageActionsMenu } from './openPageActionsMenu';

const Meta: React.FC<{ left?: boolean }> = ({ left }) => {
  const currentItem = usePageStore(selectCurrentNavTreeItem);
  useNow(5000);
  if (!currentItem) return null;
  const currentPage = currentItem.data;
  const privacy = PrivacyLevelData[currentItem.data.computed.isPublic ? 0 : 1]!;
  return (
    <Stack>
      <Group>
        <Text fw="bold" size="sm" c="gray.6">
          Meta
        </Text>
        <FlexGrow />
        {left && <ButtonOpenPageActionsMenu itemId={currentPage.id} />}
      </Group>
      <Stack gap={0} pl={0}>
        <Group gap={'xs'}>
          <Text c="gray" size="sm">
            Privacy Level:{' '}
          </Text>
          <Tooltip label={privacy.tooltip}>
            <Badge
              size="sm"
              style={{ cursor: 'pointer' }}
              color={privacy.hightlightColor}
              variant={'filled'}
            >
              {privacy.label}
            </Badge>
          </Tooltip>
        </Group>
        <Group gap={'xs'}>
          <Text c="gray" size="sm">
            Creation time:
          </Text>
          <Tooltip label={formatTime(currentPage.createdAt)}>
            <Text c="gray" size="sm" style={{ cursor: 'pointer' }}>
              {dayjs(currentPage.createdAt).fromNow()}
            </Text>
          </Tooltip>
        </Group>
        <Group gap={'xs'}>
          <Text c="gray" size="sm">
            Last modified:{' '}
          </Text>
          <Tooltip label={formatTime(currentPage.updatedAt)}>
            <Text c="gray" size="sm" style={{ cursor: 'pointer' }}>
              {dayjs(currentPage.updatedAt).fromNow()}
            </Text>
          </Tooltip>
        </Group>
        <Group gap={'xs'}>
          <Text c="gray" size="sm">
            {currentPage.content.length} characters,{' '}
            {currentPage.content ? currentPage.content.split('\n').length : 0}{' '}
            lines
          </Text>
        </Group>
      </Stack>
    </Stack>
  );
};

export const MetaLite: React.FC = () => {
  const currentItem = usePageStore(selectCurrentNavTreeItem);
  useNow(5000);
  if (!currentItem) return null;
  const currentPage = currentItem.data;
  return (
    <Group>
      <Group gap={4}>
        <Text c="gray" size="sm">
          Created:
        </Text>
        <Tooltip label={formatTime(currentPage.createdAt)}>
          <Text c="gray" size="sm" style={{ cursor: 'pointer' }}>
            {dayjs(currentPage.createdAt).fromNow()},
          </Text>
        </Tooltip>
      </Group>
      <Group gap={'xs'}>
        <Text c="gray" size="sm">
          Last updated:
        </Text>
        <Tooltip label={formatTime(currentPage.updatedAt)}>
          <Text c="gray" size="sm" style={{ cursor: 'pointer' }}>
            {dayjs(currentPage.updatedAt).fromNow()}
          </Text>
        </Tooltip>
      </Group>
    </Group>
  );
};

export default Meta;
