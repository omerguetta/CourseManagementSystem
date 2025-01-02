const { Schema, model } = require("mongoose");

const studentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Link to User
    studyYear: {
        type: Number,
        enum: [1, 2, 3, 4],
        required: true,
    },
});

module.exports = model("Student", studentSchema, "students");
