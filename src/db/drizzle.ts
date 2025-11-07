import "dotenv/config";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";

import { db as prodDb } from "./postgres";
import { db as devDb } from "./sqlite";
import * as schema from "./schema";

type DbType = PostgresJsDatabase<typeof schema> | SqliteRemoteDatabase<typeof schema>;

const db: DbType = process.env.NODE_ENV === "production" ? prodDb : devDb;

export default db;
