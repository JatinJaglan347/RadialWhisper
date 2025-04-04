import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String], // Array of user IDs who liked this review
      default: [],
    },
    helpful: {
      type: Number,
      default: 0,
    },
    helpfulBy: {
      type: [String], // Array of user IDs who marked this as helpful
      default: [],
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review; 