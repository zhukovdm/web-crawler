import {
  RecordBaseType,
  RecordFullType,
  RecordIdType
} from "./types";

export interface IRecordModel {

  getAllRecords(): Promise<RecordFullType[]>;

  createRecord(record: RecordBaseType): Promise<RecordIdType>;

  updateRecord(record: RecordFullType): Promise<number>;

  deleteRecord(record: RecordIdType): Promise<number>;
}

export interface IExecutionModel {

  getAllExecutions(): Promise<void>;

  createExecution(recId: number, exeId: number): Promise<void>;
}

export interface IPlanner {

  /**
   * Create one-time prioritized execution.
   */
  inject(recId: number): Promise<void>;

  /**
   * Dequeue deleted record.
   */
  dequeue(recId: number): Promise<void>;

  /**
   * Consider a record.
   */
  consider(recId: number, period: number, active: boolean): Promise<void>;
}
