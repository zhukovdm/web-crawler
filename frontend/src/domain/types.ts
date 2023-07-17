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

export type RecordFullType =
  RecordIdType & RecordBaseType & RecordLastExecType;

export type RecordFilters = {

  /**
   * Exact matching.
   */
  url?: string;

  /**
   * Label as a substring.
   */
  label?: string;

  /**
   * Has a tag from the list.
   */
  tags: string[];
};

export type RecordSorters = {

  /**
   * Sort by url in lexicographic order.
   */
  url: boolean;

  /**
   * Sort by date from the earliest 
   */
  lastCrawlTime: boolean;
};
