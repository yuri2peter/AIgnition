import { Button, Group, Stack, Tooltip, Text } from '@mantine/core';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  PageNavNode,
  selectClipboardRelated,
  selectRootPageNavNode,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import styles from './style.module.css';
import {
  IconChevronDown,
  IconChevronRight,
  IconFile,
  IconPlus,
} from '@tabler/icons-react';
import { useHandlePageActionsContextMenu } from '../PageActionsMenu';
import { ROOT_PAGE_ID } from 'src/common/type/page';
import { navigate } from 'src/renderer/hacks/navigate';
import { apiErrorHandler } from 'src/renderer/helpers/api';
import dayjs from 'dayjs';
import { formatTime } from 'src/common/utils/time';

const PageNav: React.FC<{}> = () => {
  const rootPageNavNode = usePageStore(selectRootPageNavNode);
  const { createPage } = usePageStore((s) => s.actions);
  return (
    <Stack gap={'0'} py={8}>
      <Button
        color="blue"
        fullWidth
        variant="subtle"
        size="sm"
        justify="start"
        leftSection={<IconPlus size={16} />}
        onClick={() => {
          createPage({}, ROOT_PAGE_ID)
            .then((pageId) => {
              navigate(`/${pageId}`);
            })
            .catch(apiErrorHandler);
        }}
      >
        New page
      </Button>
      <Stack gap={'0'}>
        {rootPageNavNode && <NavNode node={rootPageNavNode} level={-1} />}
      </Stack>
    </Stack>
  );
};

const NavNode: React.FC<{
  node: PageNavNode;
  level?: number;
}> = ({ node, level = 0 }) => {
  const currentPageId = usePageStore((s) => s.currentPageId);
  const pageNavNodes = usePageStore((s) => s.pageNavNodes);
  const clipboardRelated = usePageStore(selectClipboardRelated);
  const { tooglePageNavNodeOpened } = usePageStore((s) => s.actions);
  const childrenNodes = node.childrenIds
    .map((t) => pageNavNodes.find((n) => n.id === t))
    .filter(Boolean);
  const hasChildren = childrenNodes.length > 0;
  const isClipboard = clipboardRelated?.clipboardPageId === node.id;
  const isCurrentPage = currentPageId === node.id;
  const isRoot = node.id === ROOT_PAGE_ID;
  const color = node.isPublic
    ? node.actived
      ? 'green'
      : 'gray'
    : node.actived
      ? 'orange'
      : 'gray';
  const childrenNavs = childrenNodes.map((t) => (
    <NavNode key={t.id} node={t} level={level + 1} />
  ));
  const handlePageActionsContextMenu = useHandlePageActionsContextMenu(node.id);
  if (level > 32) {
    return null;
  }
  if (isRoot) {
    return childrenNavs;
  }
  return (
    <>
      <Group
        gap={0}
        wrap="nowrap"
        className={clsx(styles.navNodeWrapper, {
          'border-2 border-dashed': isClipboard,
        })}
      >
        <Tooltip
          label={<NavTooltipLabel node={node} />}
          withArrow
          position="right"
          openDelay={1000}
        >
          <Button
            size="sm"
            color={color}
            variant={'subtle'}
            component={Link}
            to={`/${node.id}`}
            fullWidth
            justify="start"
            ml={`${level * 20}px`}
            onClick={() => {
              if (currentPageId === node.id) {
                tooglePageNavNodeOpened(node.id);
              }
            }}
            onContextMenu={handlePageActionsContextMenu}
            leftSection={
              hasChildren ? (
                node.opened ? (
                  <IconChevronDown size={16} />
                ) : (
                  <IconChevronRight size={16} />
                )
              ) : (
                <IconFile size={16} />
              )
            }
            styles={{
              root: {
                fontWeight: isCurrentPage ? 700 : 400,
                fontStyle: node.isPublic ? 'italic' : 'normal',
              },
            }}
          >
            {node.title || 'Untitled'}
          </Button>
        </Tooltip>
      </Group>
      {node.opened ? childrenNavs : null}
    </>
  );
};

export const NavTooltipLabel: React.FC<{ node: PageNavNode }> = ({ node }) => {
  const { isPublic, title, createdAt, updatedAt } = node;
  return (
    <Stack gap={0}>
      <Text size="sm">
        {title || 'Untitled'} ({isPublic ? 'Public' : 'Private'})
      </Text>
      <br />
      <Text size="sm">
        Creation time: {formatTime(createdAt)} ({dayjs(createdAt).fromNow()})
      </Text>
      <Text size="sm">
        Last modified: {formatTime(updatedAt)} ({dayjs(updatedAt).fromNow()})
      </Text>
    </Stack>
  );
};

export default PageNav;
