import {
  Pool,
  createPool
} from "mysql";
import {
  MYSQL_CONFIG,
  MySqlConfigType
} from "./config";
import {
  ExecutionFullType,
  ExecutionStatus,
  NodeBaseType,
  RecordBaseType,
  RecordFullType,
  RecordIdType
} from "../domain/types";
import {
  ICrawlerModel,
  IExecutionModel,
  IRecordModel
} from "../domain/interfaces";

const GET_ALL_RECORDS_QUERY: string = `
CALL getAllRecords ();`;

const CREATE_RECORD_QUERY: string = `
CALL createRecord (?, ?, ?, ?, ?, ?, ?, @recId, @exeId);
SELECT @recId AS recId, @exeId AS exeId;`;

const UPDATE_RECORD_QUERY: string = `
CALL updateRecord (?, ?, ?, ?, ?, ?, ?, ?, @count, @exeId);
SELECT @count AS count, @exeId AS exeId;`;

const DELETE_RECORD_QUERY: string = `
CALL deleteRecord (?, @count);
SELECT @count AS count;`;

const GET_ALL_EXECUTIONS_QUERY: string = `
CALL getAllExecutions ();`;

const CREATE_EXECUTION_QUERY: string = `
CALL createExecution (?, ?, @exeId);
SELECT @exeId AS exeId;`;

const UPDATE_EXECUTION_STATUS: string = `
CALL updateExecutionStatus (?, ?, @count);
SELECT @count AS count;`;

const CREATE_NODE_QUERY: string = `
CALL createNode (?, ?, ?, ?, @nodId);
SELECT @nodId AS nodId;`;

const CREATE_LINK_QUERY: string = `
CALL createLink (?, ?, @count);
SELECT @count AS count;`;

export class MySqlModel implements IRecordModel, IExecutionModel, ICrawlerModel {

  /**
   * Connection pool.
   */
  private pool: Pool;

  /**
   * Number of shared connections.
   */
  private static readonly CONNECTION_LIMIT: number = 10;

  private constructor(p: MySqlConfigType) {
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
   * Get indices right!
   */
  private static getUnsafeOutputParams(results: any): any {
    return { ...results[1][0] };
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
        if (err) { rej(err); }
        else {
          res(results[0].map((row: any) => ({ ...row, tags: JSON.parse(row.tags), active: row.active === 1 })));
        }
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
          : res(MySqlModel.getUnsafeOutputParams(results));
      });
    });
  }

  public async updateRecord(r: RecordIdType & RecordBaseType): Promise<{ updated: boolean, exeId: number | null }> {
    return new Promise((res, rej) => {
      this.pool.query(UPDATE_RECORD_QUERY, [r.recId, ...MySqlModel.unpackRecordBase(r)], (err, results) => {
        if (err) { rej(err); }
        else {
          const params = MySqlModel.getUnsafeOutputParams(results);
          res({ ...params, updated: params.count > 0 });
        }
      });
    });
  }

  public async deleteRecord({ recId }: RecordIdType): Promise<{ deleted: boolean }> {
    return new Promise((res, rej) => {
      this.pool.query(DELETE_RECORD_QUERY, [recId], (err, results) => {
        (err)
          ? rej(err)
          : res({ deleted: MySqlModel.getUnsafeOutputParams(results).count > 0 });
      });
    });
  }

  public async getAllExecutions(): Promise<ExecutionFullType[]> {
    return new Promise((res, rej) => {
      this.pool.query(GET_ALL_EXECUTIONS_QUERY, [], (err, results) => {
        (err)
          ? rej(err)
          : res(results[0]);
      });
    });
  }

  public async createExecution(recId: number): Promise<{ created: boolean, exeId: number | null }> {
    return new Promise((res, rej) => {
      this.pool.query(CREATE_EXECUTION_QUERY, [recId, MySqlModel.getCurrentTime()], (err, results) => {
        if (err) { rej(err); }
        else {
          const { exeId } = MySqlModel.getUnsafeOutputParams(results);
          res({ created: exeId !== null, exeId: exeId });
        }
      });
    });
  }

  public async updateExecutionStatus(exeId: number, status: ExecutionStatus): Promise<{ updated: boolean; }> {
    return new Promise((res, rej) => {
      this.pool.query(UPDATE_EXECUTION_STATUS, [exeId, status], (err, results) => {
        (err)
          ? rej(err)
          : res({ updated: MySqlModel.getUnsafeOutputParams(results).count > 0 });
      });
    });
  }

  public async createNode(n: NodeBaseType): Promise<{ nodId: number | null }> {
    return new Promise((res, rej) => {
      this.pool.query(CREATE_NODE_QUERY, [n.exeId, n.url, n.title, n.crawlTime], (err, results) => {
        (err)
          ? rej(err)
          : res(MySqlModel.getUnsafeOutputParams(results));
      });
    });
  }

  public async createLink(nodFr: number, nodTo: number): Promise<{ created: boolean }> {
    return new Promise((res, rej) => {
      this.pool.query(CREATE_LINK_QUERY, [nodFr, nodTo], (err, results) => {
        (err)
          ? rej(err)
          : res({ created: MySqlModel.getUnsafeOutputParams(results).count > 0 });
      });
    });
  }
}
