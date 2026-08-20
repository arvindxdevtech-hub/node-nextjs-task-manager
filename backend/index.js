/**
 * Socket.io + Express + MongoDB + Next.js / React
 * 
 *                 PORT 3000
                       │
                 HTTP SERVER
                  /         \
                 /           \
            Express        Socket.IO
               │               │
          REST APIs         Realtime
               │             Events
               ↓               ↓
            MongoDB       Next.js UI
 */

import express from "express";
import dotenv from "dotenv";

// Node.js ka built-in HTTP module
import http from "http";
import cors from "cors";

// Socket.IO server
import { Server } from "socket.io";

import connectDB from "./src/config/database.js";

import authRoutes from "./src/routes/authRoutes.js";
import employeeRoutes from "./src/routes/employeeRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import employeeTaskRoutes from "./src/routes/employeeTaskRoutes.js";


dotenv.config();


// ------------------------------------
// 1. Express application create
// ------------------------------------
const app = express();

app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}));


// JSON request body read karne ke liye
app.use(express.json());


// MongoDB connect
await connectDB();


// ------------------------------------
// 2. Express ke liye HTTP Server create
// ------------------------------------
const server = http.createServer(app);


// ------------------------------------
// 3. Socket.IO ko HTTP server ke
//    saath attach kiya
// ------------------------------------
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


// ------------------------------------
// 4. Socket.IO connection
// ------------------------------------
/*io.on("connection", (socket) => {

    console.log("Socket connected:", socket.id);

    // Jab client disconnect hoga
    socket.on("disconnect", () => {

        console.log("Socket disconnected:", socket.id);

    });

});*/

// with room join event 

// Manager task assign kare → assigned employee ko realtime event bhejna.
/**
 * 
 * Flow:

Employee login/frontend
       ↓
Socket connect
       ↓
Employee apni room join karega
employee_<USER_ID>
       ↓
Manager task create karega
       ↓
createTask Controller
       ↓
MongoDB me task save
       ↓
Socket.IO
       ↓
employee_<assignedTo>
       ↓
Sirf assigned employee ko "new-task" event

Example:

Kiran ID = 123
Rahul ID = 456


-- Rooms:
employee_123  → Kiran
employee_456  → Rahul

Manager Kiran ko task assign kare:

io.to("employee_123").emit("new-task", task);

To Rahul ko event nahi milega. 

--- example:
Next.js Employee -> Kiran (ID 123)

emit("join-employee", "123")
              ↓
         Node Server
              ↓
on("join-employee")
              ↓
socket.join("employee_123")
              ↓
      Kiran Socket
          ROOM
     employee_123
*/

io.on("connection", (socket) => {

    // Jab frontend Socket.IO se connect hoga
    console.log("Socket connected:", socket.id);


    // Frontend employee apni user ID bhejega
    socket.on("join-employee", (employeeId) => {

        // Employee ke liye unique room name
        const roomName = `employee_${employeeId}`;

        // Current socket ko us room me add karo
        socket.join(roomName);

        console.log(
            `Employee ${employeeId} joined room ${roomName}`
        );
    });

    socket.on("join-manager", (managerId) => {
        const roomName = `manager_${managerId}`;

        socket.join(roomName);

        console.log(
            `Manager ${managerId} joined room ${roomName}`
        );
    });


    // Client disconnect
    socket.on("disconnect", () => {

        console.log("Socket disconnected:", socket.id);

    });

});


// ------------------------------------
// 5. Socket.IO instance Express me save
// ------------------------------------
app.set("io", io);


// ------------------------------------
// API Routes
// ------------------------------------
app.use("/api/auth", authRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/employee/tasks", employeeTaskRoutes);


// Test route
app.get("/", (req, res) => {

    res.json({
        message: "Team Task Manager API is running"
    });

});


const PORT = process.env.PORT || 3000;


// ------------------------------------
// OLD
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


// ------------------------------------
// NEW
// HTTP server start
// ------------------------------------
server.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});


/**old - without socket.io */

/*import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import employeeRoutes from "./src/routes/employeeRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import employeeTaskRoutes from "./src/routes/employeeTaskRoutes.js";


dotenv.config();

const app = express();

app.use(express.json());

await connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/employee/tasks", employeeTaskRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "Team Task Manager API is running"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});*/