import { Menu, ActionIcon, Text } from '@mantine/core';
import {
  IconDotsVertical,
  IconPlus,
  IconCopyPlus,
  IconCopy,
  IconCut,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconArrowRight,
  IconBackslash,
  IconLink,
  IconEye,
} from '@tabler/icons-react';
import React, { useMemo } from 'react';
import { navigate } from 'src/renderer/hacks/navigate';
import { apiErrorHandler } from 'src/renderer/helpers/api';
import {
  selectClipboardRelated,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import { modals } from '@mantine/modals';
import { ContextMenuItemOptions, useContextMenu } from 'mantine-contextmenu';
import { useClipboard } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

function useMenuList(nodeId: string) {
  const {
    createPage,
    deletePage,
    setClipboard,
    cutToPage,
    cutToSubpage,
    copyToPage,
    copyToSubpage,
    patchPage,
  } = usePageStore((s) => s.actions);
  const docClipboard = useClipboard({ timeout: 500 });
  const pageNavNodes = usePageStore((s) => s.pageNavNodes);
  const clipboardRelated = usePageStore(selectClipboardRelated);
  const menu = useMemo<ContextMenuItemOptions[]>(() => {
    const node = pageNavNodes.find((t) => t.id === nodeId);
    if (!node) {
      return [];
    }
    const shouldDisableInsert = clipboardRelated
      ? !!clipboardRelated?.selfInclusive.find((t) => t.id === node.id)
      : true;
    const menu: ContextMenuItemOptions[] = [
      {
        key: 'New Subpage',
        title: 'New Subpage',
        color: 'blue',
        icon: <IconPlus size={16} />,
        onClick: () => {
          createPage(
            {
              isPublic: node.isPublic,
            },
            node.id
          )
            .then((pageId) => {
              navigate(`/${pageId}`);
            })
            .catch(apiErrorHandler);
        },
      },
      {
        key: 'Copy link',
        title: 'Copy link',
        icon: <IconLink size={16} />,
        onClick: () => {
          const link = window.location.origin + `/${node.id}`;
          docClipboard.copy(link);
          notifications.show({
            title: 'Link copied',
            message: link,
            color: 'green',
          });
        },
      },
      {
        key: 'Visibility',
        title: 'Set to ' + (node.isPublic ? 'Private' : 'Public'),
        icon: <IconEye size={16} />,
        onClick: () => {
          patchPage({
            id: node.id,
            isPublic: !node.isPublic,
          }).catch(apiErrorHandler);
        },
      },
      { key: 'divider1' },
      {
        key: 'Duplicate',
        title: 'Duplicate',
        icon: <IconCopyPlus size={16} />,
        onClick: () => {
          copyToPage({
            from: node.id,
            to: node.id,
            start: 1,
          }).catch(apiErrorHandler);
        },
      },
      {
        key: 'Copy to...',
        title: 'Copy to...',
        icon: <IconCopy size={16} />,
        onClick: () => {
          setClipboard(node.id, 'copy');
        },
      },
      {
        key: 'Cut to...',
        title: 'Cut to...',
        icon: <IconCut size={16} />,
        onClick: () => {
          setClipboard(node.id, 'cut');
        },
      },
      { key: 'divider2' },
      {
        key: 'Insert above',
        title: 'Insert above',
        icon: <IconArrowUp size={16} />,
        disabled: shouldDisableInsert,
        onClick: () => {
          if (clipboardRelated) {
            const { clipboardMode, clipboardPageId } = clipboardRelated;
            const handle = clipboardMode === 'cut' ? cutToPage : copyToPage;
            handle({
              from: clipboardPageId,
              to: node.id,
              start: 0,
            }).catch(apiErrorHandler);
          }
        },
      },
      {
        key: 'Insert as subpage',
        title: 'Insert as subpage',
        icon: <IconArrowRight size={16} />,
        disabled: shouldDisableInsert,
        onClick: () => {
          if (clipboardRelated) {
            const { clipboardMode, clipboardPageId } = clipboardRelated;
            const handle =
              clipboardMode === 'cut' ? cutToSubpage : copyToSubpage;
            handle({
              from: clipboardPageId,
              to: node.id,
            }).catch(apiErrorHandler);
          }
        },
      },
      {
        key: 'Insert below',
        title: 'Insert below',
        icon: <IconArrowDown size={16} />,
        disabled: shouldDisableInsert,
        onClick: () => {
          if (clipboardRelated) {
            const { clipboardMode, clipboardPageId } = clipboardRelated;
            const handle = clipboardMode === 'cut' ? cutToPage : copyToPage;
            handle({
              from: clipboardPageId,
              to: node.id,
              start: 1,
            }).catch(apiErrorHandler);
          }
        },
      },
      {
        key: 'Clear clipboard',
        title: 'Clear clipboard',
        icon: <IconBackslash size={16} />,
        disabled: !clipboardRelated,
        onClick: () => {
          setClipboard('', 'copy');
        },
      },
      { key: 'divider3' },
      {
        key: 'Remove',
        color: 'red',
        title: 'Remove',
        icon: <IconTrash size={16} />,
        onClick: () => {
          modals.openConfirmModal({
            title: 'Please confirm your action',
            children: (
              <Text size="sm">
                This action will remove the page and all its subpages. Please
                click one of these buttons to proceed.
              </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: () => {
              deletePage(node.id).catch(apiErrorHandler);
            },
          });
        },
      },
    ];
    return menu;
  }, [
    clipboardRelated,
    copyToPage,
    copyToSubpage,
    createPage,
    cutToPage,
    cutToSubpage,
    deletePage,
    docClipboard,
    nodeId,
    pageNavNodes,
    patchPage,
    setClipboard,
  ]);
  return menu;
}

export const PageActionsClickMenu: React.FC<{
  nodeId: string;
  actionIconProps?: React.ComponentProps<typeof ActionIcon>;
  triggerType?: React.ComponentProps<typeof Menu>['trigger'];
}> = ({ nodeId, actionIconProps, triggerType }) => {
  const menu = useMenuList(nodeId);
  return (
    <>
      <Menu shadow="md" width={200} trigger={triggerType}>
        <Menu.Target>
          <ActionIcon
            {...actionIconProps}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
          {menu.map((t) => {
            if (!t.title) {
              return <Menu.Divider key={t.key} />;
            }
            return (
              <Menu.Item
                key={t.key}
                color={t.color}
                onClick={t.onClick}
                leftSection={t.icon}
                disabled={t.disabled}
              >
                {t.title}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export const useHandlePageActionsContextMenu = (nodeId: string) => {
  const menu = useMenuList(nodeId);
  const { showContextMenu } = useContextMenu();
  const handle = useMemo(() => {
    return showContextMenu(menu, { style: { width: 200 } });
  }, [menu, showContextMenu]);
  return handle;
};
