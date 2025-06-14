"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const ws = new ws_1.WebSocketServer({ port: 8080 });
let allsocket = [];
ws.on("connection", (socket) => {
    socket.on("message", (message) => {
        var _a;
        const parsedmessage = JSON.parse(message);
        if (parsedmessage.type == "join") {
            allsocket.push({
                socket,
                room: parsedmessage.payload.roomId
            });
        }
        if (parsedmessage.type == "chat") {
            const currentuserRoom = (_a = allsocket.find((x) => x.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
            for (let i = 0; i < allsocket.length; i++) {
                if (allsocket[i].room == currentuserRoom) {
                    allsocket[i].socket.send(parsedmessage.payload.message);
                    //  allsocket[i].socket.send(allsocket.length);
                }
            }
        }
    });
    socket.on("disconnect", () => {
    });
});
