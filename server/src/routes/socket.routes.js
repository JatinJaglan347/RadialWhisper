import { Server } from "socket.io";
import { registerUser, joinChat, handleMessage, disconnect, markMessagesAsRead } from "../controllers/socket.controller.js";

/**
 * Initialize Socket.io and bind the socket events to controller functions.
 *
 * @param {http.Server} server - Your HTTP server instance.
 */
export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*", // Allow all origins for testing
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

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
