// server/src/socket/socket.controller.js
import { ChatMessage } from "../models/chatMessage.model.js";
import { User } from "../models/user.model.js";

// Use these Maps/Sets to track users, chats, sockets and rooms.
const connectedUsers = new Map(); // key: userId, value: { socketId, fullName, activeChatRoom }
const activeChats = new Map();    // key: roomId, value: { user1, user2 }
const activeSockets = new Set();
const activeRooms = new Set();

// A helper function for structured logging.
function logEvent(event, details) {
  const timestamp = new Date().toISOString();
  console.log({ timestamp, event, ...details });
}

// -------------------- REGISTER USER --------------------
// Note: We now fetch the fullName from the DB using the userId.
export async function registerUser(socket, data) {
  try {
    // Fetch user details from the database
    const userRecord = await User.findById(data.userId).lean().exec();
    const fullName = userRecord?.fullName || "Unknown";
    
    // Store fullName along with socketId and current active chat
    connectedUsers.set(data.userId, {
      socketId: socket.id,
      fullName,
      activeChatRoom: null,
    });
    
    activeSockets.add(socket.id);
    socket.userId = data.userId;
    socket.fullName = fullName; // store fullName on the socket as well

    // Update active status in the database
    User.findByIdAndUpdate(data.userId, {
      $set: { "activeStatus.isActive": true, "activeStatus.lastActive": new Date() },
    }).exec();

    logEvent("User Registered", { userId: data.userId, fullName, socketId: socket.id });
    
    // Re-join any existing rooms this user might be part of
    for (const [roomId, chat] of activeChats.entries()) {
      if (chat.user1 === data.userId || chat.user2 === data.userId) {
        socket.join(roomId);
        const userData = connectedUsers.get(data.userId);
        if (userData) {
          userData.activeChatRoom = roomId;
        }
        logEvent("User Rejoined Room", { userId: data.userId, fullName, roomId });
      }
    }
  } catch (error) {
    logEvent("User Registration Error", { error: error.toString(), userId: data.userId });
    socket.emit("error", { message: "Registration failed" });
  }
}

// -------------------- JOIN CHAT --------------------
export async function joinChat(socket, data, io) {
  const currentUser = connectedUsers.get(socket.userId);
  if (!currentUser) {
    socket.emit("error", { message: "User not registered." });
    logEvent("Join Chat Error", { error: "User not registered", userId: socket.userId });
    return;
  }

  const targetUser = connectedUsers.get(data.targetUserId);
  if (!targetUser) {
    socket.emit("error", { message: "Target user not available." });
    logEvent("Join Chat Error", { error: "Target user not available", targetUserId: data.targetUserId });
    return;
  }

  // Leave all previous rooms except the socket's own room
  for (const room of socket.rooms) {
    if (room !== socket.id) {
      socket.leave(room);
      logEvent("Left Room", { userId: socket.userId, fullName: socket.fullName, room });
    }
  }

  // Create a unique room ID for one-to-one chat
  const roomId = [socket.userId, data.targetUserId].sort().join("_");
  socket.join(roomId);
  logEvent("Joined Room", { userId: socket.userId, fullName: socket.fullName, roomId });

  // Add the target user to the same room
  const targetSocket = io.sockets.sockets.get(targetUser.socketId);
  if (targetSocket) {
    // Ensure targetSocket leaves its previous rooms too
    for (const room of targetSocket.rooms) {
      if (room !== targetSocket.id) {
        targetSocket.leave(room);
        logEvent("Target Left Room", { userId: data.targetUserId, fullName: targetUser.fullName, room });
      }
    }
    targetSocket.join(roomId);
    logEvent("Target User Joined Room", { userId: data.targetUserId, fullName: targetUser.fullName, roomId });
  }

  // Update active chat room for both users
  currentUser.activeChatRoom = roomId;
  targetUser.activeChatRoom = roomId;
  activeChats.set(roomId, { user1: socket.userId, user2: data.targetUserId });

  // Fetch and send chat history (unchanged)
  try {
    const history = await ChatMessage.find({ roomId })
      .sort({ createdAt: 1 })
      .lean()
      .exec();
    const formattedHistory = history.map(msg => ({
      _id: msg._id,
      sender: msg.sender,
      message: msg.message,
      room: msg.roomId,
      status: msg.status,
      timestamp: msg.createdAt
    }));
    socket.emit("chatHistory", { roomId, history: formattedHistory });
    logEvent("Chat History Fetched", { userId: socket.userId, fullName: socket.fullName, roomId, historyCount: formattedHistory.length });
  } catch (error) {
    logEvent("Chat History Error", { error: error.toString(), roomId });
    socket.emit("error", { message: "Failed to fetch chat history." });
  }

  io.to(roomId).emit("chatStarted", { roomId });
  logEvent("Chat Started", { roomId, user1: socket.userId, user1FullName: socket.fullName, user2: data.targetUserId });
}
// -------------------- HANDLE MESSAGE --------------------
export async function handleMessage(socket, data, io) {
  if (!data.roomId || !data.message) {
    socket.emit("error", { message: "Invalid message data" });
    logEvent("Handle Message Error", { error: "Invalid message data", userId: socket.userId });
    return;
  }
  
  const roomId = data.roomId;
  const chat = activeChats.get(roomId);
  if (!chat) {
    logEvent("Handle Message Error", { error: "No active chat found", roomId, userId: socket.userId });
    socket.emit("error", { message: "No active chat found" });
    return;
  }
  
  if (socket.userId !== chat.user1 && socket.userId !== chat.user2) {
    logEvent("Unauthorized Message", { error: "Sender not in chat", roomId, userId: socket.userId });
    socket.emit("error", { message: "You are not a participant in this chat" });
    return;
  }
  
  const recipient = socket.userId === chat.user1 ? chat.user2 : chat.user1;
  try {
    const newMessage = new ChatMessage({
      roomId,
      sender: socket.userId,
      recipient,
      message: data.message,
      status: 'sent'
    });
    
    await newMessage.save();
    
    const messageObj = { 
      _id: newMessage._id,
      sender: socket.userId, 
      message: data.message, 
      room: roomId, 
      status: 'sent',
      timestamp: newMessage.createdAt
    };
    
    // Calculate unread message count for the recipient
    const unreadCount = await ChatMessage.countDocuments({
      roomId,
      recipient,
      status: 'delivered'
    });
    
    io.to(roomId).emit("newMessage", messageObj);
    logEvent("Message Sent", {
      roomId,
      sender: socket.userId,
      senderFullName: socket.fullName,
      recipient,
      recipientFullName: connectedUsers.get(recipient).fullName,
      message: data.message,
      messageId: newMessage._id
    });
    
    const recipientUser = connectedUsers.get(recipient);
    if (recipientUser && recipientUser.socketId) {
      await ChatMessage.findByIdAndUpdate(newMessage._id, { status: 'delivered' });
      io.to(recipientUser.socketId).emit("updateUnreadCount", {
        sender: socket.userId,
        count: unreadCount
      });
      const deliveredMessage = {
        messageId: newMessage._id,
        room: roomId,
        status: 'delivered'
      };
      io.to(roomId).emit("messageDelivered", deliveredMessage);
      logEvent("Message Delivered", {
        roomId,
        messageId: newMessage._id,
        recipient,
        recipientFullName: recipientUser.fullName,
        unreadCount
      });
    }
  } catch (error) {
    logEvent("Handle Message Error", { error: error.toString(), roomId, userId: socket.userId });
    socket.emit("error", { message: "Failed to send message" });
  }
}

// -------------------- MARK MESSAGES AS READ --------------------
export async function markMessagesAsRead(socket, data, io) {
  if (!data.roomId) {
    socket.emit("error", { message: "Invalid room data" });
    logEvent("Mark Messages As Read Error", { error: "Invalid room data", userId: socket.userId });
    return;
  }

  const roomId = data.roomId;
  const chat = activeChats.get(roomId);
  if (!chat) {
    socket.emit("error", { message: "No active chat found" });
    logEvent("Mark Messages As Read Error", { error: "No active chat found", roomId, userId: socket.userId });
    return;
  }

  if (socket.userId !== chat.user1 && socket.userId !== chat.user2) {
    socket.emit("error", { message: "You are not a participant in this chat" });
    logEvent("Mark Messages As Read Error", { error: "User not a participant", roomId, userId: socket.userId });
    return;
  }

  const sender = socket.userId === chat.user1 ? chat.user2 : chat.user1;

  try {
    // Mark messages as read
    const updatedMessages = await ChatMessage.updateMany(
      { roomId, sender, status: { $ne: 'read' } },
      { $set: { status: 'read' } }
    );

    if (updatedMessages.modifiedCount > 0) {
      const messages = await ChatMessage.find({
        roomId,
        sender,
        status: 'read'
      })
      .sort({ createdAt: -1 })
      .limit(updatedMessages.modifiedCount)
      .lean();

      // Recalculate unread count for the recipient (socket.userId)
      const unreadCount = await ChatMessage.countDocuments({
        roomId,
        recipient: socket.userId,
        status: 'delivered'
      });

      // Notify both users in the room
      io.to(roomId).emit("messagesRead", {
        roomId,
        reader: socket.userId,
        messageIds: messages.map(msg => msg._id)
      });

      // Send updated unread count to the reader (socket.userId)
      io.to(socket.id).emit("updateUnreadCount", {
        sender,
        count: unreadCount
      });

      // Send updated unread count to the sender (to reset their sent message notification if needed)
      const senderSocket = connectedUsers.get(sender);
      if (senderSocket) {
        io.to(senderSocket.socketId).emit("updateUnreadCount", {
          sender: socket.userId,
          count: 0 // Reset sender's count for this room since messages are read
        });
      }

      logEvent("Messages Marked As Read", {
        roomId,
        reader: socket.userId,
        readerFullName: socket.fullName,
        updatedCount: updatedMessages.modifiedCount,
        messageIds: messages.map(msg => msg._id),
        unreadCount
      });
    }
  } catch (error) {
    logEvent("Mark Messages As Read Error", { error: error.toString(), roomId, userId: socket.userId });
    socket.emit("error", { message: "Failed to update message status" });
  }
}

// -------------------- LEAVE CHAT --------------------
export function leaveChat(socket, data, io) {
  if (!data.roomId) return;
  
  socket.leave(data.roomId);
  logEvent("Left Chat Room", { userId: socket.userId, fullName: socket.fullName, roomId: data.roomId });
  
  const user = connectedUsers.get(socket.userId);
  if (user) {
    user.activeChatRoom = null;
  }
  
  if (!io.sockets.adapter.rooms.has(data.roomId)) {
    activeRooms.delete(data.roomId);
    logEvent("Room Deleted", { roomId: data.roomId });
  }
  
  io.to(data.roomId).emit("userLeft", { 
    userId: socket.userId, 
    message: "User has left the chat" 
  });
  logEvent("User Left Notification Sent", { roomId: data.roomId, userId: socket.userId, fullName: socket.fullName });
}

// -------------------- DISCONNECT --------------------
export function disconnect(socket, io) {
  const userId = socket.userId;
  if (userId && connectedUsers.has(userId)) {
    const user = connectedUsers.get(userId);
    if (user.activeChatRoom) {
      io.to(user.activeChatRoom).emit("userDisconnected", { 
        userId,
        message: "User disconnected" 
      });
      logEvent("User Disconnected from Room", { userId, fullName: user.fullName, roomId: user.activeChatRoom });
    }
    User.findByIdAndUpdate(userId, {
      $set: { "activeStatus.isActive": false, "activeStatus.lastActive": new Date() },
    }).exec();
    activeSockets.delete(socket.id);
    connectedUsers.delete(userId);
    logEvent("User Disconnected", { userId, fullName: user.fullName, socketId: socket.id });
  }
  logEvent("Socket Disconnected", { socketId: socket.id });
}

// -------------------- INITIALIZE SOCKET --------------------
export function initSocket(io)  {
  io.on("connection", (socket) => {
      logEvent("Socket Connected", { socketId: socket.id });
      activeSockets.add(socket.id);

      socket.on("join_room", (room) => {
          socket.join(room);
          activeRooms.add(room);
          logEvent("join_room Event", { socketId: socket.id, userId: socket.userId, fullName: socket.fullName, room });
      });

      socket.on("disconnect", () => {
          logEvent("Socket Disconnect Event", { socketId: socket.id, userId: socket.userId, fullName: socket.fullName });
          activeSockets.delete(socket.id);
          if (socket.userId) {
            connectedUsers.delete(socket.userId);
          }
      });
  });
}




// -------------------- GET SOCKET STATS --------------------
export function getSocketStats() {
  const stats = {
    activeSockets: activeSockets.size,
    activeRooms: activeRooms.size,
  };
  logEvent("Socket Stats", stats);
  return stats;
}

// -------------------- AUTO LOGOUT INACTIVE USERS --------------------
setInterval(async () => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  
  await User.updateMany(
    { "activeStatus.isActive": true, "activeStatus.lastActive": { $lt: fifteenMinutesAgo } },
    { $set: { "activeStatus.isActive": false } }
  );

  logEvent("Inactive Users Updated", { threshold: fifteenMinutesAgo.toISOString() });
}, 5 * 60 * 1000); // Run every 5 minutes
