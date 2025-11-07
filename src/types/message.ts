


import { z } from "zod";

export const messageSchema = z.object({
  type: z.enum(["join", "message"]),
  room: z.string(),
  sender: z.string(),
  text: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
