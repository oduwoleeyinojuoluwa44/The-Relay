import "dotenv/config";

import { db as prodDb } from "./postgres";
import { db as devDb } from "./sqlite";

const db = process.env.NODE_ENV === "production" ? prodDb : devDb;

export default db;
