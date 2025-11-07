import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  driver: "d1-http",
  dialect: "sqlite", // D1 typically proxies SQLite
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
