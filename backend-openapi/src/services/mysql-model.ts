import {
  Pool,
  createPool
} from "mysql";
import { MYSQL_CONFIG } from "./config";
import {
  ExecutionFullType,
  ExecutionStatus,
  NodeBaseType,
  NodeIdType,
  RecordBaseType,
  RecordFullType,
  RecordIdType
} from "../domain/types";
import {
  ICrawlerModel,
  IExecutionModel,
  IRecordModel
} from "../domain/interfaces";

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
CALL createRecord (?, ?, ?, ?, ?, ?, ?, @recId, @exeId);
SELECT @recId AS recId, @exeId AS exeId;
`;

const UPDATE_RECORD_QUERY: string = `
CALL updateRecord (?, ?, ?, ?, ?, ?, ?, ?, @count, @exeId);
SELECT @count AS count, @exeId AS exeId;
`;

const DELETE_RECORD_QUERY: string = `
CALL deleteRecord (?, @count);
SELECT @count AS count;
`;

const GET_ALL_EXECUTIONS_QUERY: string = `
CALL getAllExecutions ();
`;

const CREATE_EXECUTION_QUERY: string = `
CALL createExecution (?, ?, @exeId);
SELECT @exeId AS exeId;
`;

const CREATE_NODE_QUERY: string = `
CALL createNode (?, ?, ?, ?, @nodId);
SELECT @nodId AS nodId;
`;

const CREATE_LINK_QUERY: string = `
CALL createLink (?, ?);
`;

export class MySqlModel implements IRecordModel, IExecutionModel, ICrawlerModel {

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
      dateStrings: true,
      multipleStatements: true,
      connectionLimit: MySqlModel.CONNECTION_LIMIT,
    });
  }

  public static getInstance(): IRecordModel & IExecutionModel {
    return new MySqlModel(MYSQL_CONFIG);
  }

  private static unpackRecordBase(r: RecordBaseType): [string, string, number, string, number, string] {
    return [r.url, r.regexp, r.period, r.label, r.active ? 1 : 0, JSON.stringify(r.tags)];
  }

  /**
   * Current time in `YYYY-MM-DD HH:MM:SS` format.
   */
  private static getCurrentTime(): string {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  }

  public async getAllRecords(): Promise<RecordFullType[]> {
    return new Promise((res, rej) => {
      this.pool.query(GET_ALL_RECORDS_QUERY, [], (err, results) => {
        (err)
          ? rej(err)
          : res(results[0].map((row: any) => ({ ...row, tags: JSON.parse(row.tags), active: row.active === 1 })));
      });
    });
  }

  public async createRecord(r: RecordBaseType): Promise<{ recId: number, exeId: number | null }> {
    return new Promise((res, rej) => {
      this.pool.query(CREATE_RECORD_QUERY, [
        ...MySqlModel.unpackRecordBase(r), MySqlModel.getCurrentTime()
      ], (err, results) => {
        (err)
          ? rej(err)
          : res({ ...results[1][0] });
      });
    });
  }

  public async updateRecord(r: RecordFullType): Promise<{ updated: boolean, exeId: number | null }> {
    return new Promise((res, rej) => {
      this.pool.query(UPDATE_RECORD_QUERY, [r.recId, ...MySqlModel.unpackRecordBase(r)], (err, results) => {
        (err)
          ? rej(err)
          : res({ ...results[1][0], updated: results[1][0].count > 0 });
      });
    });
  }

  public async deleteRecord(r: RecordIdType): Promise<{ deleted: boolean }> {
    return new Promise((res, rej) => {
      this.pool.query(DELETE_RECORD_QUERY, [r.recId], (err, results) => {
        (err)
          ? rej(err)
          : res({ deleted: results[1][0].count > 0 });
      });
    });
  }

  public async getAllExecutions(): Promise<ExecutionFullType> {
    return new Promise((res, rej) => {
      this.pool.query(GET_ALL_EXECUTIONS_QUERY, [], (err, results) => {
        (err)
          ? rej(err)
          : res(results[0]);
      });
    });
  }

  public async createExecution(recId: number, status: ExecutionStatus): Promise<{ exeId: number }> {
    return new Promise((res, rej) => {
      this.pool.query(CREATE_EXECUTION_QUERY, [recId, status, MySqlModel.getCurrentTime()], (err, results) => {
        (err)
          ? rej(err)
          : res({ ...results[0][1] });
      });
    });
  }

  public async createNode(n: NodeBaseType): Promise<NodeIdType> {
    return new Promise((res, rej) => {
      this.pool.query(CREATE_NODE_QUERY, [n.exeId, n.url, n.title, n.crawlTime], (err, results) => {
        (err)
          ? rej(err)
          : res({ ...results[0][1] });
      });
    });
  }

  public async createLink(nodFr: number, nodTo: number): Promise<void> {
    return new Promise((res, rej) => {
      this.pool.query(CREATE_LINK_QUERY, [nodFr, nodTo], (err, _) => {
        (err)
          ? rej(err)
          : res();
      });
    });
  }
}
