import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/mysql2";
import { dbConfig } from ".";
import mysql from "mysql2/promise";

// IIFE to run migration asynchronously
(async () => {
  try {
    const db = drizzle(await mysql.createConnection(dbConfig));
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Migration successful!!!");
    process.exit(0);
  } catch (error: any) {
    console.error("Migration failed");
    console.error(error.message);
    process.exit(1);
  }
})();
