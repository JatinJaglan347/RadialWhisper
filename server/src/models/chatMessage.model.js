// server/src/models/chatMessage.model.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const chatMessageSchema = new Schema({
  roomId: { type: String, required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage', default: null },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  createdAt: { type: Date, default: Date.now}
});

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
