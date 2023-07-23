import { IQueue, IUrlFetcher } from "../domain/common-interfaces";
import { ICrawlerModel } from "../domain/model-interfaces";
import { LinkedListQueue } from "./queue";
import { BoundaryUrlMatcher } from "./matcher";

export class Crawler {

  private readonly exeId: number;
  private readonly queue: IQueue<string>;
  private readonly model: ICrawlerModel;
  private readonly fetcher: IUrlFetcher;

  private readonly nodes = new Map<string, { nodId: number, processed: boolean }>();

  constructor(exeId: number, model: ICrawlerModel, fetcher: IUrlFetcher) {
    this.exeId = exeId;

    /**
     * Contains URLs that are not processed.
     */
    this.queue = new LinkedListQueue();
    this.model = model;
    this.fetcher = fetcher;
  }

  private async ensureNode(url: string): Promise<void> {

    if (!this.nodes.has(url)) {
      this.nodes.set(url, {
        processed: false,
        ...(await this.model.createNode(this.exeId, url))
      });
    }
  }

  public async crawl(): Promise<void> {
    let counter = 0;
    const boundary = await this.model.getExecutionBoundary(this.exeId);

    if (!boundary) { return; } // removed exeId

    const { url: sourceUrl, regexp } = boundary;

    this.queue.enqueue(sourceUrl);
    await this.ensureNode(sourceUrl);
    const matcher = new BoundaryUrlMatcher(sourceUrl, regexp);

    do {
      const url = this.queue.dequeue()!;
      const node = this.nodes.get(url)!;

      if (node.processed) { continue; }

      node.processed = true;
      const { links, title, crawlTime } = matcher.match(url)
        ? (await this.fetcher.fetch(url))
        : { title: null, crawlTime: null, links: [] };

      if (matcher.match(url)) {
        await this.model.updateExecutionSitesCrawl(this.exeId, ++counter);
      }

      await this.model.updateNode(node.nodId, title, crawlTime);

      for(const link of links) {
        this.queue.enqueue(link);
        await this.ensureNode(link);
        await this.model.createLink(node.nodId, this.nodes.get(link)!.nodId);
      }
    } while (!this.queue.empty());
  }
}
