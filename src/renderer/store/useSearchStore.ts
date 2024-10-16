import { createZustandStore } from 'src/common/libs/createZustand';
import { Page, Pages } from 'src/common/type/page';
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
      (t) => t.page.id
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
  if (keywords.length < 2) {
    return [];
  }
  const words = keywords
    .toLowerCase()
    .split(' ')
    .map((t) => t.trim())
    .filter((t) => t);
  if (!words.length) {
    return [];
  }
  const results: {
    page: Page;
  }[] = [];
  pages.forEach((page) => {
    const { content } = page;
    const contentLower = content.toLowerCase();
    if (!words.every((w) => contentLower.includes(w))) {
      return;
    }
    results.push({ page });
  });

  return results;
}
