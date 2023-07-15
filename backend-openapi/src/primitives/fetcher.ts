import { JSDOM } from "jsdom";
import {
  FetchPackType,
  IUrlFetcher
} from "../domain/common-interfaces";
import { HttpUrlMatcher } from "./matcher";
import { getCurrentTime } from "./functions";

class MockUrlFetcher implements IUrlFetcher {

  private readonly map: Map<string, FetchPackType>;

  private static readonly links: string[] = [
    "http://www.example.com/1", "http://www.example.com/2", "http://www.example.com/3"
  ];

  private static readonly crawlTime: string = getCurrentTime();

  public constructor() {
    this.map = new Map<string, FetchPackType>([
      [
        "http://www.example.com/1",
        { title: "Example web 1", links: MockUrlFetcher.links, crawlTime: MockUrlFetcher.crawlTime }
      ],
      [
        "http://www.example.com/2",
        { title: "Example web 2", links: MockUrlFetcher.links, crawlTime: MockUrlFetcher.crawlTime }
      ],
      [
        "http://www.example.com/3",
        { title: "Example web 3", links: MockUrlFetcher.links, crawlTime: MockUrlFetcher.crawlTime }
      ]
    ]);
  }

  public fetch(baseUrl: string): Promise<FetchPackType> {
    return new Promise((res, _) => {
      res(this.map.get(baseUrl) ?? { title: null, links: [], crawlTime: MockUrlFetcher.crawlTime });
    });
  }
}

class StandardUrlFetcher implements IUrlFetcher {

  /**
   * Cap URL length with respect to the database.
   */
  static readonly URL_MAX_LENGTH: number = 2048;

  /**
   * Cap title length.
   */
  static readonly TITLE_MAX_LENGTH: number = 1024;

  static readonly fetchOptions = {
    method: "GET",
    headers: {
      "Accept": "text/html; charset=utf-8"
    }
  };

  private static readonly matcher = new HttpUrlMatcher();

  /**
   * Try parse url and remove possible http #fragment.
   */
  private normalizaUrl(url: string, baseUrl: string) {
    try {
      const o = new URL(url, baseUrl);
      o.hash = "";

      const u = o.href;
      const p = StandardUrlFetcher.matcher.match(u) && u.length <= StandardUrlFetcher.URL_MAX_LENGTH;

      return (p) ? u : undefined;
    }
    catch (_) { return undefined; }
  }

  public async fetch(baseUrl: string): Promise<FetchPackType> {
    const crawlTime = getCurrentTime();

    try {
      const res = await fetch(baseUrl, StandardUrlFetcher.fetchOptions);
      const dom = new JSDOM(await res.text()).window.document;

      const links = [...dom.getElementsByTagName("a")]
        .map((a) => a.href)
        .map((u) => this.normalizaUrl(u, baseUrl))
        .filter((n) => n !== undefined) as string[];

      const titles = [...dom.getElementsByTagName("title")]
        .map((e) => e.innerHTML)
        .map((t) => t.slice(0, StandardUrlFetcher.TITLE_MAX_LENGTH));

      return { title: titles[0] ?? null, links: links, crawlTime: crawlTime };
    }
    catch (_) { return { title: null, links: [], crawlTime: crawlTime }; }
  }
}

/**
 * Factory function.
 */
export function getUrlFetcher(): IUrlFetcher {
  return new MockUrlFetcher();
}
