import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


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

export {banUnbanUser};