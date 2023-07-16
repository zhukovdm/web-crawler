import { NodeBaseType, WebPageType } from "./types";

export interface IModel {

  getAllWebPages(): Promise<WebPageType[]>;

  getWebPage(recId: number): Promise<WebPageType | undefined>;

  getLatestNodes(recId: number): Promise<NodeBaseType[]>;

  getNode(nodId: number): Promise<NodeBaseType | undefined>;

  getNodeLinks(nodFr: number): Promise<number[]>;

  /**
   * Release allocated resources gracefully.
   */
  dispose(): void;
}
