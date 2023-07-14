import {
  IQueue,
  IUrlFetcher,
} from "../domain/common-interfaces";
import {
  ICrawlerModel,
} from "../domain/model-interfaces";
import { LinkedListQueue } from "./queue";
import { BoundaryUrlMatcher } from "./matcher";

export class Crawler {

  private readonly queue: IQueue<string>;
  private readonly model: ICrawlerModel;
  private readonly fetcher: IUrlFetcher;

  private readonly links = new Map<string, Set<string>>();

  constructor(model: ICrawlerModel, fetcher: IUrlFetcher) {
    this.queue = new LinkedListQueue();
    this.model = model;
    this.fetcher = fetcher;
  }

  public async crawl(exeId: number): Promise<void> {
    const boundary = await this.model.getExecutionBoundary(exeId);
    if (!boundary) { return; } // the execution has been removed

    const { url: baseUrl, regexp } = boundary;
    this.queue.enqueue(baseUrl);
    const matcher = new BoundaryUrlMatcher(baseUrl, regexp);

    while (!this.queue.empty()) {
      const url = this.queue.dequeue()!;

      if (!this.links.has(url)) {

        const { title, links } = matcher.match(url)
          ? (await this.fetcher.fetch(url))
          : { title: null, links: [] };

        links.forEach((link) => this.queue.enqueue(link));
      }
    }
  }
}
