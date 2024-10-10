import { Button, Group, Tooltip, ActionIcon } from '@mantine/core';
import React from 'react';
import { usePageStore } from 'src/renderer/store/usePageStore';
import {
  IconArrowBarToDown,
  IconArrowBarToUp,
  IconArrowsVertical,
  IconFilePlus,
  IconFocusCentered,
  IconFold,
  IconFolderPlus,
  IconRefresh,
} from '@tabler/icons-react';
import { apiErrorHandler } from 'src/renderer/helpers/api';
import FlexGrow from 'src/renderer/components/miscs/FlexGrow';
import { useUserStore } from 'src/renderer/store/useUserStore';
import {
  useTriggerEventCloseAllPages,
  useTriggerEventScrollToBottom,
  useTriggerEventScrollToTop,
  useTriggerEventOpenAllPages,
  useTriggerEventFocusPage,
} from './events';
import { notifications } from '@mantine/notifications';

const iconProps = {
  size: 16,
};

const NavHeader: React.FC = () => {
  const loggedIn = useUserStore((s) => s.loggedIn);
  const { pullPages, createPage, pullGuestPages } = usePageStore(
    (s) => s.actions
  );
  const currentPageId = usePageStore((s) => s.currentPageId);

  const triggerEventScrollToTop = useTriggerEventScrollToTop();
  const triggerEventScrollToBottom = useTriggerEventScrollToBottom();
  const triggerEventCloseAllPages = useTriggerEventCloseAllPages();
  const triggerEventOpenAllPages = useTriggerEventOpenAllPages();
  const triggerEventFocusPage = useTriggerEventFocusPage();

  const buttonNewPageGroup = (
    <>
      <Tooltip label="Refresh">
        <ActionIcon
          variant="subtle"
          size="sm"
          color="gray"
          onClick={() => {
            pullPages()
              .then(() => {
                notifications.show({
                  message: 'All pages refreshed.',
                  color: 'green',
                });
              })
              .catch(apiErrorHandler);
          }}
        >
          <IconRefresh {...iconProps} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="New folder">
        <ActionIcon
          variant="subtle"
          size="sm"
          color="gray"
          onClick={() => {
            createPage({
              item: {
                title: '📁 Untitled',
                content: '# 📁 Untitled\n\n',
                isFolder: true,
              },
            }).catch(apiErrorHandler);
          }}
        >
          <IconFolderPlus {...iconProps} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="New page">
        <ActionIcon
          variant="subtle"
          size="sm"
          color="gray"
          onClick={() => {
            createPage({
              item: { title: '📄 Untitled', content: '# 📄 Untitled\n\n' },
            }).catch(apiErrorHandler);
          }}
        >
          <IconFilePlus {...iconProps} />
        </ActionIcon>
      </Tooltip>
    </>
  );
  const buttonGuestReload = (
    <Button
      color="grape"
      variant="subtle"
      size="xs"
      justify="start"
      leftSection={<IconRefresh {...iconProps} />}
      onClick={() => {
        pullGuestPages(currentPageId)
          .then(() => {
            notifications.show({
              message: 'All pages refreshed.',
              color: 'green',
            });
          })
          .catch(apiErrorHandler);
      }}
    >
      Refresh
    </Button>
  );
  const buttonScroller = (
    <>
      <Tooltip label="Scroll to top">
        <ActionIcon
          variant="subtle"
          size="sm"
          color="gray"
          onClick={() => {
            triggerEventScrollToTop();
          }}
        >
          <IconArrowBarToUp {...iconProps} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Scroll to bottom">
        <ActionIcon
          variant="subtle"
          size="sm"
          color="gray"
          onClick={() => {
            triggerEventScrollToBottom();
          }}
        >
          <IconArrowBarToDown {...iconProps} />
        </ActionIcon>
      </Tooltip>
    </>
  );
  const buttonFold = (
    <Tooltip label="Fold all">
      <ActionIcon
        variant="subtle"
        size="sm"
        color="gray"
        onClick={() => {
          triggerEventCloseAllPages();
        }}
      >
        <IconFold {...iconProps} />
      </ActionIcon>
    </Tooltip>
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const buttonUnfold = (
    <Tooltip label="Unfold all">
      <ActionIcon
        variant="subtle"
        size="sm"
        color="gray"
        onClick={() => {
          triggerEventOpenAllPages();
        }}
      >
        <IconArrowsVertical {...iconProps} />
      </ActionIcon>
    </Tooltip>
  );
  const buttonFocus = (
    <Tooltip label="Focus page">
      <ActionIcon
        variant="subtle"
        size="sm"
        color="gray"
        onClick={() => {
          triggerEventFocusPage(currentPageId);
        }}
      >
        <IconFocusCentered {...iconProps} />
      </ActionIcon>
    </Tooltip>
  );
  return (
    <Group
      gap={4}
      px={14}
      py={4}
      style={{
        backgroundColor: 'var(--mantine-color-gray-0)',
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 4,
        // borderBottom: '1px solid var(divider-color)',
      }}
    >
      {loggedIn ? (
        <>
          {buttonNewPageGroup}
          <FlexGrow />
          {buttonFocus}
          {buttonFold}
          {buttonScroller}
        </>
      ) : (
        <>
          {buttonGuestReload}
          <FlexGrow />
          {buttonFocus}
          {buttonFold}
          {buttonScroller}
        </>
      )}
    </Group>
  );
};

export default NavHeader;
