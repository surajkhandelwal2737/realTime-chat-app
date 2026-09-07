import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// In-memory state (resets on server restart - swap for a DB if you need persistence)
const onlineUsers = new Map(); // socket.id -> { id, username, color }
const MESSAGE_HISTORY_LIMIT = 50;
let messageHistory = [];

const USER_COLORS = [
  "#3A6F63",
  "#E2A33D",
  "#5B7DB1",
  "#B1615B",
  "#7A6FB0",
  "#4C8577",
];

function colorForUser(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i += 1) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

function getOnlineUsersList() {
  return Array.from(onlineUsers.values());
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", onlineCount: onlineUsers.size });
});

io.on("connection", (socket) => {
  socket.on("user:join", (username, ack) => {
    const trimmed = (username || "").trim().slice(0, 24);
    if (!trimmed) {
      if (typeof ack === "function") ack({ ok: false, error: "Username required" });
      return;
    }

    const isTaken = getOnlineUsersList().some(
      (u) => u.username.toLowerCase() === trimmed.toLowerCase()
    );
    if (isTaken) {
      if (typeof ack === "function") ack({ ok: false, error: "That name is already taken" });
      return;
    }

    const user = { id: socket.id, username: trimmed, color: colorForUser(trimmed) };
    onlineUsers.set(socket.id, user);

    if (typeof ack === "function") {
      ack({ ok: true, user, history: messageHistory, users: getOnlineUsersList() });
    }

    socket.broadcast.emit("system:message", {
      id: `sys-${Date.now()}`,
      text: `${trimmed} joined the chat`,
      timestamp: Date.now(),
    });
    io.emit("users:update", getOnlineUsersList());
  });

  socket.on("message:send", (text) => {
    const user = onlineUsers.get(socket.id);
    if (!user || typeof text !== "string") return;
    const trimmed = text.trim().slice(0, 1000);
    if (!trimmed) return;

    const message = {
      id: `${socket.id}-${Date.now()}`,
      userId: socket.id,
      username: user.username,
      color: user.color,
      text: trimmed,
      timestamp: Date.now(),
    };

    messageHistory.push(message);
    if (messageHistory.length > MESSAGE_HISTORY_LIMIT) {
      messageHistory = messageHistory.slice(-MESSAGE_HISTORY_LIMIT);
    }

    io.emit("message:new", message);
  });

  socket.on("typing:start", () => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;
    socket.broadcast.emit("typing:update", { userId: socket.id, username: user.username, isTyping: true });
  });

  socket.on("typing:stop", () => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;
    socket.broadcast.emit("typing:update", { userId: socket.id, username: user.username, isTyping: false });
  });

  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;
    onlineUsers.delete(socket.id);
    io.emit("system:message", {
      id: `sys-${Date.now()}`,
      text: `${user.username} left the chat`,
      timestamp: Date.now(),
    });
    io.emit("users:update", getOnlineUsersList());
  });
});

httpServer.listen(PORT, () => {
  console.log(`Chat server listening on http://localhost:${PORT}`);
});
