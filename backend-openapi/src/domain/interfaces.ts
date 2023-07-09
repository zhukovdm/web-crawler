import {
  RecordBaseType,
  RecordExecType,
  RecordFullType,
  RecordIdType
} from "./types";

export interface IRecordModel {

  getAllRecords(): Promise<RecordExecType[]>;

  createRecord(record: RecordBaseType): Promise<RecordIdType & { exeId: number }>;

  updateRecord(record: RecordFullType): Promise<number>;

  deleteRecord(record: RecordIdType): Promise<number>;
}

export interface IExecutionModel {

  getAllExecutions(): Promise<void>;

  createExecution(exeId: number): Promise<void>;
}
