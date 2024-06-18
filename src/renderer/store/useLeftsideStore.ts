import { createZustandStore } from 'src/common/libs/createZustand';

interface Store {
  activedSectionId: string;
}

const defaultStore: Store = {
  activedSectionId: 'pages',
};

export const useLeftsideStore = createZustandStore(defaultStore, (set) => {
  const setActivedSectionId = (activedSectionId = '') => {
    set({
      activedSectionId,
    });
  };
  return {
    actions: { setActivedSectionId },
  };
});
