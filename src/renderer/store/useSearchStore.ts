import Fuse from 'fuse.js';
import { createZustandStore } from 'src/common/libs/createZustand';
import { Pages } from 'src/common/type/page';
import { usePageStore } from './usePageStore';

interface Store {
  inputValue: string;
  matchIds: string[];
}

const defaultStore: Store = {
  inputValue: '',
  matchIds: [],
};

export const useSearchStore = createZustandStore(defaultStore, (set, get) => {
  const setInputValue = (inputValue = '') => {
    set({
      inputValue,
    });
  };
  const reset = () => {
    set({
      inputValue: '',
      matchIds: [],
    });
  };
  const searchKeywords = async () => {
    const { inputValue } = get();
    const { pages } = usePageStore.getState();
    const matchIds = searchKeywordsFromPages(inputValue, pages).map(
      (t) => t.item.id
    );
    set({
      matchIds,
    });
  };
  return {
    actions: { setInputValue, searchKeywords, reset },
  };
});

function searchKeywordsFromPages(keywords: string, pages: Pages) {
  const fuse = new Fuse(pages, {
    includeScore: true,
    ignoreLocation: true,
    useExtendedSearch: true,
    keys: [
      {
        name: 'title',
        weight: 1.2,
      },
      {
        name: 'content',
        weight: 1.0,
      },
    ],
  });
  const results = fuse.search(keywords);
  return results;
}
