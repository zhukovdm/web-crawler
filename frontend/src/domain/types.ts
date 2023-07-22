export type ExecutionStatus =
  "WAITING" | "PLANNED" | "CRAWLING" | "FAILURE" | "SUCCESS";

export type RecordIdType = {
  recId: number;
};

export type RecordBaseType = {
  url: string;
  regexp: string;
  period: number;
  label: string;
  active: boolean;
  tags: string[];
};

export type RecordLastExecType = {
  lastExecStatus: ExecutionStatus | null;
  lastExecCreateTime: string | null;
  lastExecFinishTime: string | null;
};

export type RecordType =
  RecordIdType & RecordBaseType & RecordLastExecType;

export type ExecutionType = RecordIdType & {
  exeId: number;
  recId: number;
  label: string;
  status: ExecutionStatus;
  createTime: string;
  finishTime: string | null;
  sitesCrawl: number;
};

export type WebsiteType = RecordIdType & RecordBaseType;

export type WebsiteReducedType = RecordIdType & {
  regexp: string;
  label: string;
};

export type NodeBaseType = {
  url: string;
  title: string | null;
  crawlTime: string | null;
};

export type NodeApiType = NodeBaseType & {
  links: { url: string }[];
  owner: WebsiteReducedType;
};

export type NodeType = NodeBaseType & {
  crawlable: boolean;
  links: Set<string>;
  owners: Map<number, WebsiteReducedType>;
};
