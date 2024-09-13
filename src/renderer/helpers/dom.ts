export function findMatchedAncestorElement(
  target: HTMLElement,
  predicate: (parentElement: HTMLElement) => boolean
) {
  let el: HTMLElement | null = target;
  while (el) {
    if (predicate(el)) {
      break;
    }
    el = el.parentElement;
  }
  return el;
}
