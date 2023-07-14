import { JSDOM } from "jsdom";
import {
  IQueue,
  IUrlFetcher,
} from "../domain/common-interfaces";
import {
  ICrawlerModel,
} from "../domain/model-interfaces";
import { LinkedListQueue } from "./queue";

class Boundary {

  constructor(baseUrl: string, regexp: string) {

  }

  public isValid(url: string) {  }
}

export class Crawler {

  private readonly queue: IQueue<string>;
  private readonly model: ICrawlerModel;
  private readonly fetcher: IUrlFetcher;

  private readonly links = new Map<string, Set<string>>();

  private extractUrls(baseUrl: string, txt: string): string[] {
    return [...new JSDOM(txt).window.document.getElementsByTagName("a")]
      .map((e) => {
        try {
          return new URL(e.href, baseUrl).href;
        } catch (_) { return undefined; }
      })
      .filter((u) => u !== undefined) as string[];
  }

  private matchLinks(urls: string[], regexp: string): string[] {
    return urls.filter((url) => new RegExp(regexp, "i").test(url));
  }

  constructor(model: ICrawlerModel, fetcher: IUrlFetcher) {
    this.queue = new LinkedListQueue();
    this.model = model;
    this.fetcher = fetcher;
  }

  public async crawl(exeId: number): Promise<void> {

    try {

    }
    catch (ex) {  }
  }
}
