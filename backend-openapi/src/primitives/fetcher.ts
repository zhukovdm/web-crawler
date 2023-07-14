import { JSDOM } from "jsdom";
import {
  FetchPackType,
  IUrlFetcher
} from "../domain/common-interfaces";
import { HttpUrlMatcher } from "./matcher";

class MockUrlFetcher implements IUrlFetcher {

  private readonly map: Map<string, FetchPackType>;

  private static readonly links: string[] = [
    "http://www.example.com/1", "http://www.example.com/2", "http://www.example.com/3"
  ];

  public constructor() {
    this.map = new Map<string, FetchPackType>([
      ["http://www.example.com/1", { title: "Example web 1", links: MockUrlFetcher.links }],
      ["http://www.example.com/2", { title: "Example web 2", links: MockUrlFetcher.links }],
      ["http://www.example.com/3", { title: "Example web 3", links: MockUrlFetcher.links }]
    ]);
  }

  public fetch(baseUrl: string): Promise<FetchPackType> {
    return new Promise((res, _) => {
      res(this.map.get(baseUrl) ?? { title: null, links: [] });
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

  public async fetch(baseUrl: string): Promise<FetchPackType> {
    try {
      const res = await fetch(baseUrl, StandardUrlFetcher.fetchOptions);
      const dom = new JSDOM(await res.text()).window.document;

      const matcher = new HttpUrlMatcher();

      const links = [...dom.getElementsByTagName("a")]
        .map((a) => a.href)
        .map((ref) => {
          try {
            // resolve relative links, can throw!
            const url = new URL(ref, baseUrl).href;
            const pre = matcher.match(url) && url.length <= StandardUrlFetcher.URL_MAX_LENGTH;

            return (pre) ? url : undefined;
          }
          catch (_) { return undefined; }
        })
        .filter((url) => url !== undefined);

      const titles = [...dom.getElementsByTagName("title")]
        .map((e) => e.innerHTML)
        .map((t) => t.slice(0, StandardUrlFetcher.TITLE_MAX_LENGTH));

      return { title: titles[0] ?? null, links: links as string[] };
    }
    catch (_) { return { title: null, links: [] } }
  }
}

/**
 * Factory function.
 */
export function getUrlFetcher(): IUrlFetcher {
  return new StandardUrlFetcher();
}
