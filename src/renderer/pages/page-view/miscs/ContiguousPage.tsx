import { Box, Button, Card, Group, Stack, Text } from '@mantine/core';
import {
  IconArrowBigRight,
  IconArrowBigLeft,
  IconArrowLeft,
  IconArrowRight,
} from '@tabler/icons-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { getPageRoute, getPageTitleFixed } from 'src/renderer/helpers/miscs';
import {
  selectContiguousPage,
  usePageStore,
} from 'src/renderer/store/usePageStore';

const buttonPropsLite = {
  variant: 'subtle',
  color: 'default',
  size: 'xs',
  component: Link,
  justify: 'start',
  classNames: {
    root: 'mantine-Button-overflow',
  },
};

const buttonPropsNormal = {
  variant: 'outline',
  color: 'blue',
  size: 'md',
  component: Link,
  classNames: {
    root: 'border borde-gray-300 hover:border-gray-500 flex-1 min-w-50',
  },
};

export const ContiguousPage: React.FC = () => {
  const { nextPage, prevPage } = usePageStore(selectContiguousPage);
  const buttonProps = buttonPropsNormal;
  const prevPageDisplay = prevPage ? (
    <Card {...buttonProps} to={getPageRoute(prevPage.id)}>
      <Group wrap="nowrap" gap={'xl'} my={'auto'} justify="space-between">
        <IconArrowLeft stroke={1.5} />
        <Stack gap={0} align="flex-end">
          <Text size={'lg'}>Previous</Text>
          <Text c={'gray.6'} size={'sm'} lineClamp={2}>
            {getPageTitleFixed(prevPage.title)}
          </Text>
        </Stack>
      </Group>
    </Card>
  ) : null; // <Box className="invisible flex-1"></Box>
  const nextPageDisplay = nextPage ? (
    <Card {...buttonProps} to={getPageRoute(nextPage.id)}>
      <Group wrap="nowrap" gap={'xl'} my={'auto'} justify="space-between">
        <Stack gap={0}>
          <Text size={'lg'}>Next</Text>
          <Text c={'gray.6'} size={'sm'} lineClamp={2}>
            {getPageTitleFixed(nextPage.title)}
          </Text>
        </Stack>
        <IconArrowRight stroke={1.5} />
      </Group>
    </Card>
  ) : null; //  <Box className="invisible flex-1"></Box>
  if (!prevPage && !nextPage) return null;
  return (
    <Group gap={'xl'} align="stretch">
      {prevPageDisplay}
      {nextPageDisplay}
    </Group>
  );
};

export const ContiguousPageLite: React.FC = () => {
  const { nextPage, prevPage } = usePageStore(selectContiguousPage);
  const buttonProps = buttonPropsLite;
  const prevPageDisplay = prevPage ? (
    <Button
      {...buttonProps}
      to={getPageRoute(prevPage.id)}
      leftSection={<IconArrowBigLeft size={16} stroke={1.5} />}
    >
      {getPageTitleFixed(prevPage.title)}
    </Button>
  ) : null;
  const nextPageDisplay = nextPage ? (
    <Button
      {...buttonProps}
      to={getPageRoute(nextPage.id)}
      leftSection={<IconArrowBigRight size={16} stroke={1.5} />}
    >
      {getPageTitleFixed(nextPage.title)}
    </Button>
  ) : null;
  if (!prevPage && !nextPage) return null;
  return (
    <Stack gap={'0'} align="stretch">
      {prevPageDisplay}
      {nextPageDisplay}
    </Stack>
  );
};
