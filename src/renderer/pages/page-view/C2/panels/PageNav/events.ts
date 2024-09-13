import {
  useEventTrigger,
  useEventListener,
  eventEmitter,
} from 'src/renderer/hooks/useEvent';

const EVENT_PREFIX = 'PAGE_NAV_MAIN_';
const EVENT_SCROLL_TO_TOP = EVENT_PREFIX + 'EVENT_SCROLL_TO_TOP';
const EVENT_SCROLL_TO_BOTTOM = EVENT_PREFIX + 'EVENT_SCROLL_TO_BOTTOM';
const EVENT_CLOSE_ALL_PAGES = EVENT_PREFIX + 'EVENT_CLOSE_ALL_PAGES';
const EVENT_OPEN_ALL_PAGES = EVENT_PREFIX + 'EVENT_OPEN_ALL_PAGES';
export const EVENT_FOCUS_PAGE = EVENT_PREFIX + 'EVENT_FOCUS_PAGE';
const EVENT_PAGE_UPDATED = EVENT_PREFIX + 'EVENT_PAGE_UPDATED';
const EVENT_RELOAD_TREE = EVENT_PREFIX + 'EVENT_RELOAD_TREE';

export function useTriggerEventScrollToTop() {
  return useEventTrigger(EVENT_SCROLL_TO_TOP);
}

export function useListenEventScrollToTop(cb: () => void) {
  return useEventListener(EVENT_SCROLL_TO_TOP, cb);
}

export function useTriggerEventScrollToBottom() {
  return useEventTrigger(EVENT_SCROLL_TO_BOTTOM);
}

export function useListenEventScrollToBottom(cb: () => void) {
  return useEventListener(EVENT_SCROLL_TO_BOTTOM, cb);
}

export function useTriggerEventCloseAllPages() {
  return useEventTrigger(EVENT_CLOSE_ALL_PAGES);
}

export function useListenEventCloseAllPages(cb: () => void) {
  return useEventListener(EVENT_CLOSE_ALL_PAGES, cb);
}

export function useTriggerEventOpenAllPages() {
  return useEventTrigger(EVENT_OPEN_ALL_PAGES);
}

export function useListenEventOpenAllPages(cb: () => void) {
  return useEventListener(EVENT_OPEN_ALL_PAGES, cb);
}

export function useTriggerEventFocusPage() {
  return useEventTrigger(EVENT_FOCUS_PAGE);
}

export function useListenEventFocusPage(cb: (pageId: string) => void) {
  return useEventListener(EVENT_FOCUS_PAGE, cb);
}

export function useListenEventPageUpdated(cb: (pageId: string) => void) {
  return useEventListener(EVENT_PAGE_UPDATED, cb);
}

export function emitEventPageUpdated(pageId: string) {
  setTimeout(() => {
    eventEmitter.emit(EVENT_PAGE_UPDATED, pageId);
  }, 0);
}

export function useListenEventReloadTree(cb: () => void) {
  return useEventListener(EVENT_RELOAD_TREE, cb);
}

export function emitEventReloadTree() {
  setTimeout(() => {
    eventEmitter.emit(EVENT_RELOAD_TREE);
  }, 0);
}
