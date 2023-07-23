import { JSDOM } from "jsdom";
import { FetchPackType, IUrlFetcher } from "../domain/common-interfaces";
import { HttpUrlMatcher } from "./matcher";
import { getCurrentTime } from "./functions";

class UrlFetcher implements IUrlFetcher {

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
  private normalizeUrl(url: string, baseUrl: string) {
    try {
      const o = new URL(url, baseUrl);
      o.hash = "";

      const u = o.href;
      const p = UrlFetcher.matcher.match(u) && u.length <= UrlFetcher.URL_MAX_LENGTH;

      return (p) ? u : undefined;
    }
    catch (_) { return undefined; }
  }

  public async fetch(baseUrl: string): Promise<FetchPackType> {

    await new Promise((res) => setTimeout(res, 1000)); // gentle fetching
    const crawlTime = getCurrentTime();

    try {
      const res = await fetch(baseUrl, UrlFetcher.fetchOptions);
      const dom = new JSDOM(await res.text()).window.document;

      const links = [...dom.getElementsByTagName("a")]
        .map((a) => a.href)
        .map((u) => this.normalizeUrl(u, baseUrl))
        .filter((n) => n !== undefined) as string[];

      const titles = [...dom.getElementsByTagName("title")]
        .map((e) => e.innerHTML)
        .map((t) => t.slice(0, UrlFetcher.TITLE_MAX_LENGTH));

      return {
        title: titles[0] ?? null,
        links: [...links.reduce((acc, l) => acc.add(l), new Set<string>())],
        crawlTime: crawlTime
      };
    }
    catch (_) { return { title: null, links: [], crawlTime: crawlTime }; }
  }
}

export class FetcherFactory {

  public static getUrlFetcher(): IUrlFetcher {
    return new UrlFetcher();
  }
}
