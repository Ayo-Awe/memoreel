import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().notNull().autoincrement(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
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
  confirmationToken: varchar("confirmation_token", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deliveryDate: timestamp("delivery_date").notNull(),
  deliveryToken: varchar("delivery_token", { length: 255 }),
  status: mysqlEnum("status", [
    "delivered",
    "shipped",
    "failed",
    "unconfirmed",
  ]).notNull(),
  userId: int("user_id").references(() => users.id, { onDelete: "set null" }),
});

export const userSocialAccounts = mysqlTable(
  "user_social_accounts",
  {
    provider: mysqlEnum("provider", ["google"]).notNull(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    socialLoginId: varchar("social_login_id", { length: 100 }),
  },
  (table) => ({
    cpk: primaryKey(table.provider, table.userId),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  socialAccounts: many(userSocialAccounts),
  reels: many(reels),
}));

export const reelsRelations = relations(reels, ({ one }) => ({
  author: one(users, {
    fields: [reels.userId],
    references: [users.id],
  }),
}));

export const socialAccountsRelations = relations(
  userSocialAccounts,
  ({ one }) => ({
    user: one(users, {
      fields: [userSocialAccounts.userId],
      references: [users.id],
    }),
  })
);
