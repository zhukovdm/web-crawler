import {
  RecordBaseType,
  RecordExecType,
  RecordIdType
} from "./types";

export interface IRecordModel {

  getAllRecords(): Promise<RecordExecType[]>;

  createRecord(record: RecordBaseType): Promise<RecordIdType>;

  updateRecord(id: number, record: RecordBaseType): Promise<number>;

  deleteRecord(id: number): Promise<number>;
}
