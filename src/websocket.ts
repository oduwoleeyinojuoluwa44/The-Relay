import { WebSocketServer, WebSocket } from "ws";
import { publisher, subscriber } from "./redis";
import { messageSchema, Message } from "./types/message";
import db from "./db/drizzle";
import { messages } from "./db/schema";
import { logger } from "./utils/logger";

const wss = new WebSocketServer({ noServer: true });

const clients = new Map<string, WebSocket>();
const rooms = new Map<string, Set<string>>();

// Rate limiting
const rateLimiter = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 10;
const TIME_WINDOW = 10000; // 10 seconds

subscriber.subscribe("room:*", (err, count) => {
  if (err) {
    logger.error("Failed to subscribe:", err);
  } else {
    logger.info(`${count} channels subscribed.`);
  }
});

subscriber.on("message", (channel, message) => {
  const room = channel.split(":")[1];
  if (rooms.has(room)) {
    for (const clientId of rooms.get(room)!) {
      const client = clients.get(clientId);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
});

wss.on("connection", (ws) => {
  const clientId = Math.random().toString(36).substring(7);
  clients.set(clientId, ws);
  logger.info(`Client ${clientId} connected.`);

  ws.on("message", async (message) => {
    const now = Date.now();
    const clientData = rateLimiter.get(clientId) || { count: 0, timestamp: now };

    if (now - clientData.timestamp > TIME_WINDOW) {
      clientData.count = 1;
      clientData.timestamp = now;
    } else {
      clientData.count++;
    }

    rateLimiter.set(clientId, clientData);

    if (clientData.count > RATE_LIMIT) {
      logger.warn(`Client ${clientId} exceeded rate limit.`);
      return; // Drop the message
    }

    try {
      const parsedMessage: Message = messageSchema.parse(JSON.parse(message.toString()));
      const { type, room, sender, text } = parsedMessage;

      if (type === "join") {
        if (!rooms.has(room)) {
          rooms.set(room, new Set());
        }
        rooms.get(room)!.add(clientId);
        logger.info(`Client ${clientId} joined room ${room}.`);
      } else if (type === "message") {
        await db.insert(messages).values({ room, sender, text });
        publisher.publish(`room:${room}`, JSON.stringify(parsedMessage));
      }
    } catch (error) {
      logger.error("Failed to process message:", error);
    }
  });

  ws.on("close", () => {
    clients.delete(clientId);
    for (const room of rooms.keys()) {
      if (rooms.get(room)!.has(clientId)) {
        rooms.get(room)!.delete(clientId);
      }
    }
    logger.info(`Client ${clientId} disconnected.`);
  });
});

export default wss;
