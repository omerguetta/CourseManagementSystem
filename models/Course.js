const { Schema, model } = require("mongoose");

const facultySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: String, required: false },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

module.exports = model("FacultyMember", facultySchema, "staff");
