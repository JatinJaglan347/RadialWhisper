import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Controller to fetch details of a logged-in user
const userDetails = asyncHandler(async (req, res) => {
    // Extract user ID from authenticated user (via token)
    const userId = req.user._id;

    // Find user by ID and exclude sensitive fields like password and refreshToken
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { user }, "User details fetched successfully")
    );
});

export { userDetails };
