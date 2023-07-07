type ExecStatus
  = "CREATED"
  | "QUEUED"
  | "RUNNING"
  | "FAILED"
  | "FINISHED"
  ;

export type RecordIdType = {
  id: number;
};

export type RecordBaseType = {
  url: string;
  label: string;
  active: boolean;
  period: number;
  regexp: string;
  tags: string[];
};

export type RecordExecType = {
  lastExecTime?: string;
  lastExecStatus?: ExecStatus
};

export type RecordFullType
  = RecordIdType
  & RecordBaseType
  & RecordExecType
  ;
