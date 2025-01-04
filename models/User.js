const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
    {
        fullName: { type: String, required: true },
        idNumber: {
            type: String,
            required: true,
            unique: true,
            match: [/^\d{9}$/, "ID number must be 9 digits"],
        },
        address: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email address",
            ],
        },
        phone: {
            type: String,
            required: true,
            match: [
                /^\+?\d{10,15}$/,
                "Phone number must be between 10-15 digits and can start with '+'",
            ],
        },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["Student", "Staff"],
            required: true,
        },
        courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    },
    { collection: "users" }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = model("User", userSchema);
module.exports = User;
