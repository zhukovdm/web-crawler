const PAGINATE_PAGE_SIZE = 5;

export function getFirstPage<T>(arr: T[]): T[] {
  return arr.slice(0, PAGINATE_PAGE_SIZE);
}

export function getPageCount(itemCount: number): number {
  const whole = Math.floor(itemCount / PAGINATE_PAGE_SIZE);
  return Math.max(1, whole + ((whole * PAGINATE_PAGE_SIZE < itemCount) ? 1 : 0));
}

export function updatePage<T>(curPage: number, arr: T[]): [number, T[]] {
  const basePage = Math.min(curPage, getPageCount(arr.length));
  const baseOffset = (basePage - 1) * PAGINATE_PAGE_SIZE;

  return [basePage, arr.slice(baseOffset, baseOffset + PAGINATE_PAGE_SIZE)];
}
