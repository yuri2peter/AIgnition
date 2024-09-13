import { ScreenSizeLevel } from 'src/common/type/screenSize';
import { useScreenSizeStore } from '../../store/useScreenSizeStore';

export default function useIsNotSmallScreen() {
  const screenSizeLevel = useScreenSizeStore((s) => s.screenSizeLevel);

  return screenSizeLevel >= ScreenSizeLevel.Small;
}
