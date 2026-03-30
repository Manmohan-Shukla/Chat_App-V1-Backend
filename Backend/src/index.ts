import http from "http";
import { WebSocketServer, WebSocket } from "ws";

// ✅ Correct port handling
const port = Number(process.env.PORT) || 8080;

// User type
interface User {
  socket: WebSocket;
  room: string;
}

// Store users
let allsocket: User[] = [];

// ✅ Create HTTP server FIRST
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running 🚀");
});

// ✅ Attach WebSocket
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("✅ Client connected");

  socket.on("message", (message) => {
    try {
      const parsed = JSON.parse(message.toString());

      if (parsed.type === "join") {
        allsocket.push({
          socket,
          room: parsed.payload.roomId,
        });
      }

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

  socket.on("close", () => {
    console.log("❌ Client disconnected");
    allsocket = allsocket.filter((x) => x.socket !== socket);
  });
});

// ✅ Start server ONLY ONCE and AFTER declaration
server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
});
