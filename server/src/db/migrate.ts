import { migrate } from "drizzle-orm/mysql2/migrator";
import db from ".";

// IIFE to run migration asynchronously
(async () => {
  try {
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Migration successful!!!");
    process.exit(0);
  } catch (error: any) {
    console.error("Migration failed");
    console.error(error.message);
    process.exit(1);
  }
})();
