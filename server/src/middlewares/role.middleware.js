import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyAdminRole = asyncHandler(async (req, res, next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    

        if (!token) {
            throw new ApiError(401, "Unauthorized  request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refrenceToken");

        const isAdmin = user?.userRole === "admin" || user?.userRole === "king";

        if (!isAdmin) {
            throw new ApiError(401, "Unauthorized user role");
        }
        req.user = user;
        next();

}catch (error) {
    throw new ApiError(401 , error?.message || "Invalid Access Token")
}
})



export const verifyModeratorRole = asyncHandler(async (req, res, next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    

        if (!token) {
            throw new ApiError(401, "Unauthorized  request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refrenceToken");

        const isAdmin = user?.userRole === "moderator" || user?.userRole === "admin" || user?.userRole === "king"; 

        if (!isAdmin) {
            throw new ApiError(401, "Unauthorized user role");
        }
        req.user = user;
        next();

}catch (error) {
    throw new ApiError(401 , error?.message || "Invalid Access Token")
}
})





export const verifyKingRole = asyncHandler(async (req, res, next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    

        if (!token) {
            throw new ApiError(401, "Unauthorized  request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refrenceToken");

        const isAdmin = user?.userRole === "king";

        if (!isAdmin) {
            throw new ApiError(401, "Unauthorized user role");
        }
        req.user = user;
        next();

}catch (error) {
    throw new ApiError(401 , error?.message || "Invalid Access Token")
}
})

