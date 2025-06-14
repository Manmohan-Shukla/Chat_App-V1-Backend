
import { WebSocket, WebSocketServer } from "ws";

const ws = new WebSocketServer({ port: 8080 });
interface User {
    socket: WebSocket,
    room: string
}

let allsocket: User[] = [];



ws.on("connection", (socket) => {

    socket.on("message", (message) => {
        const parsedmessage = JSON.parse(message as unknown as string);
        if (parsedmessage.type == "join") {
            allsocket.push({
                socket,
                room: parsedmessage.payload.roomId
            })
        }
        
if(parsedmessage.type=="chat"){
    const currentuserRoom =allsocket.find((x)=>x.socket==socket)?.room
    for(let i=0;i<allsocket.length;i++){
        if(allsocket[i].room==currentuserRoom){
         allsocket[i].socket.send(parsedmessage.payload.message)
        //  allsocket[i].socket.send(allsocket.length);
        }
    }


}

    })

    socket.on("disconnect", () => {

    })
})