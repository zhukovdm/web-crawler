import { IModel } from "../domain/interfaces";
import { NodeBase, NodeFull, WebPage } from "../domain/types";

/**
 * @param model wrapper over database
 * @param node base node value object
 * @param owner identifier of a webpage associated with the node
 * @returns node value object enriched by `links` and `owner` identifiers
 */
async function getFullNode(model: IModel, node: NodeBase, owner: number): Promise<NodeFull> {
  return { ...node, owner: owner, links: (await model.getNodeLinks(node.nodId)) };
}

/**
 * @param model wrapper over database
 * @param owner identifier of a webpage where the crawling had started
 * @param links list of node identifiers
 * @returns node value objects for given node identifiers
 */
export async function resolveLinks(model: IModel, owner: number, links: number[]): Promise<NodeFull[]> {
  const result: NodeFull[] = [];

  for (const nodId of links) {
    const node = await model.getNode(nodId);
    if (!node) {
      throw new Error(`Node ${nodId} cannot be fetched.`);
    }
    result.push(await getFullNode(model, node, owner));
  }
  return result;
}

/**
 * @param model wrapper over database
 * @param webPages list of webpage identifiers
 * @returns list of node value objects corresponding to the latest executions for given webpage identifiers
 */
export async function resolveNodes(model: IModel, webPages: number[]): Promise<NodeFull[]> {
  const result: NodeFull[] = [];

  for (const recId of webPages) {
    const nodes = await model.getLatestNodes(recId);
    for (const node of nodes) {
      result.push(await getFullNode(model, node, recId));
    }
  }
  return result;
}

/**
 * @param model wrapper over database
 * @param recId webpage identifier
 * @returns webpage value object
 */
export async function resolveWebPage(model: IModel, recId: number): Promise<WebPage> {
  const page = await model.getWebPage(recId);
  if (!page) {
    throw new Error(`Web page ${recId} cannot be fetched.`);
  }
  return page;
}

/**
 * @param model wrapper over database
 * @returns list of all webpage value objects stored in the database
 */
export function resolveWebPages(model: IModel): Promise<WebPage[]> {
  return model.getAllWebPages();
}
