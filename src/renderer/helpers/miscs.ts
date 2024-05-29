export function readClipboardText() {
  return new Promise((resolve) => {
    window.navigator.clipboard
      .readText()
      .then(resolve)
      .catch(() => resolve(''));
  });
}
