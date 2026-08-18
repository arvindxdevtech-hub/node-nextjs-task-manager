import User from "../models/User.js";
import bcrypt from "bcryptjs";

/*assignedTo  → employee ka _id
assignedBy  → manager ka _id
priority    → high / medium / low
status      → pending / working / hold / completed
assignDate  → task kab assign hua
dueDate     → kab tak complete karna hai*/


// Create employee Api
export const createEmployee = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingEmployee = await User.findOne({ email });

        if (existingEmployee) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "employee"
        });

        return res.status(201).json({
            message: "Employee created successfully",
            employee: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                isActive: employee.isActive
            }
        });

    } catch (error) {
        next(error);
    }
};

export const getEmployees = async (req, res, next) => {
    try {
        const employees = await User.find({
            role: "employee"
        })
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Employees fetched successfully",
            employees
        });
    } catch (error) {
        next(error);
    }
};

export const getEmployeeById = async (req, res, next) => {
    try {
        const employee = await User.findOne({
            _id: req.params.id,
            role: "employee"
        }).select("-password");

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            message: "Employee fetched successfully",
            employee
        });
    } catch (error) {
        next(error);
    }
};

export const updateEmployee = async (req, res, next) => {
    try {
        const { name, email, password, isActive } = req.body;

        const employee = await User.findOne({
            _id: req.params.id,
            role: "employee"
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        if (email && email !== employee.email) {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }
        }

        if (name !== undefined) {
            employee.name = name;
        }

        if (email !== undefined) {
            employee.email = email;
        }

        if (isActive !== undefined) {
            employee.isActive = isActive;
        }

        if (password) {
            employee.password = await bcrypt.hash(password, 10);
        }

        await employee.save();

        return res.status(200).json({
            message: "Employee updated successfully",
            employee: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                isActive: employee.isActive
            }
        });

    } catch (error) {
        next(error);
    }
};

export const deleteEmployee = async (req, res, next) => {
    try {
        const employee = await User.findOneAndDelete({
            _id: req.params.id,
            role: "employee"
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            message: "Employee deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};