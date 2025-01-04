const { Schema, model } = require("mongoose");

const courseSchema = new Schema({
    courseId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    instructor: { type: String, required: true },
    creditPoints: { type: Number, required: true, min: 3, max: 5 },
    maxStudents: { type: Number, required: true },
    registeredStudents: [{ type: String }],
}, { timestamps: true });

const Course = model("Course", courseSchema);
module.exports = Course;
