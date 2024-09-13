import { createZustandStore } from 'src/common/libs/createZustand';

interface Store {
  appReady: boolean;
  serverError: boolean;
  socketOnline: boolean;
}

const defaultStore: Store = {
  serverError: false,
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
  const setServerError = (serverError: boolean) => {
    set({
      serverError,
    });
  };
  return {
    actions: { setAppReady, setSocketOnline, setServerError },
  };
});
