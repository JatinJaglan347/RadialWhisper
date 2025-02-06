import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {UserInfoRules} from "../models/userInfoRules.model.js";

const getUserInfoRules = asyncHandler(async (req, res) => {
  
    // Fetch the user ID from the request
    // const userId = req.user._id;
    const userId = req.body.userId;

    // console.log("heloooooooo",userId);
    // Retrieve the user and exclude sensitive fields
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    };
    // Check if the user has the required role
    const isOP = user?.userRole === "admin" || user?.userRole === "king";
    if (!isOP) {
        throw new ApiError(401, "Unauthorized user role");
    }

    // Fetch the rules document
    const userInfoRules = await UserInfoRules.findOne();

    console.log(userInfoRules);
    // If no rules are found, return a 404 error
    if (!userInfoRules) {
        throw new ApiError(404, "User info rules not found");
    }

    // Respond with the rules in a structured format
    res.status(200).json(new ApiResponse(200, userInfoRules ,"User info rules fetched successfully"));
});

const updateUserInfoRules = asyncHandler(async (req, res) => {
  const updateData = req.body;

  const currentData = await UserInfoRules.findOne();

  const updateFields ={};

// Loop through the fields in the request body (updateData)
for (let field in updateData) {
    // If the field exists in the current data and its value is different
    if (JSON.stringify(currentData[field]) !== JSON.stringify(updateData[field])) {
      if (typeof updateData[field] === 'object' && updateData[field] !== null) {
        // For nested objects, merge them rather than overwriting
        updateFields[field] = { ...currentData[field], ...updateData[field] };
      } else {
        // For simple fields, just assign the new value
        updateFields[field] = updateData[field];
      }
    }
  }

    if (Object.keys(updateFields).length === 0) {
        return res.status(200).json(new ApiResponse(200, currentData, "No changes detected"));
    }

    const updatedData = await UserInfoRules.updateOne({}, { $set: updateFields });

    res.status(200).json(new ApiResponse(200, updatedData, "User info rules updated successfully"));

})


export { getUserInfoRules , updateUserInfoRules };
