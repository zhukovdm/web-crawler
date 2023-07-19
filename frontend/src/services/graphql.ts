import {
  RecordBaseType,
  RecordIdType
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
      identifier
      label
      url
      regexp
      tags
      active
    }
  }`;

  public static async getWebsites(): Promise<(RecordIdType & RecordBaseType)[]> {
    const res = await fetch(GRAPHQL_ADDR, this.getOptions({ query: this.webQuery }));
    if (res.status !== 200) {
      throw new Error(getErrorMessage(res));
    }
    return (await res.json()).data.websites.map((page: any) => ({
      recId: page.identifier,
      url: page.url,
      regexp: page.regexp,
      period: Number.MAX_SAFE_INTEGER,
      label: page.label,
      active: page.active,
      tags: page.tags
    }));
  }
}
