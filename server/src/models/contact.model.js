import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    isExistingUser: { type: Boolean, default: false }, // If the user exists in the system
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Reference to existing user if applicable
    contactCompleted: { type: Boolean, default: false }, // Admin can mark as processed
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

// Middleware to update `updatedAt` on modification
contactSchema.pre("save", function (next) {
    if (this.isModified()) {
        this.updatedAt = Date.now();
    }
    next();
});

export const Contact = mongoose.model("Contact", contactSchema);
