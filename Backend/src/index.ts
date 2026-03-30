import http from "http";
import { WebSocketServer, WebSocket } from "ws";

// ✅ Render provides PORT automatically
const port = process.env.PORT || 8080;

// User type
interface User {
  socket: WebSocket;
  room: string;
}

// Store connected users
let allsocket: User[] = [];

// ✅ HTTP server (REQUIRED for Render detection)
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running 🚀");
});

// ✅ Attach WebSocket server to HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("✅ Client connected");

  socket.on("message", (message) => {
    try {
      const parsed = JSON.parse(message.toString());

      // 🔹 JOIN ROOM
      if (parsed.type === "join") {
        allsocket.push({
          socket,
          room: parsed.payload.roomId,
        });

        console.log("User joined room:", parsed.payload.roomId);
      }

      // 🔹 CHAT MESSAGE
      if (parsed.type === "chat") {
        const currentRoom = allsocket.find(
          (x) => x.socket === socket
        )?.room;

        if (!currentRoom) return;

        for (const user of allsocket) {
          if (user.room === currentRoom) {
            user.socket.send(parsed.payload.message);
          }
        }
      }
    } catch (err) {
      console.error("❌ Invalid message:", err);
    }
  });

  // 🔹 Cleanup on disconnect
  socket.on("close", () => {
    console.log("❌ Client disconnected");
    allsocket = allsocket.filter((x) => x.socket !== socket);
  });
});

// ✅ IMPORTANT: bind to 0.0.0.0 for Render
server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
});
