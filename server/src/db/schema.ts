import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().notNull().autoincrement(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 100 }),
  confirmationToken: varchar("confirmation_token", { length: 255 }),
  confirmationTokenExpiresAt: timestamp("confirmation_token_expires_at"),
  verified: boolean("verified").default(false).notNull(),
  passwordToken: varchar("password_token", { length: 100 }),
  passwordTokenExpiresAt: timestamp("password_token_expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reels = mysqlTable("reels", {
  id: int("id").primaryKey().notNull().autoincrement(),
  userEmail: varchar("email", { length: 255 }).notNull(),
  bucketKey: varchar("bucket_key", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  confirmationToken: varchar("confirmation_token", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deliveryDate: timestamp("delivery_date").notNull(),
  status: mysqlEnum("status", [
    "delivered",
    "shipped",
    "failed",
    "unconfirmed",
  ]).notNull(),
  userId: int("user_id").references(() => users.id),
});

export const socialProviders = mysqlTable(
  "social_providers",
  {
    id: int("id").primaryKey().notNull().autoincrement(),
    name: varchar("name", { length: 50 }).notNull(),
  },
  (table) => ({
    nameIndex: uniqueIndex("idx_social_providers_name").on(table.name),
  })
);

export const userSocialAccounts = mysqlTable(
  "user_social_accounts",
  {
    socialProviderId: int("social_provider_id")
      .notNull()
      .references(() => socialProviders.id),
    userId: int("user_id")
      .notNull()
      .references(() => users.id),
    socialLoginId: varchar("social_login_id", { length: 100 }),
  },
  (table) => ({
    cpk: primaryKey(table.socialProviderId, table.userId),
  })
);
