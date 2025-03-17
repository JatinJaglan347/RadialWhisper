import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const updateUserField = asyncHandler(async (req, res) => {
  const { userId, field, value } = req.body;

  // Validate request
  if (!userId || !field || value === undefined) {
    throw new ApiError(400, "User ID, field, and value are required");
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Dynamically update the specified field
  user[field] = value;
  await user.save();

  res.status(200).json(new ApiResponse(200, user, `${field} updated successfully`));
});

export { updateUserField };
