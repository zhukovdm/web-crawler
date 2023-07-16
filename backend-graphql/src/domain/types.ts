export type WebPageType = {
  identifier: number;
  label: string;
  url: string;
  regexp: string;
  tags: string[];
  active: boolean;
};

export type NodeBaseType = {
  nodId: number;
  url: string;
  title: string | null;
  crawlTime: string;
};

export type NodeFullType = NodeBaseType & {
  links: number[];
  owner: number;
}
