import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
});

export default drizzle(pool);
