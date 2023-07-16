require("dotenv").config();

import { Pool, createPool } from "mysql";
import { NodeBaseType, WebPageType } from "../domain/types";
import { IModel } from "../domain/interfaces";

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_DATABASE,
  MYSQL_PASSWORD
} = process.env;

const MYSQL_CONFIG = {
  host: MYSQL_HOST!,
  port: parseInt(MYSQL_PORT!),
  user: MYSQL_USER!,
  database: MYSQL_DATABASE!,
  password: MYSQL_PASSWORD!
};

export class MySqlModel implements IModel {

  /**
   * Number of shared connections.
   */
  private static readonly CONNECTION_LIMIT: number = 10;

  /**
   * Connection pool.
   */
  private readonly pool: Pool;

  public constructor() {

    this.pool = createPool({
      ...MYSQL_CONFIG,
      dateStrings: true,
      multipleStatements: true,
      connectionLimit: MySqlModel.CONNECTION_LIMIT
    });
  }

  private unpackPage(page: any): WebPageType {
    return { ...page, active: page.active === 1, tags: JSON.parse(page.tags) };
  }

  public getAllWebPages(): Promise<WebPageType[]> {
    const queryString: string = `CALL getAllWebPages ();`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [], (err, results) => {
        (err) ? rej(err) : res(results[0].map((page: any) => (this.unpackPage(page))));
      });
    });
  }

  public getWebPage(recId: number): Promise<WebPageType | undefined> {
    const queryString: string = `CALL getWebPage (?);`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [recId], (err, results) => {
        if (err) { rej(err); }
        else {
          const page = results[0][0];
          res(page ? this.unpackPage(page) : undefined);
        }
      });
    });
  }

  public getLatestNodes(recId: number): Promise<NodeBaseType[]> {
    const queryString: string = `CALL getLatestNodes (?);`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [recId], (err, results) => {
        (err) ? rej(err) : res(results[0])
      });
    })
  }

  public getNode(nodId: number): Promise<NodeBaseType | undefined> {
    const queryString: string = `CALL getNode (?)`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [nodId], (err, results) => {
        (err) ? rej(err) : res(results[0][0]);
      });
    });
  }

  public getNodeLinks(nodFr: number): Promise<number[]> {
    const queryString: string = `CALL getNodeLinks (?)`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [nodFr], (err, results) => {
        (err) ? rej(err) : res(results[0].map((row: any) => row.nodTo));
      });
    });
  }

  dispose(): void { this.pool.end(); }
}
