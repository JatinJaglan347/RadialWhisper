// server/src/socket/socket.controller.js
import { ChatMessage } from "../models/chatMessage.model.js";
import { User } from "../models/user.model.js"; // Import the User model

const connectedUsers = new Map(); 
const activeChats = new Map(); 
const activeSockets = new Set();
const activeRooms = new Set();

export function registerUser(socket, data) {
  connectedUsers.set(data.userId, {
    socketId: socket.id,
    activeChatRoom: null,
  });
  activeSockets.add(socket.id);
  socket.userId = data.userId;
  console.log("User registered:", data.userId);
  
  // Update any existing rooms this user might be part of
  for (const [roomId, chat] of activeChats.entries()) {
    if (chat.user1 === data.userId || chat.user2 === data.userId) {
      // Re-join this room
      socket.join(roomId);
      
      // Update user's active chat room if they were in this chat
      const userData = connectedUsers.get(data.userId);
      if (userData) {
        userData.activeChatRoom = roomId;
      }
      
      console.log(`User ${data.userId} rejoined room ${roomId}`);
    }
  }
}

export async function joinChat(socket, data, io) {
  // Leave all previous rooms except the socket's own room
  for (const room of socket.rooms) {
    if (room !== socket.id) {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
    }
  }
  
  const currentUser = connectedUsers.get(socket.userId);
  if (!currentUser) {
    socket.emit("error", { message: "User not registered." });
    return;
  }
  const targetUser = connectedUsers.get(data.targetUserId);
  if (!targetUser) {
    socket.emit("error", { message: "Target user not available." });
    return;
  }
  
  // Create a unique room id for one-to-one chat
  const roomId = [socket.userId, data.targetUserId].sort().join("_");
  
  // Join the room for both participants
  socket.join(roomId);
  const targetSocket = io.sockets.sockets.get(targetUser.socketId);
  if (targetSocket) {
    targetSocket.join(roomId);
  }
  
  // Update the active chat room for both users
  currentUser.activeChatRoom = roomId;
  targetUser.activeChatRoom = roomId;
  activeChats.set(roomId, { user1: socket.userId, user2: data.targetUserId });
  
  // Fetch chat history from MongoDB for the room
  try {
    const history = await ChatMessage.find({ roomId })
      .sort({ createdAt: 1 })
      .lean() // Convert Mongoose documents to plain JS objects
      .exec();
      
    // Transform history to match the expected format in the frontend
    const formattedHistory = history.map(msg => ({
      _id: msg._id, // Include ID for marking as read
      sender: msg.sender,
      message: msg.message,
      room: msg.roomId,
      status: msg.status,
      timestamp: msg.createdAt
    }));
    
    socket.emit("chatHistory", { roomId, history: formattedHistory });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    socket.emit("error", { message: "Failed to fetch chat history." });
  }
  
  // Notify both users that the chat has started
  io.to(roomId).emit("chatStarted", { roomId });
  console.log(`Chat started in room ${roomId} between ${socket.userId} and ${data.targetUserId}`);
}

export async function handleMessage(socket, data, io) {
  if (!data.roomId || !data.message) {
    socket.emit("error", { message: "Invalid message data" });
    return;
  }
  
  const roomId = data.roomId;
  const chat = activeChats.get(roomId);
  if (!chat) {
    console.log("No active chat found for room", roomId);
    socket.emit("error", { message: "No active chat found" });
    return;
  }
  
  // Verify that the sender is one of the participants.
  if (socket.userId !== chat.user1 && socket.userId !== chat.user2) {
    console.log("Sender is not a participant of the chat", socket.userId);
    socket.emit("error", { message: "You are not a participant in this chat" });
    return;
  }
  
  // Determine the recipient.
  const recipient = socket.userId === chat.user1 ? chat.user2 : chat.user1;
  
  try {
    // Create and save message as before
    const newMessage = new ChatMessage({
      roomId,
      sender: socket.userId,
      recipient,
      message: data.message,
      status: 'sent'
    });
    
    await newMessage.save();
    
    // Message object for socket emission
    const messageObj = { 
      _id: newMessage._id,
      sender: socket.userId, 
      message: data.message, 
      room: roomId, 
      status: 'sent',
      timestamp: newMessage.createdAt
    };
    
    const unreadCount = await ChatMessage.countDocuments({
      roomId: roomId,
      recipient: recipient,
      status: 'delivered'
    });

    // Emit to room as before
    io.to(roomId).emit("newMessage", messageObj);
    
    // Check if recipient is connected
    const recipientUser = connectedUsers.get(recipient);
    if (recipientUser && recipientUser.socketId) {
      // Update message status to 'delivered' in database
      await ChatMessage.findByIdAndUpdate(newMessage._id, { status: 'delivered' });

      // Emit unread message count to the recipient's socket
      io.to(recipientUser.socketId).emit("updateUnreadCount", {
        sender: socket.userId,
        count: unreadCount
      });

      // Emit a separate messageDelivered event with updated status
      const deliveredMessage = {
        messageId: newMessage._id,
        room: roomId,
        status: 'delivered'
      };
      io.to(roomId).emit("messageDelivered", deliveredMessage);
      console.log("Message marked as delivered:", newMessage._id);
    }
 
  } catch (error) {
    console.error("Error saving message to DB:", error);
    socket.emit("error", { message: "Failed to send message" });
  }
}

export async function markMessagesAsRead(socket, data, io) {
  if (!data.roomId) {
    socket.emit("error", { message: "Invalid room data" });
    return;
  }
  
  const roomId = data.roomId;
  const chat = activeChats.get(roomId);
  
  if (!chat) {
    socket.emit("error", { message: "No active chat found" });
    return;
  }
  
  // Verify that the reader is one of the participants
  if (socket.userId !== chat.user1 && socket.userId !== chat.user2) {
    socket.emit("error", { message: "You are not a participant in this chat" });
    return;
  }
  
  // Determine the sender (other user)
  const sender = socket.userId === chat.user1 ? chat.user2 : chat.user1;
  
  try {
    // Find all unread messages from the other user
    const updatedMessages = await ChatMessage.updateMany(
      { 
        roomId: roomId,
        sender: sender,
        status: { $ne: 'read' }
      },
      { 
        $set: { status: 'read' } 
      }
    );
    
    if (updatedMessages.modifiedCount > 0) {
      // Fetch the updated messages to emit to clients
      const messages = await ChatMessage.find({
        roomId: roomId,
        sender: sender,
        status: 'read'
      })
      .sort({ createdAt: -1 })
      .limit(updatedMessages.modifiedCount)
      .lean();
      
      // Emit message status updates to both participants
      io.to(roomId).emit("messagesRead", {
        roomId,
        reader: socket.userId,
        messageIds: messages.map(msg => msg._id)
      });
      
      console.log(`${updatedMessages.modifiedCount} messages marked as read in room ${roomId}`);
    }
  } catch (error) {
    console.error("Error updating message status:", error);
    socket.emit("error", { message: "Failed to update message status" });
  }
}

export function leaveChat(socket, data, io) {
  if (!data.roomId) return;
  
  socket.leave(data.roomId);
  console.log(`User ${socket.userId} left room ${data.roomId}`);
  
  // Update the user's active chat room
  const user = connectedUsers.get(socket.userId);
  if (user) {
    user.activeChatRoom = null;
  }
  // Check if the room is empty and remove it from activeRooms
  if (!io.sockets.adapter.rooms.has(data.roomId)) {
    activeRooms.delete(data.roomId);
  }
  
  // Optionally notify the other user that this user has left
  io.to(data.roomId).emit("userLeft", { 
    userId: socket.userId, 
    message: "User has left the chat" 
  });
}

export async function disconnect(socket, io) {
  const userId = socket.userId;
  if (userId && connectedUsers.has(userId)) {
    const user = connectedUsers.get(userId);
    if (user.activeChatRoom) {
      io.to(user.activeChatRoom).emit("userDisconnected", { 
        userId: userId,
        message: "User disconnected" 
      });
    }
    activeSockets.delete(socket.id);
    connectedUsers.delete(userId);
    // **Update the database to mark the user as inactive**
    try {
      await User.findByIdAndUpdate(userId, {
        activeStatus: { isActive: false, lastActive: new Date() }
      });
      console.log(`User ${userId} marked inactive in database on disconnect.`);
    } catch (err) {
      console.error("Error updating user inactive status on disconnect:", err);
    }
  }
  console.log("Client disconnected:", socket.id);
}

export function initSocket(io)  {
  io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);
      activeSockets.add(socket.id);

      socket.on("registerUser", (data) => {
        registerUser(socket, data);
      });

      socket.on("join_room", (room) => {
          socket.join(room);
          activeRooms.add(room);
          console.log(`User joined room: ${room}`);
      });
      
      // Listen for userInactive event and update the DB
      socket.on("userInactive", async (data) => {
        console.log(`Socket Event: User ${data.userId} is inactive via socket`);
        try {
          await User.findByIdAndUpdate(data.userId, {
            activeStatus: { isActive: false, lastActive: new Date() }
          });
          console.log(`User ${data.userId} marked inactive in database via socket event.`);
        } catch (err) {
          console.error("Error updating user inactive status via socket event:", err);
        }
      });

      socket.on("disconnect", () => {
          console.log(`User disconnected: ${socket.id}`);
          activeSockets.delete(socket.id);
          if (socket.userId) {
            connectedUsers.delete(socket.userId);
          }
      });
  });
};

export function getSocketStats() {
  return {
    activeSockets: activeSockets.size,
    activeRooms: activeRooms.size,
  };
}
