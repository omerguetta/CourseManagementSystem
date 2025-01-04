const { Schema, model } = require("mongoose");

const studentSchema = new Schema({
    userId: { type: String},
    studyYear: {
        type: Number,
        enum: [1, 2, 3, 4],
        required: true,
    },
    courses: [{ type: String}],
});

module.exports = model("Student", studentSchema, "students");
