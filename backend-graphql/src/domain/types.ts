export type WebPage = {

  /** Page Id */
  identifier: number;

  /** User-defined label */
  label: string;

  /** Page URL with http(s) scheme */
  url: string;

  /** Boundary regular expression */
  regexp: string;

  /** List of user-defined tags */
  tags: string[];

  /** Periodic crawling is enabled */
  active: boolean;
};

export type NodeBase = {

  /** Node identifier */
  nodId: number;

  /** Page URL with http(s) scheme */
  url: string;

  /** Page title */
  title: string | null;

  /** Time of last node access */
  crawlTime: string | null;
};

export type NodeFull = NodeBase & {

  /** List of nodes reachable from this node */
  links: number[];

  /** Identifier of a webpage where the crawling had been started */
  owner: number;
}
