import {
  RecordBaseType,
  RecordExecType
} from "./types";

export interface IModel {

  getAllRecords(): Promise<RecordExecType[]>;

  // createRecord(base: RecordBaseType): Promise<number>;

  // updateRecord(id: number): Promise<void>;

  // deleteRecord(id: number): Promise<void>;
};
