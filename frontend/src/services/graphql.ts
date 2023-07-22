import {
  NodeApiType,
  WebsiteType
} from "../domain/types";
import {
  GRAPHQL_ADDR,
  getErrorMessage
} from "./endpoint";

export class GraphQlService {

  private static readonly DEFAULT_MIME = "application/json";

  private static getOptions(body: any): RequestInit {
    return {
      method: "POST",
      headers: {
        "Accept": this.DEFAULT_MIME,
        "Content-Type": this.DEFAULT_MIME
      },
      body: JSON.stringify(body)
    }
  }

  private static readonly webQuery = `{
    websites {
      recId: identifier
      url
      regexp
      label
    }
  }`;

  public static async getWebsites(): Promise<WebsiteType[]> {
    const res = await fetch(GRAPHQL_ADDR, this.getOptions({ query: this.webQuery }));
    if (!res.ok) {
      throw new Error(getErrorMessage(res));
    }
    return (await res.json()).data.websites.map((page: any) => ({
      ...page,
      recId: parseInt(page.recId),
      tags: [],
      active: false,
      period: Number.MAX_SAFE_INTEGER
    }));
  }

  private static readonly nodQueryBuilder = (websites: number[]): string => `{
    nodes (webPages: [${websites.join(", ")}]) {
      url
      title
      crawlTime
      links {
        url
      }
      owner {
        recId: identifier
        regexp
        label
      }
    }
  }`;

  public static async getNodes(websites: number[]): Promise<NodeApiType[]> {
    const res = await fetch(GRAPHQL_ADDR, this.getOptions({ query: this.nodQueryBuilder(websites) }));
    if (!res.ok) {
      throw new Error(getErrorMessage(res));
    }

    const nodes = (await res.json()).data.nodes;
    nodes.forEach((node: any) => {
      node.owner.recId = parseInt(node.owner.recId);
    });

    return nodes;
  }
}
