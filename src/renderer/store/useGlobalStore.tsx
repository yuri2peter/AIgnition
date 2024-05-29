import { createZustandStore } from 'src/common/libs/createZustand';

interface Store {
  appReady: boolean;
  socketOnline: boolean;
}

const defaultStore: Store = {
  appReady: false,
  socketOnline: false,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useGlobalStore = createZustandStore(defaultStore, (set, get) => {
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
