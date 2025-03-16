import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const updateUserField = asyncHandler(async (req, res) => {
    console.log("Received request body:", req.body); // Debugging
    console.log("Full request body:", JSON.stringify(req.body, null, 2));

    const { userId, field, value } = req.body;
  
    if (!userId || !field || value === undefined) {
      console.error("Error: Missing userId, field, or value"); // Debugging
      throw new ApiError(400, "User ID, field, and value are required");
    }
  
    const user = await User.findById(userId);
    if (!user) {
      console.error("Error: User not found"); // Debugging
      throw new ApiError(404, "User not found");
    }
  
    user[field] = value;
    await user.save();
  
    res.status(200).json(new ApiResponse(200, user, `${field} updated successfully`));
  });
  

export { updateUserField };
