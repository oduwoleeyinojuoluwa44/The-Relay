import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  room: text("room").notNull(),
  sender: text("sender").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
