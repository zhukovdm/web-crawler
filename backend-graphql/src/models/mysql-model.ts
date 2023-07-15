require("dotenv").config();

import { Pool, createPool } from "mysql";
import { WebPageType } from "../domain/types";
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

  public getAllWebPages(): Promise<WebPageType[]> {
    const queryString: string = `CALL getAllWebPages ();`;

    return new Promise((res, rej) => {
      this.pool.query(queryString, [], (err, results) => {
        (err) ? rej(err) : res(results[0].map((page: any) => ({
          ...page, active: page.active === 1, tags: JSON.parse(page.tags)
        })));
      });
    });
  }

  dispose(): void { this.pool.end(); }
}
