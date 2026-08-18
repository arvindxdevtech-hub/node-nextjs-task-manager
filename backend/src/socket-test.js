// test use this with npm run dev , other terminal run node socket-test.js

// Socket.IO client import
import { io } from "socket.io-client";

// Hamare local Socket.IO server se connect
const socket = io("http://localhost:3000");

// Connection successful
socket.on("connect", () => {
    console.log("Client connected successfully");
    console.log("Socket ID:", socket.id);
});

// Agar disconnect ho
socket.on("disconnect", () => {
    console.log("Client disconnected");
});