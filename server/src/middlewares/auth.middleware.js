import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler( async (req , res ,next)=>{
    try {
        // Get token from cookies or Authorization header
        // For Authorization header, the format should be "Bearer <token>"
        const token = req.cookies?.accessToken || 
                      req.header("Authorization")?.replace("Bearer ", "") || 
                      req.body?.accessToken;
    
        if (!token){
            throw new ApiError(401 , "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if (!user){
            throw new ApiError(401 , "Invalid access token")
        }
        
        // Check if the token version in the JWT matches the user's current token version
        // This ensures that if a user logs in on a new device and forces logout on others,
        // the old tokens are invalidated even if they haven't expired yet
        if (decodedToken.tokenVersion !== undefined && 
            user.tokenVersion !== undefined && 
            decodedToken.tokenVersion !== user.tokenVersion) {
            throw new ApiError(401, "Session expired. Please login again.")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid Access Token")
    }
})
