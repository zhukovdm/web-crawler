export interface IDisposable {

  /**
   * Release allocated resources gracefully.
   */
  dispose(): void;
}

export interface IQueue<T> {

  /**
   * Check if the queue is empty.
   */
  empty(): boolean;

  /**
   * The provided item is added to the front of the queue.
   */
  prepend(item: T): void;

  /**
   * The provided item is added to the back of the queue.
   */
  enqueue(item: T): void;

  /**
   * Obtain an element at the front of the queue.
   */
  dequeue(): T | undefined;
}

export interface IExecutor {

  /**
   * Prioritize new execution.
   */
  prioritize(exeId: number): void;

  /**
   * Report execution upon crawling.
   */
  reportCrawled(exeId: number): void;
}

export type FetchPackType = {

  /**
   * The title of a page.
   */
  title: string | null;

  /**
   * Time of fetch.
   */
  crawlTime: string | null;

  /**
   * Links found in the page.
   */
  links: string[];
};

export interface IUrlFetcher {

  /**
   * Obtain a content on the base url, and extract a title and a list
   * of urls with http protocol.
   * @param baseUrl Valid absolute url with http(s) protocol.
   */
  fetch(baseUrl: string): Promise<FetchPackType>;
}

export interface IWorkerPool {

  /**
   * Acquire available worker.
   */
  acquire(): number | undefined;

  /**
   * Release acquired worker.
   */
  release(wrkId: number): void;

  /**
   * Start crawling of a given execution on an acquired worker.
   */
  crawl(exeId: number, wrkId: number): void;
}
