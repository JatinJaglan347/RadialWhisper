import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uniqueTagGen } from "../utils/uniqueTagGen.js";
import { UserInfoRules } from "../models/userInfoRules.model.js";
import jwt from "jsonwebtoken";

const generateAccesAndRefreshToken = async(userId, deviceInfo = null, ip = null, forceLogoutOthers = false)=>{
    console.log("\n==== GENERATING TOKENS ====");
    console.log("Params:", {
        userId,
        hasDeviceInfo: !!deviceInfo,
        hasIp: !!ip,
        forceLogoutOthers,
        forceType: typeof forceLogoutOthers
    });
    
    try{
        const user = await User.findById(userId);
        if (!user) {
            console.error("ERROR: User not found during token generation");
            throw new ApiError(404, "User not found");
        }

        console.log("User before session update:", {
            id: user._id.toString(),
            hasRefreshToken: !!user.refreshToken,
            sessionsCount: user.activeSessions?.length || 0,
            tokenVersion: user.tokenVersion || 0
        });

        // Handle force logout from other devices by incrementing tokenVersion
        if (forceLogoutOthers) {
            console.log("FORCING LOGOUT: Incrementing tokenVersion to invalidate existing tokens");
            user.tokenVersion = (user.tokenVersion || 0) + 1;
            console.log("New tokenVersion:", user.tokenVersion);
        }

        const accessToken = user.generateAccesToken();
        const refreshToken = user.generateRefreshToken();
        
        // Create session info
        const sessionInfo = {
            refreshToken,
            deviceInfo: deviceInfo || "Unknown device",
            ip: ip || "Unknown IP",
            lastActive: new Date(),
            issuedAt: new Date()
        };
        
        console.log("New session info:", {
            refreshTokenLength: refreshToken?.length || 0,
            deviceSnippet: deviceInfo ? deviceInfo.substring(0, 20) + "..." : "none"
        });

        // Initialize activeSessions if it doesn't exist
        if (!Array.isArray(user.activeSessions)) {
            console.log("Initializing activeSessions array (was not an array)");
            user.activeSessions = [];
        }

        // Handle sessions
        if (forceLogoutOthers) {
            console.log("FORCING LOGOUT: Clearing all existing sessions and adding new session");
            // Clear all existing sessions
            user.activeSessions = [sessionInfo];
        } else {
            console.log("NORMAL LOGIN: Adding session to existing sessions");
            // Add this session to active sessions
            user.activeSessions.push(sessionInfo);
        }

        // Keep the refreshToken field updated for backward compatibility
        user.refreshToken = refreshToken;
        
        console.log("User after session update:", {
            sessionsCount: user.activeSessions.length,
            hasRefreshToken: !!user.refreshToken,
            tokenVersion: user.tokenVersion
        });
        
        await user.save({validateBeforeSave:false});
        console.log("User saved successfully with updated sessions and tokenVersion");

        return {accessToken, refreshToken};

    }catch(error){
        console.error("ERROR in generateAccesAndRefreshToken:", error);
        console.error("Stack trace:", error.stack);
        throw new ApiError(500, "Something went wrong while generating tokens: " + (error.message || "Unknown error"));
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, gender, dateOfBirth, bio, currentLocation, otp } = req.body;
    
    // Get system settings to check if OTP is required
    const userInfoRules = await UserInfoRules.findOne({});
    const isOtpRequired = userInfoRules?.isSignupOtpRequired ?? true; // Default to true if not found
    
    console.log("Signup request received with OTP required:", isOtpRequired);
    
    if (isOtpRequired) {
        // OTP is required - validate OTP field
        if ([fullName, email, password, gender, otp].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields including OTP are required");
        }
        
        // Verify OTP first
        const existingUser = await User.findOne({ email });
        
        if (!existingUser) {
            throw new ApiError(404, "User not found. Please request an OTP first.");
        }
        
        // Check OTP verification
        if (!existingUser.otp.verified) {
            // Check if OTP is correct
            if (existingUser.otp.code !== otp) {
                throw new ApiError(401, "Invalid OTP");
            }
            
            // Check if OTP has expired
            if (existingUser.otp.expiresAt < new Date()) {
                throw new ApiError(401, "OTP has expired");
            }
            
            // Mark OTP as verified and set email as verified
            existingUser.otp.verified = true;
            existingUser.isEmailVerified = true; // Set email as verified when OTP is verified
        }
    } else {
        // OTP is not required - validate all fields except OTP
        if ([fullName, email, password, gender].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All required fields must be provided");
        }
        
        // Check if user already exists with this email
        const existingUser = await User.findOne({ email });
        
        if (existingUser && (!existingUser.otp || existingUser.otp.verified)) {
            throw new ApiError(409, "Email is already registered");
        }
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
    
    let existingUser, createdUser;
    
    if (isOtpRequired) {
        // OTP flow - update existing user
        existingUser = await User.findOne({ email });
        
        // Update user with registration details
        existingUser.fullName = fullName;
        existingUser.password = password; // This will be hashed by the pre-save hook
        existingUser.gender = gender;
        existingUser.dateOfBirth = dateOfBirth;
        existingUser.bio = bio || existingUser.bio;
        existingUser.currentLocation = geoCurrentLocation;
        existingUser.uniqueTag = uniqueTag;
        
        await existingUser.save();

        // Fetch created user without sensitive fields
        createdUser = await User.findById(existingUser._id).select("-password -refreshToken -activeSessions -otp");
    } else {
        // Direct signup flow - create new user or update existing temporary user
        existingUser = await User.findOne({ email });
        
        if (existingUser) {
            // Update existing temporary user
            existingUser.fullName = fullName;
            existingUser.password = password;
            existingUser.gender = gender;
            existingUser.dateOfBirth = dateOfBirth;
            existingUser.bio = bio || existingUser.bio;
            existingUser.currentLocation = geoCurrentLocation;
            existingUser.uniqueTag = uniqueTag;
            existingUser.otp = { verified: true }; // Mark as verified
            existingUser.isEmailVerified = false; // Email not verified through OTP
            
            await existingUser.save();
            createdUser = await User.findById(existingUser._id).select("-password -refreshToken -activeSessions -otp");
        } else {
            // Create brand new user without OTP verification
            const newUser = await User.create({
                email,
                fullName,
                password,
                gender,
                dateOfBirth,
                bio: bio || "",
                currentLocation: geoCurrentLocation,
                uniqueTag,
                otp: { verified: true }, // Mark as verified by default
                isEmailVerified: false // Email not verified through OTP
            });
            
            existingUser = newUser;
            createdUser = await User.findById(newUser._id).select("-password -refreshToken -activeSessions -otp");
        }
    }

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Get device info for session tracking
    const deviceInfo = req.headers["user-agent"] || "Unknown device";
    const ip = req.ip || req.connection.remoteAddress || "Unknown IP";

    // Generate access and refresh tokens with device info
    const { accessToken, refreshToken } = await generateAccesAndRefreshToken(
        existingUser._id, 
        deviceInfo, 
        ip,
        false // No need to force logout on registration
    );

    // Set cookie options
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
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
                    user: createdUser,
                    accessToken,
                    refreshToken,
                },
                "User created successfully"
            )
        );
});

const loginUser = asyncHandler(async (req, res) => {
    console.log("\n==== LOGIN REQUEST RECEIVED ====");
    console.log("REQUEST BODY:", req.body);
    console.log("forceLogoutOthers value:", req.body.forceLogoutOthers);
    console.log("forceLogoutOthers type:", typeof req.body.forceLogoutOthers);
    
    const { email, password, forceLogoutOthers } = req.body;
    
    console.log("Extracted values:", {
        hasEmail: !!email,
        hasPassword: !!password,
        forceLogoutOthers
    });
    
    if (!email || !password) {
        console.log("ERROR: Missing email or password");
        throw new ApiError(400, "Both Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        console.log("ERROR: User not found");
        throw new ApiError(401, "User does't exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        console.log("ERROR: Invalid password");
        throw new ApiError(401, "Invalid user credentials");
    }

    // Get device info and IP for session tracking
    const deviceInfo = req.headers["user-agent"] || "Unknown device";
    const ip = req.ip || req.connection.remoteAddress || "Unknown IP";
    
    // Debug the user's current sessions
    console.log("USER SESSIONS:", {
        activeSessions: user.activeSessions || [],
        activeSessCount: user.activeSessions?.length || 0,
        hasRefreshToken: !!user.refreshToken
    });
    
    // Check if user has other active sessions
    const hasOtherActiveSessions = user.activeSessions && user.activeSessions.length > 0;
    
    // Parse the forceLogoutOthers flag
    let shouldForceLogout = false;
    if (
        forceLogoutOthers === true || 
        forceLogoutOthers === "true" || 
        forceLogoutOthers === 1 ||
        forceLogoutOthers === "1"
    ) {
        shouldForceLogout = true;
    }
    
    console.log("LOGIN DECISION:", {
        hasOtherActiveSessions,
        shouldForceLogout,
        deviceInfo: deviceInfo.substring(0, 30) + "...", // Truncate long UA string
        ip
    });

    try {
        // Generate tokens, passing session info
        console.log("Generating tokens with forceLogout:", shouldForceLogout);
        const { accessToken, refreshToken } = await generateAccesAndRefreshToken(
            user._id, 
            deviceInfo, 
            ip, 
            shouldForceLogout
        );
        console.log("Tokens generated successfully");

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -activeSessions");

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        // If this is a first-phase login and there are other sessions
        if (!shouldForceLogout && hasOtherActiveSessions) {
            console.log("Returning other-sessions-exist response");
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser,
                        hasOtherSessions: true,
                        message: "You are already logged in on another device. Do you want to continue and log out from other devices?"
                    },
                    "Active session detected on another device"
                )
            );
        }

        console.log("Returning successful login response");
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser,
                        accessToken, 
                        refreshToken,
                        hasOtherSessions: false
                    },
                    shouldForceLogout 
                        ? "Logged in successfully and logged out from other devices" 
                        : "User logged In Successfully"
                )
            );
    } catch (error) {
        console.error("ERROR during login process:", error);
        throw new ApiError(500, "Login process failed: " + (error.message || "Unknown error"));
    }
});

const logoutUser = asyncHandler(async(req,res)=>{
    // Get the refresh token used for this session
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    
    if (refreshToken) {
        // Find the user and remove this specific session
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: { activeSessions: { refreshToken } },
                // Also clear the refreshToken if it matches the one being logged out
                ...(req.user.refreshToken === refreshToken ? { refreshToken: undefined } : {})
            },
            { new: true }
        )
    } else {
        // If no token is provided, just clear the main refreshToken
        await User.findByIdAndUpdate(
            req.user._id,
            { $set: { refreshToken: undefined } },
            { new: true }
        )
    }

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res 
    .status(200) 
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out Successfully"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
   const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
   
   if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request: No refresh token provided")
   }
   
   try {
      const decodedToken = jwt.verify(
         incomingRefreshToken, 
         process.env.REFRESH_TOKEN_SECRET
      )
      
      const user = await User.findById(decodedToken?._id)
      
      if (!user) {
         throw new ApiError(401, "Invalid refresh token: User not found")
      }
      
      // Check token version to prevent using tokens from invalidated sessions
      if (decodedToken.tokenVersion !== undefined && 
          user.tokenVersion !== undefined && 
          decodedToken.tokenVersion !== user.tokenVersion) {
          throw new ApiError(401, "Session expired. Please login again.")
      }
      
      // Check if this refresh token exists in the user's active sessions
      const sessionExists = user.activeSessions.find(
         session => session.refreshToken === incomingRefreshToken
      )
      
      // Also check the legacy field
      const legacyTokenMatches = user.refreshToken === incomingRefreshToken
      
      if (!sessionExists && !legacyTokenMatches) {
         throw new ApiError(401, "Refresh token is expired or invalid")
      }
      
      // Update device info if available
      const deviceInfo = req.headers["user-agent"] || "Unknown device"
      const ip = req.ip || req.connection.remoteAddress || "Unknown IP"
      
      // Generate new tokens
      const {accessToken, refreshToken: newrefreshToken} = await generateAccesAndRefreshToken(
         user._id,
         deviceInfo,
         ip,
         false // Don't force logout other devices
      )
      
      // If using the legacy token, we need to remove it
      if (legacyTokenMatches) {
         user.refreshToken = newrefreshToken
         await user.save({ validateBeforeSave: false })
      }
      
      // Remove the old session
      if (sessionExists) {
         await User.updateOne(
            { _id: user._id },
            { $pull: { activeSessions: { refreshToken: incomingRefreshToken } } }
         )
      }
      
      const options = {
         httpOnly: true, 
         secure: true,
         sameSite: "None"
      }
      
      return res 
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
            200,
            { accessToken, refreshToken: newrefreshToken }, 
            "Access token refreshed"
        )
      )
   } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token")
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

const startFriendChat = asyncHandler(async (req, res) => {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
        throw new ApiError(400, "Both userId and friendId are required");
    }

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Get friend from database
    const friend = await User.findById(friendId);
    if (!friend) {
        throw new ApiError(404, "Friend not found");
    }

    // Check if they are actually friends
    const isFriend = user.friendList.some(f => f.friendId.toString() === friendId);
    if (!isFriend) {
        throw new ApiError(403, "You can only start chats with your friends");
    }

    // Create a unique room ID for one-to-one chat (same logic as in socket.controller.js)
    const roomId = [userId, friendId].sort().join("_");

    // Get chat history
    const history = await ChatMessage.find({ roomId })
        .sort({ createdAt: 1 })
        .lean()
        .exec();

    const formattedHistory = history.map(msg => ({
        _id: msg._id,
        sender: msg.sender,
        message: msg.message,
        room: msg.roomId,
        status: msg.status,
        timestamp: msg.createdAt
    }));

    return res.status(200).json(
        new ApiResponse(
            200, 
            { 
                roomId, 
                friend: {
                    _id: friend._id,
                    fullName: friend.fullName,
                    profileImageURL: friend.profileImageURL,
                    isActive: friend.activeStatus.isActive,
                    lastActive: friend.activeStatus.lastActive
                },
                history: formattedHistory 
            }, 
            "Chat room ready"
        )
    );
});

export {registerUser , loginUser , logoutUser , refreshAccessToken ,checkAuth, startFriendChat } 
