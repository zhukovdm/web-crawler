import {
  Pool,
  createPool
} from "mysql";
import { RecordExecType } from "../domain/types";
import { IModel } from "../domain/interfaces";

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

  public async getAllRecords(): Promise<RecordExecType[]> {
    return new Promise((res, rej) => {
      this.pool.query(`SELECT * FROM record;`, [], (err, rows) => {
        if (err) { rej(err); } else { res(rows); }
      });
    });
  }
}
