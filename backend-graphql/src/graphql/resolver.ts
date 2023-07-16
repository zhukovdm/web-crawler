import { IModel } from "../domain/interfaces";
import { NodeBaseType, NodeFullType, WebPageType } from "../domain/types";

async function getFullNode(model: IModel, node: NodeBaseType, owner: number): Promise<NodeFullType> {
  return { ...node, owner: owner, links: (await model.getNodeLinks(node.nodId)) };
}

export async function resolveLinks(model: IModel, owner: number, links: number[]): Promise<NodeFullType[]> {
  const result: NodeFullType[] = [];

  for (const nodId of links) {
    const node = await model.getNode(nodId);
    if (!node) {
      throw new Error(`Node ${nodId} cannot be fetched.`);
    }
    result.push(await getFullNode(model, node, owner));
  }

  return result;
}

export async function resolveNodes(model: IModel, webPages: number[]): Promise<NodeFullType[]> {
  const result: NodeFullType[] = [];

  for (const recId of webPages) {
    const nodes = await model.getLatestNodes(recId);
    for (const node of nodes) {
      result.push(await getFullNode(model, node, recId));
    }
  }

  return result;
}

export async function resolveWebPage(model: IModel, recId: number): Promise<WebPageType> {
  const page = await model.getWebPage(recId);
  if (!page) {
    throw new Error(`Web page ${recId} cannot be fetched.`);
  }
  return page;
}

export async function resolveWebPages(model: IModel): Promise<WebPageType[]> {
  return await model.getAllWebPages();
}
