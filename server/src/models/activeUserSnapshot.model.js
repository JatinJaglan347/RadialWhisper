import mongoose from 'mongoose';

const ActiveUserSnapshotSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  activeUserCount: { type: Number, required: true },
});

const ActiveUserSnapshot = mongoose.model('ActiveUserSnapshot', ActiveUserSnapshotSchema);

export default ActiveUserSnapshot;
