import * as bcrypt from "bcrypt";
import { eq, InferModel } from "drizzle-orm";
import {
  MySqlTransaction,
  PreparedQueryHKTBase,
  QueryResultHKT,
} from "drizzle-orm/mysql-core";

import db from "../../../db";
import { users } from "../../../db/schema";

type NewUser = InferModel<typeof users, "insert">;
type UpdateUser = Partial<NewUser>;

export async function findByEmail<
  T extends QueryResultHKT,
  U extends PreparedQueryHKTBase
>(email: string, tx?: MySqlTransaction<T, U>) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function findById<
  T extends QueryResultHKT,
  U extends PreparedQueryHKTBase
>(id: number, tx?: MySqlTransaction<T, U>) {}

export async function create<
  T extends QueryResultHKT,
  U extends PreparedQueryHKTBase
>(data: NewUser, tx?: MySqlTransaction<T, U>) {
  const payload = { ...data };
  const database = tx || db;

  // Hash password
  if (payload.password) {
    const hash = await bcrypt.hash(payload.password, 10);
    payload.password = hash;
  }

  await database.insert(users).values(payload);

  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.email, payload.email));

  return user;
}

export async function update<
  T extends QueryResultHKT,
  U extends PreparedQueryHKTBase
>(id: number, data: UpdateUser, tx?: MySqlTransaction<T, U>) {
  const database = tx || db;

  const res = await database.update(users).set(data).where(eq(users.id, id));

  return res;
}
