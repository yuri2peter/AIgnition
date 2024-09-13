import { ROOT_PAGE_ID } from 'src/common/type/page';

export function readClipboardText() {
  return new Promise((resolve) => {
    window.navigator.clipboard
      .readText()
      .then(resolve)
      .catch(() => resolve(''));
  });
}

export function getPageRoute(pageId = '') {
  if (!pageId || pageId === ROOT_PAGE_ID) {
    return '/';
  } else {
    return `/${pageId}`;
  }
}

export function getPageTitleFixed(pageTitle: string) {
  return pageTitle || 'Untitled';
}
