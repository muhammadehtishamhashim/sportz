import express from "express";
import http from "http";
import { matchesRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0";
const app = express();

// Use JSON middleware
app.use(express.json());
const server = http.createServer(app);
// Root GET route
app.get("/", (req, res) => {
  res.send("Welcome to the Sports Dashboard!");
});

app.use("/matches", matchesRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
// Start the server
server.listen(PORT, HOST, () => {
  const baseURL =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server is running at ${baseURL}`);
  console.log(`WebSocket is running at ${baseURL.replace("http", "ws")}/ws`);
});
