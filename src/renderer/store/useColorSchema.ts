import { createZustandStore } from 'src/common/libs/createZustand';

type ColorMode = 'light' | 'dark' | 'auto';
type ColorSchema = 'light' | 'dark';
interface Store {
  colorMode: ColorMode;
}
const defaultStore: Store = {
  colorMode: 'auto',
};
export const useColorSchema = createZustandStore(
  defaultStore,
  (set) => {
    return {
      actions: {
        setColorMode: (mode: ColorMode) => {
          set({ colorMode: mode });
        },
      },
    };
  },
  'ColorSchema'
);

export const selectColorSchema = (state: Store) => {
  if (state.colorMode === 'auto') {
    return getSystemColorSchema();
  }
  return state.colorMode as ColorSchema;
};

function getSystemColorSchema() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}
