import { ActionIcon, Text, Tooltip } from '@mantine/core';
import {
  IconCopyPlus,
  IconTrash,
  IconLink,
  IconEye,
  IconRoute2,
  IconStar,
  IconStarOff,
  IconDotsVertical,
  IconFolderPlus,
  IconFilePlus,
  IconEyeClosed,
} from '@tabler/icons-react';
import React, { useCallback } from 'react';
import { usePageStore } from 'src/renderer/store/usePageStore';
import { ShowContextMenuFunction, useContextMenu } from 'mantine-contextmenu';
import { getPageRoute } from 'src/renderer/helpers/miscs';
import { apiErrorHandler } from 'src/renderer/helpers/api';
import { notifications } from '@mantine/notifications';
import { modals, openContextModal } from '@mantine/modals';
import { useUserStore } from 'src/renderer/store/useUserStore';
import { ROOT_PAGE_ID } from 'src/common/type/page';
import { getNodeById } from 'src/common/utils/tree';

export function openPageActionsMenu(params: {
  itemId: string;
  event: React.MouseEvent;
  showContextMenu: ShowContextMenuFunction;
}) {
  const { showContextMenu, event } = params;
  const {
    pages,
    actions: { createPage, deletePage, patchPage, duplicatePage },
  } = usePageStore.getState();
  const node = getNodeById(pages, params.itemId)!;

  const menu = (() => {
    const ms = {
      divider: {},
      newSubpage: {
        title: 'Subpage',
        color: 'blue',
        icon: <IconFilePlus size={16} />,
        onClick: () => {
          createPage(
            { title: 'Untitled', content: '# Untitled\n\n' },
            node.id
          ).catch(apiErrorHandler);
        },
      },
      newSubfolder: {
        title: 'Subfolder',
        color: 'blue',
        icon: <IconFolderPlus size={16} />,
        onClick: () => {
          createPage(
            { title: 'Untitled', content: '# Untitled\n\n', isFolder: true },
            node.id
          ).catch(apiErrorHandler);
        },
      },
      toogleFavorite: {
        title: node.isFavorite ? 'Unfavorite' : 'Favorite',
        icon: node.isFavorite ? (
          <IconStarOff size={16} />
        ) : (
          <IconStar size={16} />
        ),
        onClick: () => {
          patchPage({ id: node.id, isFavorite: !node.isFavorite }).catch(
            apiErrorHandler
          );
        },
      },
      copyLink: {
        title: 'Copy link',
        icon: <IconLink size={16} />,
        onClick: () => {
          const link = window.location.origin + getPageRoute(node.id);
          window.navigator.clipboard.writeText(link);
          notifications.show({
            title: 'Link copied',
            message: link,
            color: 'green',
          });
        },
      },
      changeRoute: {
        title: 'Custom route',
        icon: <IconRoute2 size={16} />,
        onClick: () => {
          openContextModal({
            modal: 'ChangePageIdModal',
            title: 'Custom route of this page',
            innerProps: {
              from: node.id,
            },
          });
        },
      },
      toogleIsPublicFolder: {
        title: node.isPublicFolder
          ? 'Unset as public folder'
          : 'Set as public folder',
        icon: node.isPublicFolder ? (
          <IconEyeClosed size={16} />
        ) : (
          <IconEye size={16} />
        ),
        onClick: () => {
          patchPage({
            id: node.id,
            isPublicFolder: !node.isPublicFolder,
          }).catch(apiErrorHandler);
        },
      },
      duplicate: {
        title: 'Duplicate',
        icon: <IconCopyPlus size={16} />,
        onClick: () => {
          duplicatePage(node.id).catch(apiErrorHandler);
        },
      },
      handleRemove: {
        color: 'red',
        title: 'Remove',
        icon: <IconTrash size={16} />,
        onClick: () => {
          modals.openConfirmModal({
            title: 'Please confirm your action',
            children: (
              <Text size="sm">
                This action will remove the page "{node.title}" and all its
                subpages. Please click one of these buttons to proceed.
              </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: () => {
              deletePage(node.id).catch(apiErrorHandler);
            },
          });
        },
      },
    };
    const unloggedInMenu = [ms.copyLink];
    const rootPageMenu = [
      ms.newSubpage,
      ms.newSubfolder,
      ms.divider,
      ms.copyLink,
      ms.toogleIsPublicFolder,
    ];
    const regularFolderMenu = [
      ms.newSubpage,
      ms.newSubfolder,
      ms.divider,
      ms.toogleFavorite,
      ms.copyLink,
      ms.changeRoute,
      ms.toogleIsPublicFolder,
      ms.duplicate,
      ms.divider,
      ms.handleRemove,
    ];
    const regularMenu = [
      ms.toogleFavorite,
      ms.copyLink,
      ms.changeRoute,
      ms.duplicate,
      ms.divider,
      ms.handleRemove,
    ];

    if (!useUserStore.getState().loggedIn) {
      return unloggedInMenu;
    }
    if (node.id === ROOT_PAGE_ID) {
      return rootPageMenu;
    }
    return node.isFolder ? regularFolderMenu : regularMenu;
  })();

  const handle = showContextMenu(
    menu.map((t, i) => ({ ...t, key: 'MenuItem_' + i })),
    { style: { width: 200 } }
  );
  handle(event);
}

export function useOpenPageActionsMenu(itemId: string) {
  const { showContextMenu } = useContextMenu();
  const handle = useCallback(
    (event: React.MouseEvent) => {
      openPageActionsMenu({ itemId, showContextMenu, event });
    },
    [itemId, showContextMenu]
  );
  return handle;
}

export function ButtonOpenPageActionsMenu({
  itemId,
  actionIconProps,
}: {
  itemId: string;
  actionIconProps?: React.ComponentProps<typeof ActionIcon>;
}) {
  const handle = useOpenPageActionsMenu(itemId);
  return (
    <Tooltip label="Page actions" openDelay={500}>
      <ActionIcon
        onClick={handle}
        variant="subtle"
        color="gray"
        {...actionIconProps}
      >
        <IconDotsVertical size={16} />
      </ActionIcon>
    </Tooltip>
  );
}
