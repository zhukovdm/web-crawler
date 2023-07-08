import {
  Pool,
  createPool
} from "mysql";
import {
  RecordBaseType,
  RecordFullType,
  RecordIdType
} from "./domain/types";
import { IModel } from "./domain/interfaces";

type MySqlPackType = {
  host: string;
  port: number;
  user: string;
  database: string;
  password: string;
};

const GET_ALL_RECORDS_QUERY: string = `
CALL getAllRecords ();
`;

const CREATE_RECORD_QUERY: string = `
CALL createRecord (?, ?, ?, ?, ?, ?, @id);
SELECT @id AS id;
`;

export class MySqlModel implements IModel {

  private pool: Pool;

  private constructor(p: MySqlPackType) {
    this.pool = createPool({
      ...p,
      connectionLimit: 10,
      multipleStatements: true
    });
  }

  public static getInstance(env: NodeJS.ProcessEnv) {
    const {
      MYSQL_HOST,
      MYSQL_PORT,
      MYSQL_USER,
      MYSQL_DATABASE,
      MYSQL_PASSWORD
    } = env;
    return new MySqlModel({
      host: MYSQL_HOST,
      port: parseInt(MYSQL_PORT),
      user: MYSQL_USER,
      database: MYSQL_DATABASE,
      password: MYSQL_PASSWORD,
    });
  }

  public async getAllRecords(): Promise<RecordFullType[]> {
    return new Promise((res, rej) => {

      this.pool.query(GET_ALL_RECORDS_QUERY, [], (err, rows) => {
        if (err) { rej(err); }
        else {
          console.log(rows[0].map((row: any) => typeof row));
          res(rows[0].map((row: any) => ({ ...row, tags: JSON.parse(row.tags) })));
        }
      });
    });
  }

  public async createRecord(r: RecordBaseType): Promise<RecordIdType> {
    return new Promise((res, rej) => {
      console.log(r);
      this.pool.query(CREATE_RECORD_QUERY, [
        r.url, r.regexp, r.period, r.label, r.active, JSON.stringify(r.tags)
      ], (err, rows) => {
        if (err) { rej(err); } else { res({ id: rows[1][0].id }); }
      });
    });
  }
}
