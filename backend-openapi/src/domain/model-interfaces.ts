import {
  ExecutionFullType,
  ExecutionStatus,
  RecordBaseType,
  RecordFullType
} from "./types";
import { IDisposable } from "./common-interfaces";

export interface IRecordModel extends IDisposable {

  /**
   * Get records currently available in the model.
   */
  getAllRecords(): Promise<RecordFullType[]>;

  /**
   * Create a new record in the model. If the record is active, also create
   * a corresponding execution.
   */
  createRecord(record: RecordBaseType): Promise<{ recId: number, exeId: number | null }>;

  /**
   * Accommodate user-defined updates into a record. Possible create a new
   * execution if the record is active after update.
   */
  updateRecord(recId: number, record: RecordBaseType): Promise<{ updated: boolean, exeId: number | null }>;

  /**
   * Delete record with the given identifier.
   */
  deleteRecord(recId: number): Promise<{ deleted: boolean }>;
}

export interface IExecutionModel extends IDisposable {

  /**
   * Get a list of all executuions.
   */
  getAllExecutions(): Promise<ExecutionFullType[]>;

  /**
   * Resume waiting execution by planning it.
   */
  resumeExecution(): Promise<{ resumed: boolean, exeId: number | null }>;

  /**
   * Create prioritized execution upon user command.
   */
  createExecution(recId: number): Promise<{ created: boolean, exeId: number | null }>;

  /**
   * Set new status for a selected execution.
   */
  updateExecutionStatus(exeId: number, status: ExecutionStatus): Promise<{ updated: boolean }>;

  /**
   * Repeat execution after the previous one has been completed.
   */
  repeatExecution(exeId: number): Promise<{ repeated: boolean, exeId: number | null }>;
}

export interface ICrawlerModel extends IDisposable {

  /**
   * Get Url and regular expression pattern of the record corresponding
   * to the provided execution identifier.
   */
  getExecutionBoundary(exeId: number): Promise<{ url: string, regexp: string } | undefined>;

  /**
   * Update counter for a particular execution.
   */
  updateExecutionSitesCrawl(exeId: number, sitesCrawl: number): Promise<void>;

  /**
   * Create a node with provided information.
   */
  createNode(exeId: number, url: string): Promise<{ nodId: number }>;

  /**
   * Update a node with provided information.
   */
  updateNode(nodId: number, title: string | null, crawlTime: string | null): Promise<void>;

  /**
   * Delete nodes of all preceeding executions upon execution success.
   */
  deleteNodes(exeId: number): Promise<void>;

  /**
   * Create directed edge between two nodes.
   */
  createLink(nodFr: number, nodTo: number): Promise<void>;

  /**
   * Finish execution with a given status and time.
   */
  finishExecution(exeId: number, status: ExecutionStatus, finishTime: string): Promise<void>;
}
