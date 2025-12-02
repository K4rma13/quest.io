import { io } from "socket.io-client"


const socket = io('/',{
    path:"/api/socket",
    autoConnect:false
})



socket.on("error", err => {
    console.log("Socket error:", err);
});

export default socket