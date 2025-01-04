const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const FacultyMember = require("../models/FacultyMember");

const registerUser = async (req, res) => {
    try {
        const { fullName, idNumber, address, email, phone, password, role, studyYear } = req.body;

        if (!["Student", "Staff"].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Must be 'Student' or 'Staff'." });
        }

        if (role === "Student" && !studyYear) {
            return res.status(400).json({ error: "Study year is required for students." });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { idNumber }] });
        if (existingUser) {
            return res.status(400).json({ error: "ID number or email is already in use" });
        }

        const newUser = new User({
            fullName,
            idNumber,
            address,
            email,
            phone,
            password,
            role,
        });
        await newUser.save();

        if (role === "Student") {
            const newStudent = new Student({
                userId:idNumber,
                studyYear,
            });
            await newStudent.save();
        } else if (role === "Staff") {
            const newFaculty = new FacultyMember({
                userId:idNumber,
            });
            await newFaculty.save();
        }

        res.status(201).json({
            message: `${role} registered successfully!`,
            user: {
                userID: newUser._id,
                fullName: newUser.fullName,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ error: "Failed to register user" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { idNumber, password } = req.body;
        console.log("Login Request Body:", req.body);
        const user = await User.findOne({ idNumber });
        if (!user) {
            console.log("User not found for ID number:", idNumber);
            return res.status(404).json({ error: "User not found" });
        }
        console.log("User Found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                userID: user._id,
                fullName: user.fullName,
                idNumber: user.idNumber,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json({ error: "Failed to log in user" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserCourses,
};
