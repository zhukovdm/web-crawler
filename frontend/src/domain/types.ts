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

export type ExecutionFullType = RecordIdType & {
  exeId: number;
  recId: number;
  label: string;
  status: ExecutionStatus;
  createTime: string;
  finishTime: string | null;
  nodCount: number;
};
