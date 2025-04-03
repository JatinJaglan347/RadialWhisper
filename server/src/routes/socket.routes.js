import { Server } from "socket.io";
import { 
  registerUser, 
  joinChat, 
  handleMessage, 
  disconnect, 
  markMessagesAsRead,
  emitFriendRequest,
  emitFriendRequestAccepted,
  emitFriendRequestRejected,
  emitFriendRemoved
} from "../controllers/socket.controller.js";
import { setIo } from "../controllers/friend.controller.js";

/**
 * Initialize Socket.io and bind the socket events to controller functions.
 *
 * @param {http.Server} server - Your HTTP server instance.
 */
export function initializeSocket(server) {
  const io = new Server(server, {
    pingInterval: 30000, // 30 seconds between pings
    pingTimeout: 5000,   // 5 seconds to receive a pong response
    cors: {
      origin: process.env.CORS_ORIGIN || "*", // Allow all origins for testing
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  
  // Share io instance with friend controller for emitting events
  setIo(io);

  // Debug: Log when the server starts listening for WebSocket connections
  console.log("✅ Socket.io initialized and waiting for connections...");

  io.on("connection", (socket) => {
    console.log(`🔗 New client connected: ${socket.id}`);

    // Log all incoming events from the client
    socket.onAny((event, ...args) => {
      console.log(`📥 Event received: ${event}`);
      console.log("📄 Data:", args);
    });

    // Client registers with its user ID.
    socket.on("registerUser", (data) => {
      console.log("👤 registerUser event triggered");
      registerUser(socket, data);
    });

    // Client initiates a chat when selecting a nearby user.
    socket.on("joinChat", (data) => {
      console.log("💬 joinChat event triggered");
      joinChat(socket, data, io);
    });

    // Client sends messages during an active chat.
    socket.on("message", (data) => {
      console.log("✉️ message event triggered");
      handleMessage(socket, data, io);
    });

    // Client wants to mark messages as read
    socket.on("markMessagesAsRead", (data) => {
      console.log("📖 markMessagesAsRead event triggered");
      markMessagesAsRead(socket, data, io);
    });

    // Add leaveAllRooms handler
    socket.on("leaveAllRooms", (callback) => {
      const rooms = Array.from(socket.rooms);
      rooms.forEach((room) => {
        if (room !== socket.id) { // Don't leave the socket's own ID room
          socket.leave(room);
          console.log(`Socket ${socket.id} left room ${room}`);
        }
      });
      if (typeof callback === "function") callback();
    });

    // Handle disconnect event.
    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnected: ${socket.id} | Reason: ${reason}`);
      disconnect(socket, io);
    });
    socket.on("leaveChat", ({ roomId }) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
      });
  });
}
