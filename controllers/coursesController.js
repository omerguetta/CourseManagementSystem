const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const Student = require("../models/Student");
const FacultyMember = require("../models/FacultyMember");

const addCourse = async (req, res) => {
    try {
        const { courseId, name, instructorIdNumber, creditPoints, maxStudents } = req.body;

        const existingCourse = await Course.findOne({ courseId });
        if (existingCourse) {
            return res.status(400).json({ error: "Course ID already exists" });
        }
        console.log(instructorIdNumber);
        const instructorUser = await User.findOne({ idNumber: instructorIdNumber });
        if (!instructorUser || instructorUser.role !== "Staff") {
            return res.status(400).json({ error: "Invalid instructor or instructor not found" });
        }

        const newCourse = new Course({
            courseId,
            name,
            instructor: instructorIdNumber,
            creditPoints,
            maxStudents,
        });

        await newCourse.save();

        res.status(201).json({ message: "Course added successfully!", course: newCourse });
    } catch (error) {
        console.error("Error adding course:", error.message);
        res.status(500).json({ error: "Failed to add course" });
    }
};

const getAllCourses = async (req, res) => {
    try {
        console.log(req.user.role);
        if (req.user.role !== "Staff") {
            return res.status(403).json({ error: "Access denied. Only staff can view all courses." });
        }

        const courses = await Course.find();
        console.log(courses);

        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error.message);
        res.status(500).json({ error: "Failed to fetch courses" });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        await Course.deleteOne({ courseId });
        res.status(200).json({ message: "Course deleted successfully!" });
    } catch (error) {
        console.error("Error deleting course:", error.message);
        res.status(500).json({ error: "Failed to delete course" });
    }
};

const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findOne({ courseId })
            .populate("instructor", "fullName email")
            .populate("registeredStudents", "fullName email");

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error("Error fetching course details:", error.message);
        res.status(500).json({ error: "Failed to fetch course details" });
    }
};

const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const updates = req.body;

        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const allowedFields = ["name", "creditPoints", "maxStudents"];
        Object.keys(updates).forEach((key) => {
            if (allowedFields.includes(key)) {
                course[key] = updates[key];
            }
        });

        await course.save();
        res.status(200).json({ message: "Course updated successfully!", course });
    } catch (error) {
        console.error("Error updating course:", error.message);
        res.status(500).json({ error: "Failed to update course" });
    }
};

const getRegisteredCourses = async (req, res) => {
    try {
        const {userId} = req.params;
        console.log(userId);
        const student = await User.findOne({idNumber:userId});
        console.log(student);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        const courses = await Course.find({ registeredStudents: userId })
            .populate("instructor", "fullName email");

        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching registered courses:", error.message);
        res.status(500).json({ error: "Failed to fetch registered courses" });
    }
};

const registerForCourse = async (req, res) => {
    try {
        const { courseId, idNumber } = req.body;
        console.log(req.body);

        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.registeredStudents.length >= course.maxStudents) {
            return res.status(400).json({ error: "Course is full" });
        }

        if (course.registeredStudents.includes(idNumber)) {
            return res.status(400).json({ error: "Student is already registered for this course" });
        }

        course.registeredStudents.push(idNumber);
        await course.save();

        const user = await User.findOne({ idNumber });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!user.courses.includes(course.name)) {
            user.courses.push(course.name);
            await user.save();
        }

        const student = await Student.findOne({ userId: idNumber });
        if (!student) {
            return res.status(404).json({ error: "Student not found in Student collection" });
        }
        if (!student.courses.includes(course.name)) {
            student.courses.push(course.name);
            await student.save();
        }

        res.status(200).json({ message: "Registered for course successfully!" });
    } catch (error) {
        console.error("Error registering for course:", error.message);
        res.status(500).json({ error: "Failed to register for course" });
    }
};

const unregisterFromCourse = async (req, res) => {
    try {
        const { courseId, idNumber } = req.body;

        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (!course.registeredStudents.includes(idNumber)) {
            return res.status(400).json({ error: "Student is not registered in this course" });
        }

        course.registeredStudents = course.registeredStudents.filter(
            (id) => id.toString() !== idNumber.toString()
        );
        await course.save();

        const user = await User.findOne({ idNumber });
        if (!user) {
            return res.status(404).json({ error: "Student not found" });
        }
        user.courses = user.courses.filter((courseName) => courseName !== course.name);
        await user.save();

        const student = await Student.findOne({ userId: idNumber });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        student.courses = student.courses.filter((courseName) => courseName !== course.name);
        await student.save();

        res.status(200).json({ message: "Unregistered from course successfully!" });
    } catch (error) {
        console.error("Error unregistering from course:", error.message);
        res.status(500).json({ error: "Failed to unregister from course" });
    }
};

module.exports = {
    addCourse,
    getAllCourses,
    getRegisteredCourses,
    registerForCourse,
    unregisterFromCourse,
    deleteCourse,
    getCourseDetails,
    editCourse,
};
