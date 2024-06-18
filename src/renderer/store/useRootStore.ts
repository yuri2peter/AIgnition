import { createZustandStore } from 'src/common/libs/createZustand';

interface Store {
  appReady: boolean;
  socketOnline: boolean;
}

const defaultStore: Store = {
  appReady: false,
  socketOnline: false,
};

export const useRootStore = createZustandStore(defaultStore, (set) => {
  const setAppReady = (appReady: boolean) => {
    set({
      appReady,
    });
  };
  const setSocketOnline = (socketOnline: boolean) => {
    set({
      socketOnline,
    });
  };
  return {
    actions: { setAppReady, setSocketOnline },
  };
});
