// Socket.IO client ka io function import.
// Ye frontend ko Socket.IO server se connect karta hai.
import { io } from "socket.io-client";


// Common backend URL.
// REST API aur Socket.IO dono same backend server use kar rahe hain.
import { BASE_URL } from "@/lib/api";


// ---------------------------------------------------
// Socket connection object create kar rahe hain.
// ---------------------------------------------------

export const socket = io(
    BASE_URL,
    {
        // autoConnect false ka matlab:
        // file import hote hi Socket.IO server se
        // automatically connect mat karo.
        //
        // Hum manually connect karenge jab
        // employee login ho chuka ho.
        autoConnect: false,
    }
);