// friend.controller.js
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Notification from "../models/notification.model.js";
import { ChatMessage } from "../models/chatMessage.model.js";
import { 
  emitFriendRequest, 
  emitFriendRequestAccepted, 
  emitFriendRequestRejected, 
  emitFriendRemoved 
} from "./socket.controller.js";

// Get io from global scope for socket events
let io;
export const setIo = (socketIo) => {
  io = socketIo;
};

// Helper function to send notifications
const sendNotification = async (recipientId, senderId, type, message) => {
  try {
    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      message,
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
};

// Helper function to check if minimum message exchange requirement is met
const checkMinimumMessageExchange = async (user1Id, user2Id, minCount = 5) => {
  // Generate room ID (same format as used in chat system)
  const roomId = [user1Id, user2Id].sort().join("_");
  
  // Count messages sent by user1 to user2
  const user1MessageCount = await ChatMessage.countDocuments({
    roomId,
    sender: user1Id,
    recipient: user2Id
  });
  
  // Count messages sent by user2 to user1
  const user2MessageCount = await ChatMessage.countDocuments({
    roomId,
    sender: user2Id,
    recipient: user1Id
  });
  
  // Check if both users have sent at least the minimum number of messages
  const requirementMet = user1MessageCount >= minCount && user2MessageCount >= minCount;
  
  return {
    requirementMet,
    user1MessageCount,
    user2MessageCount,
    requiredCount: minCount
  };
};

// Send Friend Request
export const sendFriendRequest = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;
  if (!senderId || !receiverId) {
    throw new ApiError(400, "senderId and receiverId are required");
  }
  if (senderId === receiverId) {
    throw new ApiError(400, "Cannot send friend request to yourself");
  }

  // Ensure both users exist
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);
  if (!sender || !receiver) {
    throw new ApiError(404, "User not found");
  }

  // Check if a pending request already exists in receiver's incoming requests
  const existingIncoming = receiver.friendRequests.find(
    (req) => req.userId.toString() === senderId && req.status === "pending"
  );
  if (existingIncoming) {
    throw new ApiError(400, "Friend request already sent");
  }

  // Check if they are already friends
  const alreadyFriends = receiver.friendList.find(
    (friend) => friend.friendId.toString() === senderId
  );
  if (alreadyFriends) {
    throw new ApiError(400, "Users are already friends");
  }

  // Check if minimum message exchange requirement is met
  const messageCheck = await checkMinimumMessageExchange(senderId, receiverId);
  if (!messageCheck.requirementMet) {
    throw new ApiError(400, 
      `You must exchange at least ${messageCheck.requiredCount} messages with this user before sending a friend request. ` +
      `Current count: You sent ${messageCheck.user1MessageCount} messages, they sent ${messageCheck.user2MessageCount} messages.`
    );
  }

  // Update receiver's incoming friendRequests array
  receiver.friendRequests.push({
    userId: senderId,
    status: "pending",
    createdAt: new Date(),
  });
  await receiver.save();

  // Update sender's outgoing friendRequestsSent array
  sender.friendRequestsSent.push({
    receiverId: receiverId,
    status: "pending",
    createdAt: new Date(),
  });
  await sender.save();

  // Send notification to receiver
  await sendNotification(
    receiverId,
    senderId,
    "friendRequest",
    `${sender.fullName} sent you a friend request`
  );

  // Emit socket event for real-time updates
  if (io) {
    emitFriendRequest(io, senderId, receiverId, {
      status: "pending",
      createdAt: new Date()
    });
  }

  res.status(200).json({ message: "Friend request sent successfully" });
});

// Accept Friend Request
export const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;
  if (!senderId || !receiverId) {
    throw new ApiError(400, "senderId and receiverId are required");
  }

  // Find the receiver document
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new ApiError(404, "Receiver not found");
  }

  // Find the pending friend request in receiver's document
  const requestIndex = receiver.friendRequests.findIndex(
    (req) => req.userId.toString() === senderId && req.status === "pending"
  );
  if (requestIndex === -1) {
    throw new ApiError(400, "Friend request not found");
  }

  // Remove the friend request from receiver's array
  receiver.friendRequests.splice(requestIndex, 1);

  // Add sender to receiver's friendList (if not already there)
  if (!receiver.friendList.some((friend) => friend.friendId.toString() === senderId)) {
    receiver.friendList.push({ friendId: senderId, since: new Date() });
  }
  await receiver.save();

  // Update sender's outgoing friendRequestsSent array to reflect acceptance
  const sender = await User.findById(senderId);
  if (!sender) {
    throw new ApiError(404, "Sender not found");
  }
  const sentRequestIndex = sender.friendRequestsSent.findIndex(
    (req) => req.receiverId.toString() === receiverId && req.status === "pending"
  );
  if (sentRequestIndex !== -1) {
    // Mark it as accepted
    sender.friendRequestsSent[sentRequestIndex].status = "accepted";
  }
  // Add receiver to sender's friendList
  if (!sender.friendList.some((friend) => friend.friendId.toString() === receiverId)) {
    sender.friendList.push({ friendId: receiverId, since: new Date() });
  }
  await sender.save();

  // Send notification to sender about acceptance
  await sendNotification(
    senderId,
    receiverId,
    "friendRequestAccepted",
    `${receiver.fullName} accepted your friend request`
  );

  // Emit socket event for real-time updates
  if (io) {
    emitFriendRequestAccepted(io, senderId, receiverId);
  }

  res.status(200).json({ message: "Friend request accepted successfully" });
});

// Reject Friend Request
export const rejectFriendRequest = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;
  if (!senderId || !receiverId) {
    throw new ApiError(400, "senderId and receiverId are required");
  }

  // Remove incoming friend request from receiver's document
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new ApiError(404, "Receiver not found");
  }
  const requestIndex = receiver.friendRequests.findIndex(
    (req) => req.userId.toString() === senderId && req.status === "pending"
  );
  if (requestIndex === -1) {
    throw new ApiError(400, "Friend request not found");
  }
  receiver.friendRequests.splice(requestIndex, 1);
  await receiver.save();

  // Update sender's outgoing friendRequestsSent array to reflect rejection
  const sender = await User.findById(senderId);
  if (!sender) {
    throw new ApiError(404, "Sender not found");
  }
  const sentRequestIndex = sender.friendRequestsSent.findIndex(
    (req) => req.receiverId.toString() === receiverId && req.status === "pending"
  );
  if (sentRequestIndex !== -1) {
    sender.friendRequestsSent[sentRequestIndex].status = "rejected";
  }
  await sender.save();

  // Optionally notify the sender about the rejection
  await sendNotification(
    senderId,
    receiverId,
    "friendRequestRejected",
    `${receiver.fullName} rejected your friend request`
  );

  // Emit socket event for real-time updates
  if (io) {
    emitFriendRequestRejected(io, senderId, receiverId);
  }

  res.status(200).json({ message: "Friend request rejected successfully" });
});

// Remove Friend
export const removeFriend = asyncHandler(async (req, res) => {
  const { userId, friendId } = req.body;
  if (!userId || !friendId) {
    throw new ApiError(400, "userId and friendId are required");
  }
  if (userId === friendId) {
    throw new ApiError(400, "Cannot remove yourself");
  }

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  if (!user || !friend) {
    throw new ApiError(404, "User not found");
  }

  // Remove friend from user's friendList
  user.friendList = user.friendList.filter(
    (f) => f.friendId.toString() !== friendId
  );
  await user.save();

  // Remove user from friend's friendList
  friend.friendList = friend.friendList.filter(
    (f) => f.friendId.toString() !== userId
  );
  await friend.save();

  // Optionally update any friend request statuses in both documents if they exist
  user.friendRequestsSent = user.friendRequestsSent.filter(
    (req) => req.receiverId.toString() !== friendId
  );
  friend.friendRequests = friend.friendRequests.filter(
    (req) => req.userId.toString() !== userId
  );
  await user.save();
  await friend.save();

  // Send notification to the friend about removal
  await sendNotification(
    friendId,
    userId,
    "friendRemoved",
    `${user.fullName} removed you from their friend list`
  );

  // Emit socket event for real-time updates
  if (io) {
    emitFriendRemoved(io, userId, friendId);
  }

  res.status(200).json({ message: "Friend removed successfully" });
});

// List Friends
export const listFriends = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const user = await User.findById(userId).populate(
    "friendList.friendId",
    "fullName email profileImageURL uniqueTag"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json({ friends: user.friendList });
});

// List Incoming Friend Requests
export const listFriendRequests = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const user = await User.findById(userId).populate(
    "friendRequests.userId",
    "fullName email profileImageURL uniqueTag"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json({ friendRequests: user.friendRequests });
});

// List Outgoing Friend Requests (Sent Requests)
export const listSentFriendRequests = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const user = await User.findById(userId).populate(
    "friendRequestsSent.receiverId",
    "fullName email profileImageURL uniqueTag"
  );
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  res.status(200).json({ sentRequests: user.friendRequestsSent });
});
