import {
  ExecutionFullType,
  ExecutionStatus,
  NodeBaseType,
  RecordBaseType,
  RecordFullType,
  RecordIdType
} from "./types";

export interface IRecordModel {

  getAllRecords(): Promise<RecordFullType[]>;

  createRecord(record: RecordBaseType): Promise<{ recId: number, exeId: number | null }>;

  updateRecord(record: RecordIdType & RecordBaseType): Promise<{ updated: boolean, exeId: number | null }>;

  deleteRecord(record: RecordIdType): Promise<{ deleted: boolean }>;
}

export interface IExecutionModel {

  /**
   * Get a list of all executuions
   */
  getAllExecutions(): Promise<ExecutionFullType[]>;

  /**
   * Execute prioritized execution.
   */
  createExecution(recId: number, status: ExecutionStatus): Promise<{ created: boolean, exeId: number | null }>;
}

export interface ICrawlerModel {

  createNode(node: NodeBaseType): Promise<{ nodId: number | null }>;

  createLink(nodFr: number, nodTo: number): Promise<{ created: boolean }>;
}

export interface IExecutor {

  /**
   * Prioritize new execution.
   */
  prepend(exeId: number): void;
}
