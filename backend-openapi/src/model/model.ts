import {
  Pool,
  createPool
} from "mysql";
import { RecordFullType } from "../domain/types";
import { IModel } from "../domain/interfaces";
import { getAllRecordsQuery } from "./query";

type MySqlPackType = {
  host: string;
  port: number;
  user: string;
  database: string;
  password: string;
};

export class MySqlModel implements IModel {

  private pool: Pool;

  constructor(p: MySqlPackType) {
    this.pool = createPool({ ...p, connectionLimit: 10 });
  }

  public async getAllRecords(): Promise<RecordFullType[]> {
    return new Promise((res, rej) => {
      this.pool.query(getAllRecordsQuery(), [], (err, rows) => {
        if (err) { rej(err); }
        else {
          res(rows[0].map((row: any) => ({ ...row, tags: JSON.parse(row.tags) })));
        }
      });
    });
  }
}
