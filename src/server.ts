import express from "express";
import http from "http";
import "dotenv/config";
import wss from "./websocket";
import { logger } from "./utils/logger";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
