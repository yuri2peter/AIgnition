import EventEmitter from 'events';
import { useCallback, useEffect } from 'react';

export const eventEmitter = new EventEmitter();

export const useEventTrigger = (eventName: string) => {
  return useCallback(
    (data?: any) => {
      eventEmitter.emit(eventName, data);
    },
    [eventName]
  );
};

export const useEventListener = (
  eventName: string,
  eventHandle: (data?: any) => void
) => {
  useEffect(() => {
    eventEmitter.on(eventName, eventHandle);
    return () => {
      eventEmitter.removeListener(eventName, eventHandle);
    };
  }, [eventName, eventHandle]);
};
