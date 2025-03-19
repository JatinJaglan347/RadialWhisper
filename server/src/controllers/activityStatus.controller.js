// server/src/controllers/activityStatus.controller.js

import {User} from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from"../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";



const updateActivityStatus = asyncHandler(async (req, res) => {
    const { userId, isActive, lastActive } = req.body;
  
    // Validate inputs
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }
  
    if (typeof isActive !== "boolean") {
      throw new ApiError(400, "Invalid activity status");
    }
  
    // Update user's activity status
    const user = await User.findByIdAndUpdate(
      userId,
      {
        activeStatus: {
          isActive,
          lastActive: lastActive || Date.now()
        }
      },
      { new: true }
    ).select("-password -refreshToken");
  
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Log activity status
    if (isActive) {
      console.log(`User ${userId} is now active.`);
    } else {
      console.log(`User ${userId} is now inactive.`);
    }
  
    return res.status(200).json(
      new ApiResponse(200, { user }, "Activity status updated successfully")
    );
});

  

export { updateActivityStatus };
