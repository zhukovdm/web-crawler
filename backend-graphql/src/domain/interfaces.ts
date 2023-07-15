import { WebPageType } from "./types";

export interface IModel {

  /**
   * Get a list of all web pages available in the database.
   */
  getAllWebPages(): Promise<WebPageType[]>;

  /**
   * Release allocated resources gracefully.
   */
  dispose(): void;
}
