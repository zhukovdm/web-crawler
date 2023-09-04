import { NodeBase, WebPage } from "./types";

export interface IModel {

  /**
   * Get all webpages available in the database.
   */
  getAllWebPages(): Promise<WebPage[]>;

  /**
   * Get webpage by identifier.
   */
  getWebPage(recId: number): Promise<WebPage | undefined>;

  /**
   * Get the list of crawled nodes created during the latest execution
   * (possibly unfinished) corresponding to a given webpage.
   */
  getLatestNodes(recId: number): Promise<NodeBase[]>;

  /**
   * Get node by identifier.
   */
  getNode(nodId: number): Promise<NodeBase | undefined>;

  /**
   * Get out-edges for a given node identifier.
   */
  getNodeLinks(nodFr: number): Promise<number[]>;

  /**
   * Release allocated resources gracefully.
   */
  dispose(): void;
}
