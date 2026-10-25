const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        department: {
            type: String,
            required: true
        },
        course: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true,
            min: 1,
            max: 6
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);