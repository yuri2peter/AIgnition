import { createZustandStore } from 'src/common/libs/createZustand';

const defaultStore = { showLeft: false };
export const useMainLayoutStore = createZustandStore(defaultStore, (set) => {
  return {
    actions: {
      setShowLeft: (showLeft: boolean) => {
        set({ showLeft });
      },
    },
  };
});
