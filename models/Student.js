const { Schema, model } = require("mongoose");

const studentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    studyYear: {
        type: Number,
        enum: [1, 2, 3, 4],
        required: true,
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

module.exports = model("Student", studentSchema, "students");
