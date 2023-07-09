export type ExecStatus =
  "CREATED" | "PLANNED" | "WAITING" | "CRAWLING" | "FINISHED";

export type RecordIdType = {
  recId: number;
};

export type RecordBaseType = {
  url: string;
  regexp: string;
  period: number;
  label: string;
  active: number;
  tags: string[];
};

export type RecordExecType = {
  lastExecStatus: ExecStatus | null;
  lastExecEndTime: Date | null;
  lastExecStartTime: Date | null;
};

export type RecordFullType =
  RecordIdType & RecordBaseType & RecordExecType;
