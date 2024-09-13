import { ScreenSizeLevel } from 'src/common/type/screenSize';
import { useScreenSizeStore } from '../../store/useScreenSizeStore';

export default function useIsLargeScreen() {
  const screenSizeLevel = useScreenSizeStore((s) => s.screenSizeLevel);

  return screenSizeLevel >= ScreenSizeLevel.Large;
}
