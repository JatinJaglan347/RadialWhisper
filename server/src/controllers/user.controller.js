import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uniqueTagGen } from "../utils/uniqueTagGen.js";
import jwt from "jsonwebtoken";

const generateAccesAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId);

       const accessToken =  user.generateAccesToken()
       const refreshToken=  user.generateRefreshToken()
       user.refreshToken = refreshToken
       await user.save({validateBeforeSave:false})

       return {accessToken,refreshToken}

    }catch(error){
        throw new ApiError(500, "Something went wrong while generating refresh and acces token");
    }
    
}

// const registerUser = asyncHandler(async (req ,res)=>{

//     const {fullName , email , password , gender , dateOfBirth ,bio , currentLocation  }= req.body


//     if (
//         [fullName , email , password , gender ].some((field)=>field?.trim() === "")
//     ){
//        throw new ApiError(400 , "All fields are required") 
//     }
//    const existedUser=await User.findOne({email})

//    if (existedUser){
//     throw new ApiError(409 , "Email already taken ")
//    }

//    const uniqueTag = await uniqueTagGen();
 
//    const user = await User.create({
//     fullName ,
//     email ,
//     password ,
//     gender ,
//     dateOfBirth ,
//     bio ,
//     currentLocation ,
//     uniqueTag,
//    })
//    const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//    )

//    if (!createdUser){
//     throw new ApiError(500 , "Something went wrong while registering the user")
//    }
//    const {accessToken, refreshToken}= await generateAccesAndRefreshToken(user._id)

   
//    const loggedInUser = await User.findOne(user._id).
//    select("-password -refreshToken")

//    const options= {
//     httpOnly : true ,
//     secure: true
//    }

// return res.status(201)
//     .cookie("accessToken" , accessToken , options)
//    .cookie("refreshToken" , refreshToken , options)
//    .json(
//     new ApiResponse(
//         201,
//         {
//             user: loggedInUser ,accessToken, refreshToken
//         },
//         "User created successfully",
//     )

//     // new ApiResponse (201 ,  createdUser , "User registered successfully")
// )
   


// })

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, gender, dateOfBirth, bio, currentLocation } = req.body;

    // Validate required fields
    if ([fullName, email, password, gender].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if email already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "Email already taken");
    }

    // Validate currentLocation structure
    if (!currentLocation || !currentLocation.latitude || !currentLocation.longitude) {
        throw new ApiError(400, "Valid currentLocation with latitude and longitude is required");
    }

    // Convert latitude and longitude to GeoJSON format
    const geoCurrentLocation = {
        type: "Point",
        coordinates: [currentLocation.longitude, currentLocation.latitude], // GeoJSON expects [longitude, latitude]
    };

    // Generate a unique tag
    const uniqueTag = await uniqueTagGen();

    // Create the user
    const user = await User.create({
        fullName,
        email,
        password,
        gender,
        dateOfBirth,
        bio,
        currentLocation: geoCurrentLocation, // Assign GeoJSON location
        uniqueTag,
    });

    // Fetch created user without sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccesAndRefreshToken(user._id);

    // Fetch logged-in user without sensitive fields
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Set cookie options
    const options = {
        httpOnly: true,
        secure: true,
    };

    // Respond with user data and tokens
    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                201,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User created successfully"
            )
        );
});


const loginUser = asyncHandler (async (req ,res)=>{
    const {email , password} = req.body
    if (!email || !password){
        throw new ApiError(400 , "Both Email and password are required")
    }
    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(401 , "User does't exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)
   if (!isPasswordValid){
    throw new ApiError(401 , "Invalid user credentials")
    }

   const {accessToken, refreshToken}= await generateAccesAndRefreshToken(user._id)

   const loggedInUser = await User.findOne(user._id).
   select("-password -refreshToken")


   const options= {
    httpOnly : true ,
    secure: true
   }

   return res.status(200)
   .cookie("accessToken" , accessToken , options)
   .cookie("refreshToken" , refreshToken , options)
   .json(
    new ApiResponse(
        200 ,
        {
            user: loggedInUser ,accessToken, refreshToken
        },
        "User logged In Successfully"
    )
    
   )
   


})

const logoutUser = asyncHandler(async(req,res)=>{
   await  User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        }
        },
        {
            new :true
        }
    )

    const options= {
        httpOnly : true ,
        secure: true
       }

    return res 
    .status(200) 
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" ,options)
    .json(new ApiResponse(200 , {} , "User logged out Successfully"))
})

const refreshAccessToken = asyncHandler(async(req , res)=>{
   const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken
   if (!incomingRefreshToken){
    throw new ApiError(401 , "unauthorized request")
   }
   try {
    const decodedToken = jwt.verify(
         incomingRefreshToken, 
         process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedToken?._id)
 
    if (!user){
     throw new ApiError(401 , "Invalid refresh token")
    }
    if (incomingRefreshToken !== user?.refreshToken){
     throw new ApiError(401 , "Refresh token is expired or used")
    }
 
    const options = {
     httpOnly :true, 
     secure : true
    }
   const {accessToken , newrefreshToken} =await generateAccesAndRefreshToken(user._id)
   return res 
   .status(200)
   .cookie("accessToken",accessToken, options)
   .cookie("refreshToken",newrefreshToken , options)
   .json(
     new ApiResponse(
         200 ,
          {accessToken , refreshToken: newrefreshToken} , 
          "Access token refreshed"
         )
   )
   } catch (error) {
    throw new ApiError(401 ,error?.message ||"Invalid refresh token")
   }
})

const checkAuth = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User is not authenticated");
    }

    return res.status(200).json(
        new ApiResponse(200, { user: req.user }, "User is authenticated")
    );
});

export {registerUser , loginUser , logoutUser , refreshAccessToken ,checkAuth } 
