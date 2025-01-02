const { Schema, model } = require("mongoose");

const facultySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: String, required: false },
});

module.exports = model("FacultyMember", facultySchema, "staff");
