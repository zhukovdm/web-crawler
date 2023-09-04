require("dotenv").config();

import { Pool, createPool } from "mysql";
import { IModel } from "../domain/interfaces";
import { NodeBase, WebPage } from "../domain/types";

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

/**
 * Wrapper over MySql database with connection pool.
 */
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

  private unpackWebPage(page: any): WebPage {
    return { ...page, active: page.active === 1, tags: JSON.parse(page.tags) };
  }

  public getAllWebPages(): Promise<WebPage[]> {
    const queryString = `CALL getAllWebPages ();`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [], (err, results) => {
        (err) ? rej(err) : res(results[0].map((page: any) => (this.unpackWebPage(page))));
      });
    });
  }

  public getWebPage(recId: number): Promise<WebPage | undefined> {
    const queryString = `CALL getWebPage (?);`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [recId], (err, results) => {
        if (err) { rej(err); }
        else {
          const page = results[0][0];
          res(page ? this.unpackWebPage(page) : undefined);
        }
      });
    });
  }

  public getLatestNodes(recId: number): Promise<NodeBase[]> {
    const queryString = `CALL getLatestNodes (?);`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [recId], (err, results) => {
        (err) ? rej(err) : res(results[0])
      });
    })
  }

  public getNode(nodId: number): Promise<NodeBase | undefined> {
    const queryString = `CALL getNode (?)`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [nodId], (err, results) => {
        (err) ? rej(err) : res(results[0][0]);
      });
    });
  }

  public getNodeLinks(nodFr: number): Promise<number[]> {
    const queryString = `CALL getNodeLinks (?)`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [nodFr], (err, results) => {
        (err) ? rej(err) : res(results[0].map((row: any) => row.nodTo));
      });
    });
  }

  dispose(): void { this.pool.end(); }
}
