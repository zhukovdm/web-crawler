type ExecStatus
  = "CREATED"
  | "QUEUED"
  | "CRAWLING"
  | "FINISHED"
  | "FAILED"
  ;

export type RecordIdType = {
  id: number;
};

export type RecordBaseType = {
  url: string;
  regexp: string;
  period: number;
  label: string;
  active: boolean;
  tags: string[];
};

export type RecordExecType = {
  lastExecStatus: ExecStatus | null;
  lastExecEndTime: Date | null;
  lastExecStartTime: Date | null;
};

export type RecordFullType
  = RecordIdType
  & RecordBaseType
  & RecordExecType
  ;
