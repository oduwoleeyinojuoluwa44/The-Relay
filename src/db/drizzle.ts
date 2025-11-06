import "dotenv/config";

let db;

if (process.env.NODE_ENV === "production") {
  const { db: prodDb } = await import("./postgres");
  db = prodDb;
} else {
  const { db: devDb } = await import("./sqlite");
  db = devDb;
}

export default db;
