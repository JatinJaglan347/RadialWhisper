import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {UserInfoRules} from "../models/userInfoRules.model.js";

const getUserInfoRules = asyncHandler(async (req, res) => {
    // Fetch the user ID from the request
    const userId = req.user._id;

    // Retrieve the user and exclude sensitive fields
    const user = await User.findById(userId).select("-password -refreshToken");

    // Check if the user has the required role
    const isOP = user?.userRole === "admin" || user?.userRole === "king";
    if (!isOP) {
        throw new ApiError(401, "Unauthorized user role");
    }

    // Fetch the rules document
    const userInfoRules = await UserInfoRules.findOne();

    // If no rules are found, return a 404 error
    if (!userInfoRules) {
        throw new ApiError(404, "User info rules not found");
    }

    // Respond with the rules in a structured format
    res.status(200).json(new ApiResponse(200, "User info rules fetched successfully", userInfoRules));
});

export { getUserInfoRules };
