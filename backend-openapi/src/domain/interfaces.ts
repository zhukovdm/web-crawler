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
   * Get a list of all executuions.
   */
  getAllExecutions(): Promise<ExecutionFullType[]>;

  /**
   * Remove executions with statuses other than finished or failed.
   */
  deleteIncompleteExecutions(): Promise<void>;

  /**
   * Create prioritized execution upon user command.
   */
  createExecution(recId: number): Promise<{ created: boolean, exeId: number | null }>;

  /**
   * Repeat execution after the previous one has been completed.
   */
  repeatExecution(exeId: number): Promise<{ repeated: boolean, exeId: number | null }>;

  /**
   * Set new status for a selected execution.
   */
  updateExecutionStatus(exeId: number, status: ExecutionStatus): Promise<{ updated: boolean }>;
}

export interface ICrawlerModel {

  createNode(node: NodeBaseType): Promise<{ nodId: number | null }>;

  createLink(nodFr: number, nodTo: number): Promise<{ created: boolean }>;
}

export interface IExecutor {

  /**
   * Prioritize new execution.
   */
  prioritize(exeId: number): void;

  /**
   * Report execution upon crawling.
   */
  reportCrawled(exeId: number): void;
}

export interface IWorkerPool {

  /**
   * Acquire available worker.
   */
  acquire(): number | undefined;

  /**
   * Release acquired worker.
   */
  release(wrkId: number): void;

  /**
   * Start crawling of a given execution on an acquired worker.
   */
  crawl(exeId: number, wrkId: number): void;
}
