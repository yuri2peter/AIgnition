import { em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const breakPoint = 980;

export function useMobile() {
  const isMobile = useMediaQuery(
    `(max-width: ${em(breakPoint)})`,
    document.body.clientWidth < breakPoint
  );
  return isMobile;
}
