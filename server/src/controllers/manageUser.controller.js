import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { initSocket, getSocketStats } from "./socket.controller.js";
import { ChatMessage } from "../models/chatMessage.model.js";
import mongoose from 'mongoose';
import ActiveUserSnapshot from "../models/activeUserSnapshot.model.js";


function isEmailOrUniqueTag(value) {
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/; // Simple email regex
    return emailPattern.test(value) ? "email" : "uniqueTag";
}

const banUnbanUser = asyncHandler(async (req , res )=>{
    const { input , banStatus , banReason , banActionBy} = req.body;
    
    

    if (!input) {
        throw new ApiError(400 , "Email or UniqueTag is required");
    }
    const result = isEmailOrUniqueTag(input);

    if(result==="email"){
        const email = input;
       

    }else if(result === "uniqueTag"){
        const uniqueTag = input;
    }

    const user = await User.findOne({
        $or: [{ email: input }, { uniqueTag: input }]
    }).select("-password -refreshToken");

    
 const userId = user._id;
 console.log(userId) 

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // const updateBan = await User.findByIdAndUpdate(
    //     userId,
    //     { banned.current.status : banStatus }
    // )

    const updateBan = await User.findOneAndUpdate(
        { $or: [{ email: input }, { uniqueTag: input }] },
        { 
            $set: { "banned.current.status": banStatus, "banned.current.reason": banReason, "banned.current.actionBy": banActionBy, "banned.current.date": new Date() },
            $push: { "banned.history": { status: banStatus, reason: banReason, actionBy: banActionBy, date: new Date() } }
        },
        { new: true } // Returns the updated document
    );

    if (!updateBan) {
        throw new ApiError(400, "Failed to update ban status");
    }

    res.json(new ApiResponse(200, "User ban status updated", updateBan));

    // res.json(new ApiResponse(200, "User found", user));

})
// Admin stats endpoint wrapped in asyncHandler to catch errors
const getAdminStats = asyncHandler(async (req, res) => {
    // Accept filter from query parameter; defaults to 'daily'
    const range = req.query.range || "daily"; // 'today' or 'daily'
    let startDate, groupFormat, numberOfBuckets;
  
    if (range === "today") {
        startDate = new Date();
        startDate.setHours(startDate.getHours() - 24);
        // Adjust groupFormat to use a timezone, e.g., America/New_York (or your desired timezone)
        groupFormat = { 
          $dateToString: { 
            format: "%H:00", 
            date: "$createdAt", 
            timezone: "Asia/Kolkata" 
          } 
        };
        numberOfBuckets = 24;
      } else {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        numberOfBuckets = 30;
      }
      
  
    // Basic user stats
    const totalUsers = await User.countDocuments();
    const totalModerators = await User.countDocuments({ userRole: "moderator" });
    const totalAdmins = await User.countDocuments({ userRole: "admin" });
    const totalBannedUsers = await User.countDocuments({ "banned.history.status": true });
  
    // Signup trend aggregation
    const signups = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: groupFormat,
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const signupTrend = Array.from({ length: numberOfBuckets }, (_, i) => {
        const date = new Date();
        if (range === "today") {
          // Subtract i hours from the current time
          date.setHours(date.getHours() - i);
          // Format to IST hour using toLocaleString with proper options
          const istHour = date.toLocaleString("en-IN", { 
            timeZone: "Asia/Kolkata", 
            hour: "2-digit", 
            hour12: false 
          });
          const formatted = `${istHour}:00`;
          return {
            date: formatted,
            count: signups.find((s) => s._id === formatted)?.count || 0,
          };
        } else {
          date.setDate(date.getDate() - i);
          const formatted = date.toISOString().split("T")[0];
          return {
            date: formatted,
            count: signups.find((s) => s._id === formatted)?.count || 0,
          };
        }
      }).reverse();
      
  
    // Socket stats (current snapshot)
    const { activeSockets } = getSocketStats();
  
    // Database Read/Write Operations (current snapshot from serverStatus)
    const serverStatus = await mongoose.connection.db.command({ serverStatus: 1 });
    const opcounters = serverStatus.opcounters || {};
    const totalReadOps = (opcounters.query || 0) + (opcounters.getmore || 0);
    const totalWriteOps = (opcounters.insert || 0) + (opcounters.update || 0) + (opcounters.delete || 0);
    // Message Volume Trend aggregation
    const messagesAgg = await ChatMessage.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: groupFormat,
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const messageTrend = Array.from({ length: numberOfBuckets }, (_, i) => {
        const date = new Date();
        if (range === "today") {
          date.setHours(date.getHours() - i);
          const istHour = date.toLocaleString("en-IN", { 
            timeZone: "Asia/Kolkata", 
            hour: "2-digit", 
            hour12: false 
          });
          const formatted = `${istHour}:00`;
          return {
            date: formatted,
            count: messagesAgg.find((m) => m._id === formatted)?.count || 0,
          };
        } else {
          date.setDate(date.getDate() - i);
          const formatted = date.toISOString().split("T")[0];
          return {
            date: formatted,
            count: messagesAgg.find((m) => m._id === formatted)?.count || 0,
          };
        }
      }).reverse();
      
      let activeUserTrend = [];
      if (range === 'today') {
        // Aggregate snapshots by hour for the last 24 hours
        const snapshots = await ActiveUserSnapshot.aggregate([
          { $match: { timestamp: { $gte: startDate } } },
          { 
            $group: { 
              _id: { $dateToString: { format: "%H:00", date: "$timestamp", timezone: "Asia/Kolkata" } },
              avgActive: { $avg: "$activeUserCount" }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        activeUserTrend = Array.from({ length: numberOfBuckets }, (_, i) => {
          const date = new Date();
          date.setHours(date.getHours() - i);
          const istHour = date.toLocaleString("en-IN", { 
            timeZone: "Asia/Kolkata", 
            hour: "2-digit", 
            hour12: false 
          });
          const formatted = `${istHour}:00`;
          return {
            date: formatted,
            count: snapshots.find(s => s._id === formatted)?.avgActive || 0
          };
        }).reverse();
      } else {
        // Aggregate snapshots by day for the last 30 days
        const snapshots = await ActiveUserSnapshot.aggregate([
          { $match: { timestamp: { $gte: startDate } } },
          { 
            $group: { 
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp", timezone: "Asia/Kolkata" } },
              avgActive: { $avg: "$activeUserCount" }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        activeUserTrend = Array.from({ length: numberOfBuckets }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const formatted = date.toISOString().split("T")[0];
          return {
            date: formatted,
            count: snapshots.find(s => s._id === formatted)?.avgActive || 0
          };
        }).reverse();
      }
      
      
    res.json({
      totalUsers,
      totalModerators,
      totalAdmins,
      totalBannedUsers,
      activeSockets,
      signupTrend,
      messageTrend,
      activeUserTrend,
      opcounters ,
      totalReadOps,
      totalWriteOps,
      
    });
  });

export {banUnbanUser,getAdminStats};