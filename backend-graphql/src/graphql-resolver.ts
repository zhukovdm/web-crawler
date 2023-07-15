import { ModelFactory } from "./models";

export async function resolveWebsites() {
  return await ModelFactory.getModel().getAllWebPages();
};

export async function resolveNodes(webPages: number[]) {
  return [];
};
