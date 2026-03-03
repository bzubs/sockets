import { WebSocketServer, WebSocket } from "ws";


interface User {
    socket : WebSocket,
    room : string
}

let allSockets: User [] = [];


const wss = new WebSocketServer({port : 8080});

wss.on("connection", (socket)=>{
    console.log("Client Connected");

    socket.on("message", (msg)=>{
        const parsed = JSON.parse(String(msg));
        if(parsed.type==="join"){
            allSockets.push(
                {
                    socket : socket,
                    room : parsed.payload.room,
                }
            )
        };

        if(parsed.type ==="chat"){
            const currUserObj = allSockets.find((x)=> x.socket === socket);

            if (!currUserObj) return; // stop execution safely

            const currUserRoom = currUserObj.room;

            for (const user of allSockets) {
                if (user.room === currUserRoom) {
                    user.socket.send(parsed.payload.message);
                }
            }





        }
        
        
    });
});



