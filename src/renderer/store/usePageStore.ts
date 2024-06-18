import { createZustandStore } from 'src/common/libs/createZustand';
import { api, apiErrorHandler } from '../helpers/api';
import { getParsedId } from 'src/common/utils/type';
import {
  Page,
  PageInfo,
  PageInfoSchema,
  PageInfos,
  PageInfosSchema,
  PageSchema,
  ROOT_PAGE_ID,
} from 'src/common/type/page';
import { findFlatRelatives } from 'src/common/utils/tree';
import { createSelector } from 'reselect';
import { navigate } from '../hacks/navigate';

// Page Navigation Tree Structure (Recursive)
export type PageNavNode = {
  opened: boolean;
  actived: boolean;
} & PageInfo;

interface Store {
  pageInfos: PageInfos;
  currentPageId: string;
  currentPage: Page | null;
  pageNavNodes: PageNavNode[];
  clipboardPageId: string;
  clipboardMode: 'copy' | 'cut';
}

const defaultStore: Store = {
  pageInfos: [],
  currentPageId: '',
  clipboardMode: 'copy',
  clipboardPageId: '',
  pageNavNodes: [],
  currentPage: null,
};

export const usePageStore = createZustandStore(defaultStore, (set, get) => {
  const pullPageInfos = async () => {
    const { data } = await api().post('/api/page/get-infos');
    set({
      pageInfos: PageInfosSchema.parse(data),
    });
    calcPageNavNodes();
  };
  const createPage = async (item: Partial<Page> = {}, parentId: string) => {
    const { data } = await api().post('/api/page/create-item', {
      item,
      parentId,
    });
    const id = getParsedId(data);
    pullPageInfos().catch(apiErrorHandler);
    return id;
  };
  const deletePage = async (id: string) => {
    await api().post('/api/page/delete-item', {
      id,
    });
    const { children, current, parent } = findFlatRelatives(
      get().pageNavNodes,
      id
    );
    if ([...children, current].find((t) => t.id === get().currentPageId)) {
      navigate(parent.id === ROOT_PAGE_ID ? '/' : `/${parent.id}`);
    }
    await pullPageInfos();
  };
  const setCurrentPageId = (currentPageId: string) => {
    set({ currentPageId });
  };
  const setClipboard = (
    clipboardPageId: string,
    clipboardMode: 'copy' | 'cut'
  ) => {
    set({ clipboardPageId, clipboardMode });
  };
  const calcPageNavNodes = () => {
    const { pageInfos, currentPageId, pageNavNodes: prevNodes } = get();
    const pageNavNodes: PageNavNode[] = pageInfos.map((p) => {
      let opened = false;
      const prevNode = prevNodes.find((t) => t.id === p.id);
      if (prevNode) {
        opened = prevNode.opened;
      }
      return {
        ...p,
        opened,
        actived: false,
      };
    });
    const currentNode = pageNavNodes.find((n) => n.id === currentPageId);
    if (currentNode) {
      const { parents, current } = findFlatRelatives(
        pageNavNodes,
        currentNode.id
      );
      [...parents, current].forEach((node) => {
        node.actived = true;
        node.opened = true;
      });
    }
    set({
      pageNavNodes,
    });
  };
  const tooglePageNavNodeOpened = (id: string) => {
    set((d) => {
      const node = d.pageNavNodes.find((n) => n.id === id)!;
      node.opened = !node.opened;
      if (!node.opened) {
        // close all children nodes
        const { children } = findFlatRelatives(d.pageNavNodes, node.id);
        children.forEach((t) => (t.opened = false));
      }
    });
  };
  const pullCurrentPage = async () => {
    set({
      currentPage: null,
    });
    const { currentPageId } = get();
    if (!currentPageId) {
      return;
    }
    const { data } = await api().post('/api/page/get-item', {
      id: currentPageId,
    });
    set({
      currentPage: PageSchema.parse(data),
    });
  };
  const cutToPage = async ({
    from,
    to,
    start,
  }: {
    from: string;
    to: string;
    start: number;
  }) => {
    const { data } = await api().post('/api/page/cut-to-page', {
      from,
      to,
      start,
    });
    const id = getParsedId(data);
    setClipboard('', 'cut');
    navigate(`/${id}`);
    await pullPageInfos();
  };
  const cutToSubpage = async ({ from, to }: { from: string; to: string }) => {
    const { data } = await api().post('/api/page/cut-to-subpage', {
      from,
      to,
    });
    const id = getParsedId(data);
    setClipboard('', 'cut');
    navigate(`/${id}`);
    await pullPageInfos();
  };
  const copyToPage = async ({
    from,
    to,
    start,
  }: {
    from: string;
    to: string;
    start: number;
  }) => {
    const { data } = await api().post('/api/page/copy-to-page', {
      from,
      to,
      start,
    });
    const id = getParsedId(data);
    setClipboard('', 'copy');
    navigate(`/${id}`);
    await pullPageInfos();
  };
  const copyToSubpage = async ({ from, to }: { from: string; to: string }) => {
    const { data } = await api().post('/api/page/copy-to-subpage', {
      from,
      to,
    });
    const id = getParsedId(data);
    setClipboard('', 'copy');
    navigate(`/${id}`);
    await pullPageInfos();
  };
  const patchPage = async (item: Partial<Page> & { id: string }) => {
    const { id, ...data } = item;
    if (!id) {
      return;
    }
    set((d) => {
      if (d.currentPage?.id === id) {
        d.currentPage = {
          ...d.currentPage,
          ...data,
        };
      }
      const pageInfo = d.pageInfos.find((t) => t.id === id);
      if (pageInfo) {
        const newPageInfo = PageInfoSchema.parse({
          ...pageInfo,
          ...item,
        });
        Object.assign(pageInfo, newPageInfo);
      }
    });
    await api().post('/api/page/patch-item', item);
  };
  return {
    actions: {
      pullPageInfos,
      createPage,
      setCurrentPageId,
      calcPageNavNodes,
      tooglePageNavNodeOpened,
      pullCurrentPage,
      deletePage,
      setClipboard,
      cutToPage,
      cutToSubpage,
      copyToPage,
      copyToSubpage,
      patchPage,
    },
  };
});

export const selectRootPageNavNode = createSelector(
  (s: Store) => s.pageNavNodes,
  (pageNavNodes) => pageNavNodes.find((n) => n.id === ROOT_PAGE_ID)
);

export const selectClipboardRelated = createSelector(
  (s: Store) => s.pageNavNodes,
  (s: Store) => s.clipboardPageId,
  (s: Store) => s.clipboardMode,
  (pageNavNodes, clipboardPageId, clipboardMode) => {
    if (!pageNavNodes.find((n) => n.id === clipboardPageId)) {
      return null;
    }
    return {
      clipboardPageId,
      clipboardMode,
      ...findFlatRelatives(pageNavNodes, clipboardPageId),
    };
  }
);
