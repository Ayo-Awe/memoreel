import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as dotenv from "dotenv";
import * as schema from "./schema";
dotenv.config();

export const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
};

const pool = mysql.createPool(dbConfig);

export default drizzle(pool, { schema });
