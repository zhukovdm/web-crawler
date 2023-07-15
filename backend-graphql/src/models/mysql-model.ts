require("dotenv").config();

import {
  Connection,
  createConnection
} from "mysql";
import { WebPageType } from "../domain/types";
import { IModel } from "../domain/interfaces";

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_DATABASE,
  MYSQL_PASSWORD
} = process.env;

export class MySqlModel implements IModel {

  private readonly conn: Connection;

  public constructor() {
    this.conn = createConnection({
      host: MYSQL_HOST!,
      port: parseInt(MYSQL_PORT!),
      user: MYSQL_USER!,
      database: MYSQL_DATABASE!,
      password: MYSQL_PASSWORD!,
      dateStrings: true,
      multipleStatements: true
    });
  }

  public getAllWebPages(): Promise<WebPageType[]> {
    const queryString: string = `CALL getAllWebPages ();`;

    return new Promise((res, rej) => {
      this.conn.query(queryString, [], (err, results) => {
        (err) ? rej(err) : res(results[0].map((page: any) => ({
          ...page, active: page.active === 1, tags: JSON.parse(page.tags)
        })));
      });
    });
  }

  dispose(): void { this.conn.end(); }
}
