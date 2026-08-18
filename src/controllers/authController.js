import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        /**if (user.role !== "manager") {
            return res.status(403).json({
                message: "Only project manager can login here"
            });
        }*/

        if (!user.isActive) {
            return res.status(403).json({
                message: "Account is inactive"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};


// Get All Users API
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: "manager" }).sort({ createdAt: -1 });
        
        let totalUsers = users.length;
        let users_details = users.map(user => (
          { 
            id: user._id,
            name: user.name, 
            email: user.email
          }
        ));

        return res.status(200).json({
            message: "Users fetched successfully",
            Users:totalUsers,
            users: users_details
        });
    } catch (error) {
        next(error);
    }
};