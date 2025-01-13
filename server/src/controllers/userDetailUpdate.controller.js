import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const userFullnameUpdate = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { fullName } = req.body;
    // Input validation
    if (!fullName || typeof fullName !== "string" || fullName.trim() === "") {
        throw new ApiError(400, "Valid fullname is required");
    }

    const checkuser = await User.findById(userId);
    if (!checkuser) {
        throw new ApiError(404, "User not found by id ");
    }
    // Update the fullname directly and return the updated user
    const user = await User.findByIdAndUpdate(
        userId, 
        { fullName: fullName.trim() }, // Correct field name: "fullname"
        { new: true, runValidators: true } // Return updated user and run schema validators
    );

    // Check if the user exists
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Respond with success
    return res.status(200).json(
        new ApiResponse(200, { fullname: user.fullName }, "User fullname updated successfully")
    );
});

export { userFullnameUpdate };
