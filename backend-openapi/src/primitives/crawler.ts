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

  private readonly nodes = new Map<string, { nodId: number, links: string[] }>();

  constructor(model: ICrawlerModel, fetcher: IUrlFetcher) {
    this.queue = new LinkedListQueue();
    this.model = model;
    this.fetcher = fetcher;
  }

  public async crawl(exeId: number): Promise<void> {
    const boundary = await this.model.getExecutionBoundary(exeId);

    // the execution has been removed
    if (!boundary) { return; }

    const { url: baseUrl, regexp } = boundary;
    this.queue.enqueue(baseUrl);
    const matcher = new BoundaryUrlMatcher(baseUrl, regexp);

    while (!this.queue.empty()) {
      const url = this.queue.dequeue()!;

      if (!this.nodes.has(url)) {

        const { title, links, crawlTime } = matcher.match(url)
          ? (await this.fetcher.fetch(url))
          : { title: null, links: [], crawlTime: null };

        const { nodId } = await this.model.createNode({
          exeId: exeId, url: url, title: title, crawlTime: crawlTime
        });

        // the execution has been removed
        if (nodId === null) { return; }

        this.nodes.set(url, { nodId: nodId, links: links });
        links.forEach((link) => this.queue.enqueue(link));
      }
    }

    for (const node of this.nodes.keys()) {
      const { nodId: nodFr, links } = this.nodes.get(node)!;

      for (const link of links) {
        const { nodId: nodTo } = this.nodes.get(link)!;
        const { created } = await this.model.createLink(nodFr, nodTo);

        // the execution has been removed
        if (!created) { return; }
      }
    }
  }
}
