import http from "http";
import { WebSocketServer, WebSocket } from "ws";

// ✅ Use Render port
const port = process.env.PORT || 8080;

// User type
interface User {
  socket: WebSocket;
  room: string;
}

// Store all users
let allsocket: User[] = [];

// ✅ HTTP server (REQUIRED for Render)
const server = http.createServer();

// ✅ Attach WebSocket to HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("✅ New client connected");

  socket.on("message", (message) => {
    try {
      const parsed = JSON.parse(message.toString());

      // JOIN ROOM
      if (parsed.type === "join") {
        allsocket.push({
          socket,
          room: parsed.payload.roomId,
        });

        console.log("User joined room:", parsed.payload.roomId);
      }

      // CHAT MESSAGE
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

  // ✅ Proper cleanup
  socket.on("close", () => {
    console.log("❌ Client disconnected");

    allsocket = allsocket.filter((x) => x.socket !== socket);
  });
});

// ✅ Start server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
