import { createZustandStore } from 'src/common/libs/createZustand';
import {
  ScreenSizeLevel,
  ScreenSizeLevelBreakpoints,
} from 'src/common/type/screenSize';

interface Store {
  screenSizeLevel: ScreenSizeLevel;
}
const defaultStore: Store = {
  screenSizeLevel: getScreenSizeLevel(),
};
export const useScreenSizeStore = createZustandStore(defaultStore, () => {
  return {
    actions: {},
  };
});

function getScreenSizeLevel(): ScreenSizeLevel {
  const width = window.innerWidth;
  if (width < ScreenSizeLevelBreakpoints.Small) {
    return ScreenSizeLevel.Small;
  }
  if (width < ScreenSizeLevelBreakpoints.Medium) {
    return ScreenSizeLevel.Medium;
  }
  return ScreenSizeLevel.Large;
}

window.addEventListener('resize', () => {
  useScreenSizeStore.setState({ screenSizeLevel: getScreenSizeLevel() });
});
