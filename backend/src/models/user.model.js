import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId; // Password is required ONLY if googleId is not present
            }
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple null/undefined values despite uniqueness
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
