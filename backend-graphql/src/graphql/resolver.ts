import { IModel } from "../domain/interfaces";
import { WebPageType } from "../domain/types";

export async function resolveWebPages(model: IModel): Promise<WebPageType[]> {
  return await model.getAllWebPages();
};

export async function resolveNodes(webPages: number[]) {
  console.log(webPages);
  return [];
};
