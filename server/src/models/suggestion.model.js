import mongoose, { Schema } from "mongoose";

const suggestionSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    updatedAt: {
        type: Date,
    },
});

// Middleware to update the `updatedAt` timestamp on modification
suggestionSchema.pre("save", function (next) {
    if (this.isModified("title") || this.isModified("category") || this.isModified("description")) {
        this.updatedAt = Date.now();
    }
    next();
});

export const Suggestion = mongoose.model("Suggestion", suggestionSchema);
