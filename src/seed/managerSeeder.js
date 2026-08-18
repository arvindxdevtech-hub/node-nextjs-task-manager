import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../config/database.js";

dotenv.config();

await connectDB();

const existingManager = await User.findOne({
    email: "manager@test.com"
});

if (existingManager) {
    console.log("Manager already exists");
    process.exit();
}

const hashedPassword = await bcrypt.hash("123456", 10);

await User.create({
    name: "Arvind Manager",
    email: "arvind@manager.com",
    password: hashedPassword,
    role: "manager"
});

console.log("Arvind Manager created successfully");

process.exit();

// Run:
// node src/seed/managerSeeder.js