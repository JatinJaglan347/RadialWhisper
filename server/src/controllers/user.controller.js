import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uniqueTagGen } from "../utils/uniqueTagGen.js";

const registerUser = asyncHandler(async (req ,res)=>{

    const {fullName , email , password , gender , dateOfBirth ,bio , currentLocation  }= req.body


    if (
        [fullName , email , password , gender ].some((field)=>field?.trim() === "")
    ){
       throw new ApiError(400 , "All fields are required") 
    }
   const existedUser=await User.findOne({email})

   if (existedUser){
    throw new ApiError(409 , "Email already taken ")
   }

   const uniqueTag = await uniqueTagGen();
 
   const user = await User.create({
    fullName ,
    email ,
    password ,
    gender ,
    dateOfBirth ,
    bio ,
    currentLocation ,
    uniqueTag,
   })
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if (!createdUser){
    throw new ApiError(500 , "Something went wrong while registering the user")
   }

return res.status(201).json(
    new ApiResponse (201 ,  createdUser , "User registered successfully")
)
   


})

export {registerUser}