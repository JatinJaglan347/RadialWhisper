import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { ChatMessage } from "../models/chatMessage.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execPromise = promisify(exec);

// User Management
const getUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID, email, or uniqueTag is required");
  }

  // Try to find the user by ID, email, or uniqueTag
  let user;
  
  // Check if userId is a valid MongoDB ObjectId
  const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
  
  if (isValidObjectId) {
    // First try to find by ID
    user = await User.findById(userId);
  }
  
  // If not found by ID or not a valid ObjectId, try email or uniqueTag
  if (!user) {
    user = await User.findOne({
      $or: [
        { email: userId },
        { uniqueTag: userId }
      ]
    });
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User details fetched successfully")
  );
});

const editUserData = asyncHandler(async (req, res) => {
  const { userId, fieldData } = req.body;

  if (!userId || !fieldData) {
    throw new ApiError(400, "User ID and field data are required");
  }

  // Allow editing of any user field without restrictions
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Process special case for banned status changes
  if (fieldData.banned && fieldData.banned.current && 
      typeof fieldData.banned.current.status === 'boolean' && 
      user.banned && user.banned.current && 
      fieldData.banned.current.status !== user.banned.current.status) {
    
    console.log("Ban status change detected:", fieldData.banned.current.status);
    
    // Ensure banned structure exists
    if (!user.banned) {
      user.banned = { current: {}, history: [] };
    }
    
    // Update current ban status
    user.banned.current.status = fieldData.banned.current.status;
    user.banned.current.reason = fieldData.banned.current.reason || 
      (fieldData.banned.current.status ? "Banned by admin" : "Unbanned by admin");
    user.banned.current.date = new Date();
    user.banned.current.actionBy = req.user?._id;
    
    // Add to history
    if (!Array.isArray(user.banned.history)) {
      user.banned.history = [];
    }
    
    user.banned.history.push({
      status: user.banned.current.status,
      reason: user.banned.current.reason,
      date: user.banned.current.date,
      actionBy: user.banned.current.actionBy
    });
    
    // Remove from fieldData to avoid double processing
    delete fieldData.banned;
  }

  // Process all fields
  Object.keys(fieldData).forEach((field) => {
    if (field === "password") {
      // We don't set password directly, as it needs to be hashed
      user.password = fieldData[field]; // Will be hashed by pre-save hook
    } else if (field.includes('.')) {
      // Handle nested fields (e.g., 'banned.current.status')
      const parts = field.split('.');
      let current = user;
      
      // Navigate to the nested object
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      
      // Set the value
      current[parts[parts.length - 1]] = fieldData[field];
    } else {
      // Handle regular fields
      user[field] = fieldData[field];
    }
  });

  await user.save();

  return res.status(200).json(
    new ApiResponse(200, { user }, "User data updated successfully")
  );
});

const forceResetPassword = asyncHandler(async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    throw new ApiError(400, "User ID and new password are required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Force password reset
  user.password = newPassword; // Pre-save hook will hash the password
  await user.save();

  // Increment token version to force logout from all devices
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, {}, "Password reset successfully")
  );
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  const { userId, verificationCode, verificationInput } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  
  if (!verificationCode || !verificationInput) {
    throw new ApiError(400, "Verification code and input are required");
  }
  
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  // Verify the input against the code or user identifiers
  const isValidCode = verificationInput === verificationCode;
  const isValidEmail = verificationInput === user.email;
  const isValidUniqueTag = verificationInput === user.uniqueTag;
  
  if (!isValidCode && !isValidEmail && !isValidUniqueTag) {
    throw new ApiError(403, "Verification failed. Please provide the correct verification code, user email, or unique tag.");
  }

  // Delete user account and all associated data
  const result = await User.deleteOne({ _id: userId });

  if (result.deletedCount === 0) {
    throw new ApiError(500, "Failed to delete user");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "User account deleted successfully")
  );
});

const getUserMessages = asyncHandler(async (req, res) => {
  const { userId, limit = 100, offset = 0 } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Get user messages (sent or received)
  const messages = await ChatMessage.find({
    $or: [{ sender: userId }, { recipient: userId }],
  })
    .sort({ createdAt: -1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .populate("sender", "fullName uniqueTag profileImageURL")
    .populate("recipient", "fullName uniqueTag profileImageURL");

  return res.status(200).json(
    new ApiResponse(
      200,
      { messages, count: messages.length },
      "User messages fetched successfully"
    )
  );
});

const getUserLocationHistory = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Return current and previous location
  const locationData = {
    currentLocation: user.currentLocation,
    previousLocation: user.previousLocation,
    locationUpdatedAt: user.locationUpdatedAt,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      locationData,
      "User location history fetched successfully"
    )
  );
});

// Database Operations
const executeRawDbQuery = asyncHandler(async (req, res) => {
  const { collection, operation, query, update, options } = req.body;

  if (!collection || !operation) {
    throw new ApiError(400, "Collection name and operation are required");
  }

  try {
    // Check if collection exists
    const collections = await mongoose.connection.db
      .listCollections({ name: collection })
      .toArray();
    
    if (collections.length === 0) {
      throw new ApiError(404, `Collection ${collection} not found`);
    }

    // Execute the operation on the specified collection
    let result;
    const collectionObj = mongoose.connection.db.collection(collection);

    switch (operation) {
      case "find":
        result = await collectionObj.find(query || {}).toArray();
        break;
      case "findOne":
        result = await collectionObj.findOne(query || {});
        break;
      case "updateOne":
        result = await collectionObj.updateOne(query || {}, update, options);
        break;
      case "updateMany":
        result = await collectionObj.updateMany(query || {}, update, options);
        break;
      case "deleteOne":
        result = await collectionObj.deleteOne(query || {});
        break;
      case "deleteMany":
        result = await collectionObj.deleteMany(query || {});
        break;
      case "insertOne":
        result = await collectionObj.insertOne(query);
        break;
      case "insertMany":
        result = await collectionObj.insertMany(query);
        break;
      default:
        throw new ApiError(400, `Unsupported operation: ${operation}`);
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { result },
        `Database operation ${operation} executed successfully`
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      `Database operation failed: ${error.message}`
    );
  }
});

const getCollectionsList = asyncHandler(async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    
    return res.status(200).json(
      new ApiResponse(
        200,
        { collections: collections.map(col => col.name) },
        "Collections list fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to fetch collections: ${error.message}`
    );
  }
});

const createDbBackup = asyncHandler(async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const backupDir = path.resolve(process.cwd(), "backups");
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupPath = path.join(backupDir, `backup-${timestamp}`);
    
    // Get database connection string from environment variables
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      throw new ApiError(500, "Database connection string not found");
    }
    
    // Create a simple JSON backup if mongodump isn't available
    try {
      // Extract database name from connection string
      const dbName = dbUri.split("/").pop().split("?")[0];
      
      // Check if mongodump is available
      await execPromise("which mongodump");
      
      // Execute mongodump command
      console.log(`Attempting to backup database to ${backupPath}`);
      const { stdout, stderr } = await execPromise(
        `mongodump --uri="${dbUri}" --out="${backupPath}"`
      );
      
      if (stderr && stderr.includes("error")) {
        throw new Error(`Mongodump error: ${stderr}`);
      }
      
      return res.status(200).json(
        new ApiResponse(
          200,
          { 
            backupPath,
            stdout,
            stderr,
            message: `Backup created at ${backupPath}/${dbName}`
          },
          "Database backup created successfully"
        )
      );
    } catch (cmdError) {
      // If mongodump fails, create a simple JSON backup
      console.log("Mongodump failed, creating JSON backup instead:", cmdError.message);
      
      // Get all collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      const backupData = {};
      
      // For each collection, get all documents
      for (const collection of collections) {
        const collectionName = collection.name;
        console.log(`Backing up collection: ${collectionName}`);
        const documents = await mongoose.connection.db.collection(collectionName).find({}).toArray();
        backupData[collectionName] = documents;
      }
      
      // Write to JSON file
      const jsonBackupPath = path.join(backupDir, `backup-${timestamp}.json`);
      fs.writeFileSync(jsonBackupPath, JSON.stringify(backupData, null, 2));
      
      return res.status(200).json(
        new ApiResponse(
          200,
          { 
            backupPath: jsonBackupPath,
            message: `JSON backup created at ${jsonBackupPath}`
          },
          "JSON database backup created successfully"
        )
      );
    }
  } catch (error) {
    console.error("Backup error:", error);
    throw new ApiError(
      500,
      `Failed to create database backup: ${error.message}`
    );
  }
});

// New function to list all backups
const listBackups = asyncHandler(async (req, res) => {
  try {
    const backupDir = path.resolve(process.cwd(), "backups");
    
    // Check if backups directory exists
    if (!fs.existsSync(backupDir)) {
      return res.status(200).json(
        new ApiResponse(
          200,
          { backups: [] },
          "No backups directory found"
        )
      );
    }
    
    // Get all files and directories in the backups directory
    const items = fs.readdirSync(backupDir);
    
    // Get details for each backup
    const backups = items.map(item => {
      const itemPath = path.join(backupDir, item);
      const stats = fs.statSync(itemPath);
      
      return {
        name: item,
        path: itemPath,
        size: stats.isDirectory() 
          ? getDirSize(itemPath) 
          : stats.size,
        created: stats.birthtime,
        isDirectory: stats.isDirectory(),
        type: path.extname(item) || (stats.isDirectory() ? 'folder' : 'unknown')
      };
    });
    
    // Sort by creation date (newest first)
    backups.sort((a, b) => b.created - a.created);
    
    return res.status(200).json(
      new ApiResponse(
        200,
        { backups },
        "Backups retrieved successfully"
      )
    );
  } catch (error) {
    console.error("Error listing backups:", error);
    throw new ApiError(
      500,
      `Failed to list backups: ${error.message}`
    );
  }
});

// Helper function to calculate directory size
function getDirSize(dirPath) {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

// New function to delete a backup
const deleteBackup = asyncHandler(async (req, res) => {
  const { backupPath } = req.body;
  
  if (!backupPath) {
    throw new ApiError(400, "Backup path is required");
  }
  
  try {
    const normalizedPath = path.normalize(backupPath);
    const backupDir = path.resolve(process.cwd(), "backups");
    
    // Security check: Make sure the path is within the backups directory
    if (!normalizedPath.startsWith(backupDir)) {
      throw new ApiError(403, "Cannot delete files outside of backups directory");
    }
    
    if (!fs.existsSync(normalizedPath)) {
      throw new ApiError(404, "Backup not found");
    }
    
    const stats = fs.statSync(normalizedPath);
    
    if (stats.isDirectory()) {
      // Delete directory recursively
      fs.rmSync(normalizedPath, { recursive: true, force: true });
    } else {
      // Delete file
      fs.unlinkSync(normalizedPath);
    }
    
    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        "Backup deleted successfully"
      )
    );
  } catch (error) {
    console.error("Error deleting backup:", error);
    throw new ApiError(
      500,
      `Failed to delete backup: ${error.message}`
    );
  }
});

// Security Operations
const getAllUserSessions = asyncHandler(async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  
  // Get all users with their active sessions
  const users = await User.find({
    "activeSessions.0": { $exists: true }  // Only users with at least one active session
  })
  .select("fullName uniqueTag email activeSessions tokenVersion")
  .skip(parseInt(offset))
  .limit(parseInt(limit));
  
  return res.status(200).json(
    new ApiResponse(
      200,
      { users },
      "User sessions fetched successfully"
    )
  );
});

const forceLogoutUser = asyncHandler(async (req, res) => {
  const { userId, sessionId } = req.body;
  
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  
  const user = await User.findById(userId);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  if (sessionId) {
    // Logout specific session
    user.activeSessions = user.activeSessions.filter(
      session => session._id.toString() !== sessionId
    );
  } else {
    // Logout all sessions by incrementing token version and clearing sessions
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    user.activeSessions = [];
    user.refreshToken = undefined;
  }
  
  await user.save();
  
  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      sessionId 
        ? "User session terminated successfully" 
        : "All user sessions terminated successfully"
    )
  );
});

const forceLogoutAllUsers = asyncHandler(async (req, res) => {
  // Update all users to increment token version and clear sessions
  const result = await User.updateMany(
    {},
    {
      $inc: { tokenVersion: 1 },
      $set: { activeSessions: [] },
      $unset: { refreshToken: "" }
    }
  );
  
  return res.status(200).json(
    new ApiResponse(
      200,
      { modifiedCount: result.modifiedCount },
      "All users logged out successfully"
    )
  );
});

// Get temporary users (users with fullName "Temporary User" or OTP verification pending)
const getTemporaryUsers = asyncHandler(async (req, res) => {
  const { 
    limit = 20, 
    offset = 0, 
    searchTerm, 
    sortBy = "createdAt", 
    sortOrder = "desc", 
    filterType = "temporary",
    dateRangeStart,
    dateRangeEnd 
  } = req.body;
  
  // Build query based on filter type
  let query = {};
  
  if (filterType === "unverified") {
    // Users with verification pending
    query = { "verification.verified": false };
  } else if (filterType === "temporary") {
    // Users with "Temporary User" in their name
    query = { fullName: "Temporary User" };
  } else if (filterType === "both") {
    // Both temporary and unverified users
    query = {
      $or: [
        { "verification.verified": false },
        { fullName: "Temporary User" }
      ]
    };
  }
  
  // Add search functionality if searchTerm is provided
  if (searchTerm) {
    query = {
      ...query,
      $or: [
        { email: { $regex: searchTerm, $options: "i" } },
        { fullName: { $regex: searchTerm, $options: "i" } },
        { uniqueTag: { $regex: searchTerm, $options: "i" } }
      ]
    };
  }
  
  // Add date range filtering if provided
  if (dateRangeStart || dateRangeEnd) {
    const dateQuery = {};
    
    if (dateRangeStart) {
      // Set to start of the day
      const startDate = new Date(dateRangeStart);
      startDate.setUTCHours(0, 0, 0, 0);
      dateQuery.$gte = startDate;
    }
    
    if (dateRangeEnd) {
      // Set to end of the day
      const endDate = new Date(dateRangeEnd);
      endDate.setUTCHours(23, 59, 59, 999);
      dateQuery.$lte = endDate;
    }
    
    query.createdAt = dateQuery;
  }

  // Get total count for pagination
  const totalCount = await User.countDocuments(query);
  
  // Build sort object
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
  
  // Get users with pagination and sorting
  const users = await User.find(query)
    .select("fullName email uniqueTag verification createdAt gender dateOfBirth")
    .sort(sortOptions)
    .skip(parseInt(offset))
    .limit(parseInt(limit));
  
  return res.status(200).json(
    new ApiResponse(
      200,
      { users, totalCount, currentPage: Math.floor(offset / limit) + 1, totalPages: Math.ceil(totalCount / limit) },
      "Temporary users fetched successfully"
    )
  );
});

// Get dashboard statistics
const getDashboardStats = asyncHandler(async (req, res) => {
  // Count total users
  const usersCount = await User.countDocuments();
  
  // Count temporary users (both unverified and with temporary name)
  const temporaryUsersCount = await User.countDocuments({
    $or: [
      { "verification.verified": false },
      { fullName: "Temporary User" }
    ]
  });
  
  // Count active sessions across all users
  const sessionCount = await User.aggregate([
    { $unwind: { path: "$activeSessions", preserveNullAndEmptyArrays: false } },
    { $count: "total" }
  ]).then(result => result[0]?.total || 0);
  
  // Count total messages
  const messagesCount = await ChatMessage.countDocuments();
  
  // Count collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  const collectionCount = collections.length;
  
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        usersCount,
        sessionCount,
        messagesCount,
        collectionCount,
        temporaryUsersCount
      },
      "Dashboard statistics fetched successfully"
    )
  );
});

export {
  // User Management
  getUserDetails,
  editUserData,
  forceResetPassword,
  deleteUserAccount,
  getUserMessages,
  getUserLocationHistory,
  getTemporaryUsers,
  
  // Dashboard
  getDashboardStats,
  
  // Database Operations
  executeRawDbQuery,
  getCollectionsList,
  createDbBackup,
  listBackups,
  deleteBackup,
  
  // Security Operations
  getAllUserSessions,
  forceLogoutUser,
  forceLogoutAllUsers
}; 