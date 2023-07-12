require("dotenv").config();

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_DATABASE,
  MYSQL_PASSWORD
} = process.env;

// MySQL

export type MySqlConfigType = {
  host: string;
  port: number;
  user: string;
  database: string;
  password: string;
}

export const MYSQL_CONFIG: MySqlConfigType = {
  host: MYSQL_HOST!,
  port: parseInt(MYSQL_PORT!),
  user: MYSQL_USER!,
  database: MYSQL_DATABASE!,
  password: MYSQL_PASSWORD!
};
