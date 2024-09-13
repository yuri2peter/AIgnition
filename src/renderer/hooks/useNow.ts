import { now } from 'lodash';
import { useEffect, useState } from 'react';

export function useNow(ms = 1000) {
  const [time, setTime] = useState(now());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(now());
    }, ms);
    return () => clearInterval(interval);
  }, [ms]);
  return time;
}
