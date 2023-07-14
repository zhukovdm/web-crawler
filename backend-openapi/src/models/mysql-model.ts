require("dotenv").config();

import {
  Connection,
  ConnectionConfig,
  Pool,
  createConnection,
  createPool
} from "mysql";
import {
  ExecutionFullType,
  ExecutionStatus,
  NodeBaseType,
  RecordBaseType,
  RecordFullType
} from "../domain/types";
import {
  ICrawlerModel,
  IExecutionModel,
  IRecordModel
} from "../domain/model-interfaces";

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_DATABASE,
  MYSQL_PASSWORD
} = process.env;

// MySQL config

type MySqlConfigType = {
  host: string;
  port: number;
  user: string;
  database: string;
  password: string;
}

const MYSQL_CONFIG: MySqlConfigType = {
  host: MYSQL_HOST!,
  port: parseInt(MYSQL_PORT!),
  user: MYSQL_USER!,
  database: MYSQL_DATABASE!,
  password: MYSQL_PASSWORD!
};

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

export class MySqlModelInitializer {

  public static async init(): Promise<void> {

    /* Ensure consistent state so that all executions are complete ('FINISHED'
     * or 'FAILURE' statuses are acceptable). */

    const conn = createConnection(getConnectionConfig(MYSQL_CONFIG));

    const queryString: string = `
      CALL deleteIncompleteExecutions ();`;

    return new Promise((res, rej) => {
      conn.query(queryString, [], (err) => {
        (err) ? rej(err) : res();
        conn.end();
      });
    });
  }
}

class MySqlPoolModel {

  /**
   * Connection pool.
   */
  protected readonly pool: Pool;

  protected constructor(config: MySqlConfigType, connectionLimit: number) {
    this.pool = createPool({
      ...getConnectionConfig(config),
      connectionLimit: connectionLimit,
    });
  }

  public dispose(): void { this.pool.end(); }
}

export class MySqlRecordModel extends MySqlPoolModel implements IRecordModel {

  /**
   * Number of shared connections.
   */
  private static readonly CONNECTION_LIMIT: number = 10;

  private constructor(config: MySqlConfigType) {
    super(config, MySqlRecordModel.CONNECTION_LIMIT);
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

  public async createRecord(record: RecordBaseType): Promise<{ recId: number, exeId: number | null }> {
    const queryString: string = `
      CALL createRecord (?, ?, ?, ?, ?, ?, ?, @recId, @exeId);
      SELECT @recId AS recId, @exeId AS exeId;`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [
        ...MySqlRecordModel.unpackRecordBase(record), getCurrentTime()
      ], (err, results) => {
        (err)
          ? rej(err)
          : res(getUnsafeOutputParams(results));
      });
    });
  }

  public async updateRecord(recId: number, record: RecordBaseType): Promise<{ updated: boolean, exeId: number | null }> {
    const queryString: string = `
      CALL updateRecord (?, ?, ?, ?, ?, ?, ?, ?, @count, @exeId);
      SELECT @count AS count, @exeId AS exeId;`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [recId, ...MySqlRecordModel.unpackRecordBase(record)], (err, results) => {
        if (err) { rej(err); }
        else {
          const params = getUnsafeOutputParams(results);
          res({ ...params, updated: params.count > 0 });
        }
      });
    });
  }

  public async deleteRecord(recId: number): Promise<{ deleted: boolean }> {
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

  /**
   * Factory method.
   */
  public static getInstance(): IRecordModel {
    return new MySqlRecordModel(MYSQL_CONFIG);
  }
}

export class MySqlExecutionModel extends MySqlPoolModel implements IExecutionModel {

  /**
   * Number of shared connections.
   */
  private static readonly CONNECTION_LIMIT: number = 10;

  private constructor(config: MySqlConfigType) {
    super(config, MySqlExecutionModel.CONNECTION_LIMIT);
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

  /**
   * Factory method.
   */
  public static getInstance(): IExecutionModel {
    return new MySqlExecutionModel(MYSQL_CONFIG);
  }
}

export class MySqlCrawlerModel implements ICrawlerModel {

  private readonly conn: Connection;

  private constructor(config: MySqlConfigType) {
    this.conn = createConnection(getConnectionConfig(config));
  }

  public getExecutionBoundary(exeId: number): Promise<{ url: string; regexp: string; } | undefined> {
    const queryString: string = `
      CALL getExecutionBoundary (?);`;

    return new Promise((res, rej) => {
      this.conn.query(queryString, [exeId], (err, results) => {
        (err) ? rej(err) : res(results[0][0]);
      });
    });
  }

  public createNode(node: NodeBaseType): Promise<{ nodId: number | null; }> {
    const queryString: string = `
      CALL createNode (?, ?, ?, ?, @nodId);
      SELECT @nodId AS nodId;`;

    return new Promise((res, rej) => {
      this.conn.query(queryString, [node.exeId, node.url, node.title, node.crawlTime], (err, results) => {
        (err)
          ? rej(err)
          : res(getUnsafeOutputParams(results));
      });
    });
  }

  public createLink(nodFr: number, nodTo: number): Promise<{ created: boolean; }> {
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

  public dispose(): void { this.conn.end(); }

  public static getInstance(): ICrawlerModel {
    return new MySqlCrawlerModel(MYSQL_CONFIG);
  }
}
