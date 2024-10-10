import { createZustandStore } from 'src/common/libs/createZustand';
import { api } from '../helpers/api';
import { getParsedId } from 'src/common/utils/type';
import {
  ComputedPage,
  Page,
  PageSchema,
  PagesSchema,
  ROOT_PAGE_ID,
  TRASH_PAGE_ID,
} from 'src/common/type/page';
import { createSelector } from 'reselect';
import { decode } from 'js-base64';
import { navigate } from '../hacks/navigate';
import { getPageRoute } from '../helpers/miscs';
import {
  dfsTraversal,
  getNodeById,
  getCurrentTreeNodeRelated,
  getAncestorsNodes,
} from 'src/common/utils/tree';
import { MyTreeItem } from '../pages/page-view/C2/panels/PageNav/MainNavTree/defines';
import { isEqual } from 'lodash';
import {
  emitEventPageUpdated,
  emitEventReloadTree,
} from '../pages/page-view/C2/panels/PageNav/events';
import { useMainLayoutStore } from './useMainLayoutStore';
interface Store {
  pagesLoaded: boolean;
  pageFetchError: boolean;
  pages: Page[];
  currentPageId: string;
}

const defaultStore: Store = {
  pagesLoaded: false,
  pageFetchError: false,
  pages: [],
  currentPageId: '',
};

export const usePageStore = createZustandStore(defaultStore, (set, get) => {
  const pullPages = async () => {
    const { data } = await api().post('/api/page/get-all-items');
    const pages = PagesSchema.parse(data);
    set({
      pages,
      pagesLoaded: true,
    });
    emitEventPageUpdated(pages.map((t) => t.id));
  };
  const clearPages = () => {
    set({ pages: [], pagesLoaded: false, pageFetchError: false });
  };
  const pullGuestPages = async (id: string) => {
    const { data } = await api().post('/api/page/get-guest-items', {
      id,
    });
    const pages = PagesSchema.parse(JSON.parse(decode(data.pages)));
    set({
      pages,
      pagesLoaded: true,
    });
    emitEventPageUpdated(pages.map((t) => t.id));
  };
  const createPage = async ({
    item = {},
    parent = ROOT_PAGE_ID,
    noEffects = false,
  }: {
    item?: Partial<Page>;
    parent?: string;
    noEffects?: boolean;
  }) => {
    const { data } = await api().post('/api/page/create-item', {
      item,
      parent,
    });
    const newPage = PageSchema.parse(data);
    if (!noEffects) {
      await pullPages();
      emitEventPageUpdated([parent]);
      navigate(getPageRoute(newPage.id));
      useMainLayoutStore.getState().actions.setShowLeft(false);
    }
    return newPage.id;
  };
  const duplicatePage = async (pageId: string) => {
    const pages = selectComputedPagesDfs(get());
    const currentPage = getNodeById(pages, pageId)!;
    const parentId = currentPage.computed.parent!;
    const { data } = await api().post('/api/page/duplicate-item', {
      id: pageId,
    });
    const id = getParsedId(data);
    await pullPages();
    emitEventPageUpdated([parentId]);
    navigate(getPageRoute(id));
  };
  const deletePage = async (pageId: string, noEffects = false) => {
    await api().post('/api/page/delete-item', {
      id: pageId,
    });
    if (!noEffects) {
      const pages = selectComputedPagesDfs(get());
      const currentPage = getNodeById(pages, pageId)!;
      const parentId = currentPage.computed.parent!;
      await pullPage(parentId);
      emitEventPageUpdated([parentId]);
    }
  };
  const deletePages = async (ids: string[]) => {
    if (ids.length === 0) {
      return;
    }
    for (const id of ids) {
      await deletePage(id, true);
    }
    await pullPages();
    emitEventReloadTree();
  };
  const clearTrash = async () => {
    const pages = selectComputedPagesDfs(get());
    const trashPage = getNodeById(pages, TRASH_PAGE_ID)!;
    await deletePages(trashPage.children);
  };
  const setCurrentPageId = (currentPageId: string) => {
    set({ currentPageId });
  };
  const pullPage = async (id: string) => {
    const { data } = await api().post('/api/page/get-item', {
      id,
    });
    set((d) => {
      const page = getNodeById(d.pages, id);
      if (page) {
        const newPage = PageSchema.parse(data);
        if (!isEqual(page, newPage)) {
          Object.assign(page, newPage);
        }
        emitEventPageUpdated([id]);
      }
    });
  };
  const patchPage = async (item: Partial<Page> & { id: string }) => {
    const { id } = item;
    if (!id) {
      return;
    }
    await api().post('/api/page/patch-item', item);
    await pullPage(id);
  };
  const changeId = async ({ from, to }: { from: string; to: string }) => {
    await api().post('/api/page/change-id', {
      from,
      to,
    });
    navigate(getPageRoute(to));
    await pullPages();
  };

  const setPagesLoaded = (pagesLoaded: boolean) => {
    set({ pagesLoaded });
  };

  const moveToTrash = async (pageId: string) => {
    const pages = selectComputedPagesDfs(get());
    const currentPage = getNodeById(pages, pageId)!;
    const parentId = currentPage.computed.parent!;
    const parentPage = getNodeById(pages, parentId)!;
    await patchPage({
      id: pageId,
      isPublicFolder: false,
      isFavorite: false,
    });
    await patchPage({
      id: parentId,
      children: parentPage.children.filter((t) => t !== pageId),
    });
    const trashPage = getNodeById(pages, TRASH_PAGE_ID)!;
    await patchPage({
      id: TRASH_PAGE_ID,
      children: [...trashPage.children, pageId],
    });
  };

  const movePagesToTrash = async (pageIds: string[]) => {
    await api().post('/api/page/move-items-to-trash', { ids: pageIds });
    await pullPages();
    emitEventReloadTree();
  };

  const updateOpenedAtForCurrentPage = async () => {
    await patchPage({
      id: get().currentPageId,
      openedAt: Date.now(),
    });
  };

  return {
    actions: {
      pullPages,
      createPage,
      setCurrentPageId,
      pullPage,
      deletePage,
      patchPage,
      changeId,
      duplicatePage,
      deletePages,
      setPagesLoaded,
      pullGuestPages,
      clearPages,
      clearTrash,
      moveToTrash,
      movePagesToTrash,
      updateOpenedAtForCurrentPage,
    },
  };
});

export const selectComputedPagesDfs = createSelector(
  (s: Store) => s.pages,
  (pages) => {
    const rootPage = getNodeById(pages, ROOT_PAGE_ID) || pages[0];
    if (!rootPage) {
      return [];
    }
    // reorder by dfs
    const orderedPages: ComputedPage[] = [];
    dfsTraversal(pages, rootPage, (node) => {
      const ancestorsNodes = getAncestorsNodes(pages, node);
      const computedPage: ComputedPage = {
        ...node,
        computed: {
          parent: ancestorsNodes[ancestorsNodes.length - 1]?.id,
          isPublic: [node, ...ancestorsNodes].some(
            (t) => t.isFolder && t.isPublicFolder
          ),
          isTrash: ancestorsNodes.some((t) => t.id === TRASH_PAGE_ID),
        },
      };
      orderedPages.push(computedPage);
    });
    return orderedPages;
  }
);

export const selectNavTreeDatas = createSelector(
  selectComputedPagesDfs,
  (pages) => {
    const data: Record<string, MyTreeItem> = {};
    pages.forEach((page) => {
      const node: MyTreeItem = {
        id: page.id,
        index: page.id,
        children: page.children,
        isFolder: page.isFolder,
        canMove: ![ROOT_PAGE_ID, TRASH_PAGE_ID].includes(page.id),
        canRename: false,
        data: page,
      };
      data[node.index] = node;
    });
    return data;
  }
);

export const selectCurrentPage = createSelector(
  selectComputedPagesDfs,
  (s: Store) => s.currentPageId,
  (pages, currentPageId) => {
    return getNodeById(pages, currentPageId);
  }
);

export const selectCurrentNavTreeItem = createSelector(
  selectNavTreeDatas,
  (s: Store) => s.currentPageId,
  (navTreeDatas, currentPageId) => {
    return navTreeDatas[currentPageId];
  }
);
export const selectRootNavNode = createSelector(
  selectComputedPagesDfs,
  (pages) => pages.find((n) => n.id === ROOT_PAGE_ID) || pages[0]
);

export const selectContiguousPage = createSelector(
  (s: Store) => s.currentPageId,
  selectComputedPagesDfs,
  (currentPageId, pages) => {
    const results: {
      currentPage?: Page;
      prevPage?: Page;
      nextPage?: Page;
    } = {
      currentPage: undefined,
      prevPage: undefined,
      nextPage: undefined,
    };
    results.currentPage = getNodeById(pages, currentPageId);
    if (!results.currentPage) {
      return results;
    }
    const currentIndex = pages.findIndex((t) => t.id === currentPageId);

    return {
      currentPage: getNodeById(pages, currentPageId),
      prevPage: pages[currentIndex - 1],
      nextPage: pages[currentIndex + 1],
    };
  }
);

export const selectFavoritePages = createSelector(
  selectComputedPagesDfs,
  (pages) => {
    return pages.filter((t) => t.isFavorite);
  }
);

export const selectPublicFolders = createSelector(
  selectComputedPagesDfs,
  (pages) => {
    return pages.filter((t) => t.isFolder && t.isPublicFolder);
  }
);

export const selectCurrentTreeNodeRelated = createSelector(
  (s: Store) => s.currentPageId,
  selectComputedPagesDfs,
  (currentPageId, pages) => {
    const currentNode = getNodeById(pages, currentPageId);
    if (currentNode) {
      return getCurrentTreeNodeRelated(pages, currentNode);
    } else {
      return null;
    }
  }
);

export const selectRecentlyOpenedPages = createSelector(
  selectComputedPagesDfs,
  (pages) => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const threeDays = 3 * oneDay;

    const sortedPages = [...pages]
      .filter((page) => !page.computed.isTrash)
      .sort((a, b) => b.openedAt - a.openedAt);

    const lastDay = sortedPages.filter((page) => now - page.openedAt <= oneDay);
    const lastThreeDays = sortedPages.filter((page) => {
      const timeDiff = now - page.openedAt;
      return timeDiff > oneDay && timeDiff <= threeDays;
    });

    return {
      lastDay,
      lastThreeDays,
    };
  }
);
