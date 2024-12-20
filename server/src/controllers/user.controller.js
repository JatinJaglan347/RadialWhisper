import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uniqueTagGen } from "../utils/uniqueTagGen.js";


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

export {registerUser , loginUser , logoutUser } 