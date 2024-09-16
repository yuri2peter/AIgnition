import { Box, Text } from '@mantine/core';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Tree,
  TreeEnvironmentRef,
  TreeRef,
  UncontrolledTreeEnvironment,
} from 'react-complex-tree';
import { ComputedPage } from 'src/common/type/page';
import {
  selectComputedPagesDfs,
  selectNavTreeDatas,
  selectRootNavNode,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import CustomRenderItem from './CustomRenderItem';
import { useContextMenu } from 'mantine-contextmenu';
import { openPageActionsMenu } from 'src/renderer/pages/page-view/miscs/openPageActionsMenu';
import { navigate } from 'src/renderer/hacks/navigate';
import { getPageRoute, getPageTitleFixed } from 'src/renderer/helpers/miscs';
import {
  useListenEventScrollToTop,
  useListenEventScrollToBottom,
  useListenEventOpenAllPages,
  useListenEventCloseAllPages,
  useListenEventFocusPage,
  useListenEventPageUpdated,
} from '../events';
import { getAncestorsNodes, getNodeById } from 'src/common/utils/tree';
import { waitUntil } from 'src/common/utils/time';
import CustomDataProvider from './CustomDataProvider';
import { modals } from '@mantine/modals';
import { apiErrorHandler } from 'src/renderer/helpers/api';
import { findMatchedAncestorElement } from 'src/renderer/helpers/dom';
import { CustomInteractionManager } from './CustomInteractionManager';
import { useUserStore } from 'src/renderer/store/useUserStore';

const TREE_ID = 'page-nav-tree-main';

const MainNavTree: React.FC<{}> = () => {
  const refWrapper = useRef<HTMLDivElement>(null);
  const refWrapperFocused = useRef(false);
  const loggedIn = useUserStore((s) => s.loggedIn);
  const pages = usePageStore(selectComputedPagesDfs);
  const { patchPage, deletePages } = usePageStore((s) => s.actions);
  const currentPageId = usePageStore((s) => s.currentPageId);
  const pageNavTreeDatas = usePageStore(selectNavTreeDatas);
  const rootNavNode = usePageStore(selectRootNavNode);
  const rootPageId = rootNavNode?.id;
  const refEnv =
    useRef<TreeEnvironmentRef<ComputedPage, 'expandedItems'>>(null);
  const refTree = useRef<TreeRef<ComputedPage>>(null);
  const { showContextMenu } = useContextMenu();
  const customInteractionManager = useMemo(() => {
    return new CustomInteractionManager();
  }, []);

  const dataProvider = useMemo(() => {
    return new CustomDataProvider<ComputedPage>({
      onItemChildrenChange: (itemId, newChildren) => {
        patchPage({ id: itemId as string, children: newChildren as string[] });
      },
    });
  }, [patchPage]);
  useEffect(() => {
    dataProvider.updateDataSource(pageNavTreeDatas);
  }, [dataProvider, pageNavTreeDatas]);

  const focusItem = useCallback(
    async (pageId: string) => {
      await waitUntil(() => !!refTree.current);
      const treeInstance = refTree.current!;
      const treePages = dataProvider
        .getTreeItemsAsArray()
        .map((t) => t.data) as ComputedPage[];
      const node = getNodeById(treePages, pageId);
      if (node) {
        treeInstance.selectItems([pageId]);
        const ancestorsNodeIds = getAncestorsNodes(treePages, node).map(
          (t) => t.id
        );
        await treeInstance.expandSubsequently(ancestorsNodeIds);
        document
          .querySelector(`.rct-tree-item-button[data-rct-item-id="${node.id}"]`)
          ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    },
    [dataProvider]
  );

  useListenEventPageUpdated((pageIds: string[]) => {
    dataProvider.emitDidChangeTreeData(pageIds);
  });

  useEffect(() => {
    focusItem(currentPageId);
  }, [focusItem, currentPageId]);

  useListenEventScrollToTop(() => {
    refWrapper.current?.scrollTo({ top: 0, behavior: 'smooth' });
  });
  useListenEventScrollToBottom(() => {
    refWrapper.current?.scrollTo({
      top: 999999,
      behavior: 'smooth',
    });
  });
  useListenEventOpenAllPages(() => {
    refTree.current?.expandAll();
  });
  useListenEventCloseAllPages(() => {
    refTree.current?.collapseAll();
  });
  useListenEventFocusPage(async (pageId) => {
    focusItem(pageId);
  });

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if (refWrapperFocused.current) {
        // clear selection
        if (e.key === 'Escape') {
          e.preventDefault();
          refTree.current?.selectItems([currentPageId]);
        }
        // multi delete
        if (e.key === 'Delete') {
          e.preventDefault();
          const deleteIds = (refEnv.current?.viewState[TREE_ID]
            ?.selectedItems || []) as string[];
          if (deleteIds.length >= 2) {
            modals.openConfirmModal({
              title: 'Please confirm your action',
              children: (
                <Text size="sm">
                  This action will remove all the pages selected(
                  {deleteIds.length} items) and all its subpages. Please click
                  one of these buttons to proceed.
                </Text>
              ),
              labels: { confirm: 'Confirm', cancel: 'Cancel' },
              onConfirm: () => {
                deletePages(deleteIds).catch(apiErrorHandler);
              },
            });
          }
        }
      }
    };
    document.addEventListener('keydown', keydownHandler);
    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, [currentPageId, deletePages]);

  if (!rootPageId) {
    return null;
  }
  return (
    <Box
      ref={refWrapper}
      px={8}
      onFocus={() => {
        refWrapperFocused.current = true;
      }}
      onBlur={() => {
        refWrapperFocused.current = false;
      }}
      onContextMenu={(event) => {
        const el = findMatchedAncestorElement(
          event.target as HTMLElement,
          (parent) => Boolean(parent?.dataset?.rctItemId)
        );
        const itemId = el?.dataset?.rctItemId;
        if (itemId) {
          event.preventDefault();
          refTree.current?.selectItems([itemId]);
          openPageActionsMenu({
            itemId,
            showContextMenu,
            event,
          });
        }
      }}
    >
      <UncontrolledTreeEnvironment<ComputedPage, 'expandedItems'>
        ref={refEnv}
        canDragAndDrop
        canDropOnFolder
        canReorderItems
        canSearch={false}
        canRename={false}
        dataProvider={dataProvider}
        getItemTitle={(item) => getPageTitleFixed(item.data.title)}
        renderItem={(props) => CustomRenderItem({ ...props, loggedIn })}
        defaultInteractionMode={customInteractionManager}
        viewState={{
          [TREE_ID]: {
            expandedItems: [rootPageId],
          },
        }}
        onPrimaryAction={(item) => {
          navigate(getPageRoute(item.data.id));
        }}
      >
        {/* init state issues */}
        {pages.length > 0 ? (
          <Tree
            ref={refTree}
            treeId={TREE_ID}
            rootItem={rootPageId}
            treeLabel="Tree Pages"
          />
        ) : null}
      </UncontrolledTreeEnvironment>
    </Box>
  );
};

export default MainNavTree;
