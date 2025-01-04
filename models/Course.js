const { Schema, model } = require("mongoose");

const courseSchema = new Schema({
    name: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creditPoints: { type: Number, required: true, min: 3, max: 5 },
    maxStudents: { type: Number, required: true },
    registeredStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
}, { timestamps: true });

const Course = model("Course", courseSchema);
module.exports = Course;

