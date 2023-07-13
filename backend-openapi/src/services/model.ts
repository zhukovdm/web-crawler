import {
  Connection,
  ConnectionConfig,
  Pool,
  createConnection,
  createPool
} from "mysql";
import { MYSQL_CONFIG, MySqlConfigType } from "./config";
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

/**
 * Construct standard connection config.
 */
function getConnectionConfig(config: MySqlConfigType): ConnectionConfig {
  return { ...config, dateStrings: true, multipleStatements: true };
}

/**
 * Current time in `YYYY-MM-DD HH:MM:SS` format.
 */
function getCurrentTime(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

/**
 * Get output parameters from mysql result object (get indices right).
 */
function getUnsafeOutputParams(results: any) {
  return { ...results[1][0] };
};

export class MySqlModel implements IRecordModel, IExecutionModel {

  /**
   * Connection pool.
   */
  private readonly pool: Pool;

  /**
   * Number of shared connections.
   */
  private static readonly CONNECTION_LIMIT: number = 10;

  private constructor(config: MySqlConfigType) {
    this.pool = createPool({
      ...getConnectionConfig(config),
      connectionLimit: MySqlModel.CONNECTION_LIMIT,
    });
  }

  public static getInstance(): IRecordModel & IExecutionModel {
    return new MySqlModel(MYSQL_CONFIG);
  }

  private static unpackRecordBase(r: RecordBaseType): [string, string, number, string, number, string] {
    return [r.url, r.regexp, r.period, r.label, r.active ? 1 : 0, JSON.stringify(r.tags)];
  }

  public async getAllRecords(): Promise<RecordFullType[]> {
    const queryString: string = `
      CALL getAllRecords ();`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [], (err, results) => {
        if (err) { rej(err); }
        else {
          res(results[0].map((row: any) => ({ ...row, tags: JSON.parse(row.tags), active: row.active === 1 })));
        }
      });
    });
  }

  public async createRecord(r: RecordBaseType): Promise<{ recId: number, exeId: number | null }> {
    const queryString: string = `
      CALL createRecord (?, ?, ?, ?, ?, ?, ?, @recId, @exeId);
      SELECT @recId AS recId, @exeId AS exeId;`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [
        ...MySqlModel.unpackRecordBase(r), getCurrentTime()
      ], (err, results) => {
        (err)
          ? rej(err)
          : res(getUnsafeOutputParams(results));
      });
    });
  }

  public async updateRecord(r: RecordIdType & RecordBaseType): Promise<{ updated: boolean, exeId: number | null }> {
    const queryString: string = `
      CALL updateRecord (?, ?, ?, ?, ?, ?, ?, ?, @count, @exeId);
      SELECT @count AS count, @exeId AS exeId;`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [r.recId, ...MySqlModel.unpackRecordBase(r)], (err, results) => {
        if (err) { rej(err); }
        else {
          const params = getUnsafeOutputParams(results);
          res({ ...params, updated: params.count > 0 });
        }
      });
    });
  }

  public async deleteRecord({ recId }: RecordIdType): Promise<{ deleted: boolean }> {
    const queryString: string = `
      CALL deleteRecord (?, @count);
      SELECT @count AS count;`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [recId], (err, results) => {
        (err)
          ? rej(err)
          : res({ deleted: getUnsafeOutputParams(results).count > 0 });
      });
    });
  }

  public async getAllExecutions(): Promise<ExecutionFullType[]> {
    const queryString: string = `
      CALL getAllExecutions ();`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [], (err, results) => {
        (err)
          ? rej(err)
          : res(results[0]);
      });
    });
  }

  public async deleteIncompleteExecutions(): Promise<void> {
    const queryString: string = `
      CALL deleteIncompleteExecutions ();`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [], (err) => {
        (err) ? rej(err) : res();
      });
    });
  }

  public async resumeExecution(): Promise<{ resumed: boolean; exeId: number | null; }> {
    const queryString: string = `
      CALL resumeExecution (?, @exeId);
      SELECT @exeId AS exeId;`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [getCurrentTime()], (err, results) => {
        if (err) { rej(err); }
        else {
          const { exe: exeId } = getUnsafeOutputParams(results);
          res({ resumed: exeId !== null, exeId: exeId });
        }
      })
    });
  }

  public async createExecution(recId: number): Promise<{ created: boolean, exeId: number | null }> {
    const queryString: string = `
      CALL createExecution (?, ?, @exeId);
      SELECT @exeId AS exeId;`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [recId, getCurrentTime()], (err, results) => {
        if (err) { rej(err); }
        else {
          const { exeId } = getUnsafeOutputParams(results);
          res({ created: exeId !== null, exeId: exeId });
        }
      });
    });
  }

  public async updateExecutionStatus(exeId: number, status: ExecutionStatus): Promise<{ updated: boolean; }> {
    const queryString: string = `
      CALL updateExecutionStatus (?, ?, @count);
      SELECT @count AS count;`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [exeId, status], (err, results) => {
        (err)
          ? rej(err)
          : res({ updated: getUnsafeOutputParams(results).count > 0 });
      });
    });
  }

  public async repeatExecution(exeId: number): Promise<{ repeated: boolean, exeId: number | null }> {
    const queryString: string = `
      CALL repeatExecution (?, ?, @exeId);
      SELECT @exeId AS exeId;`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [exeId, getCurrentTime()], (err, results) => {
        if (err) { rej(err); }
        else {
          const { exeId } = getUnsafeOutputParams(results);
          res({ repeated: exeId !== null, exeId: exeId });
        }
      })
    });
  }

  public end(): void { this.pool.end(); }
}

export class CrawlerModel implements ICrawlerModel {

  private readonly conn: Connection;

  private constructor(config: MySqlConfigType) {
    this.conn = createConnection(getConnectionConfig(config));
  }

  createNode(n: NodeBaseType): Promise<{ nodId: number | null; }> {
    const queryString: string = `
      CALL createNode (?, ?, ?, ?, @nodId);
      SELECT @nodId AS nodId;`;

    return new Promise((res, rej) => {
      this.conn.query(queryString, [n.exeId, n.url, n.title, n.crawlTime], (err, results) => {
        (err)
          ? rej(err)
          : res(getUnsafeOutputParams(results));
      });
    });
  }

  createLink(nodFr: number, nodTo: number): Promise<{ created: boolean; }> {
    const queryString: string = `
      CALL createLink (?, ?, @count);
      SELECT @count AS count;`;

    return new Promise((res, rej) => {
      this.conn.query(queryString, [nodFr, nodTo], (err, results) => {
        (err)
          ? rej(err)
          : res({ created: getUnsafeOutputParams(results).count > 0 });
      });
    });
  }

  public end(): void { this.conn.end(); }
}
