import {
  Pool,
  createPool
} from "mysql";
import {
  RecordBaseType,
  RecordFullType,
  RecordIdType
} from "../domain/types";
import { IRecordModel } from "../domain/interfaces";

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
CALL createRecord (?, ?, ?, ?, ?, ?);
SELECT LAST_INSERT_ID() AS id;
`;

const UPDATE_RECORD_QUERY: string = `
CALL updateRecord (?, ?, ?, ?, ?, ?, ?);
SELECT ROW_COUNT() AS count;
`;

const DELETE_RECORD_QUERY: string = `
CALL deleteRecord (?);
SELECT ROW_COUNT() AS count;
`;

export class MySqlModel implements IRecordModel {

  /**
   * Connection pool.
   */
  private pool: Pool;

  /**
   * Number of shared connections.
   */
  private static readonly CONNECTION_LIMIT: number = 10;

  private constructor(p: MySqlPackType) {
    this.pool = createPool({
      ...p,
      multipleStatements: true,
      connectionLimit: MySqlModel.CONNECTION_LIMIT,
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

  private static unpackRecordBase(r: RecordBaseType): [string, string, number, string, number, string] {
    return [r.url, r.regexp, r.period, r.label, r.active, JSON.stringify(r.tags)];
  }

  public async getAllRecords(): Promise<RecordFullType[]> {
    return new Promise((res, rej) => {
      this.pool.query(GET_ALL_RECORDS_QUERY, [], (err, results) => {
        if (err) { rej(err); }
        else {
          res(results[0].map((row: any) => ({ ...row, tags: JSON.parse(row.tags) })));
        }
      });
    });
  }

  public async createRecord(r: RecordBaseType): Promise<RecordIdType> {
    return new Promise((res, rej) => {
      this.pool.query(CREATE_RECORD_QUERY, MySqlModel.unpackRecordBase(r), (err, results) => {
        if (err) { rej(err); }
        else {
          res({ id: results[1][0].id });
        }
      });
    });
  }

  public async updateRecord(id: number, r: RecordBaseType): Promise<number> {
    return new Promise((res, rej) => {
      this.pool.query(UPDATE_RECORD_QUERY, [id, ...MySqlModel.unpackRecordBase(r)], (err, results) => {
        if (err) { rej(err); }
        else {
          res(results[1][0].count);
        }
      });
    });
  }

  public async deleteRecord(id: number): Promise<number> {
    return new Promise((res, rej) => {
      this.pool.query(DELETE_RECORD_QUERY, [id], (err, results) => {
        if (err) { rej(err); }
        else {
          res(results[1][0].count);
        }
      });
    });
  }
}
