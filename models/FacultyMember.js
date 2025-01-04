const { Schema, model } = require("mongoose");

const facultySchema = new Schema({
    userId: { type: String},
    department: { type: String, required: false },
    courses: [{ type: String}],
});

module.exports = model("FacultyMember", facultySchema, "staff");
