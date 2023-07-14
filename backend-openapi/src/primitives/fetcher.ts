import { IUrlFetcher } from "../domain/common-interfaces";


export class MockUrlFetcher implements IUrlFetcher {

  private readonly map: Map<string, string[]>;

  public constructor() {
    this.map = new Map<string, string[]>([
      [
        "http://www.example.com",
        [
          "http://www.example.com/1",
          "http://www.example.com/2",
          "http://www.example.com/3"
        ]
      ],
      [
        "http://www.example.com/1",
        [
          "http://www.example.com/1",
          "http://www.example.com/2",
          "http://www.example.com/3"
        ]
      ],
      [
        "http://www.example.com/2",
        [
          "http://www.example.com/1",
          "http://www.example.com/2",
          "http://www.example.com/3"
        ]
      ],
      [
        "http://www.example.com/3",
        [
          "http://www.example.com/1",
          "http://www.example.com/2",
          "http://www.example.com/3"
        ]
      ]
    ]);
  }

  public fetch(url: string): Promise<string[]> {
    return new Promise((res, _) => { res(this.map.get(url) ?? []); });
  }
}

class StandardUrlFetcher implements IUrlFetcher {

  public fetch(url: string): Promise<string[]> {
    return new Promise((res, rej) => { res([]); });
  }
}
