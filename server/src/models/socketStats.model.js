import mongoose from "mongoose";

const socketStatsSchema = new mongoose.Schema({
  activeSockets: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const SocketStats = mongoose.model("SocketStats", socketStatsSchema);
