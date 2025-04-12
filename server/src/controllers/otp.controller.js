import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { UserInfoRules } from "../models/userInfoRules.model.js";
import { sendOtpEmail, generateOTP, getOtpRequestCount, resetOtpRequestCounter } from "../utils/brevoService.js";

// Send OTP for email verification during registration
export const sendRegistrationOtp = asyncHandler(async (req, res) => {
  console.log("OTP Send Request received:", { email: req.body.email });
  
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  
  // Check if OTP is required for signup based on system settings
  const userInfoRules = await UserInfoRules.findOne({});
  const isOtpRequired = userInfoRules?.isSignupOtpRequired ?? true; // Default to true if not found
  
  console.log("OTP required for signup:", isOtpRequired);
  
  if (!isOtpRequired) {
    // If OTP is not required, we'll still create a temporary user but mark it as not needing verification
    console.log("OTP not required for signup - skipping verification");
    // Check if email already exists and is verified
    const existingUser = await User.findOne({ email });
    
    if (existingUser && existingUser.otp && existingUser.otp.verified) {
      throw new ApiError(409, "Email is already registered and verified");
    }
    
    if (!existingUser) {
      // Create temporary user with OTP already verified
      await User.create({
        email,
        otp: {
          verified: true
        },
        isEmailVerified: false, // Since OTP is not required, email is not verified
        // Set temporary values for required fields to avoid validation errors
        fullName: "Temporary User",
        password: "temporary_password_will_be_updated",
        gender: "unspecified",
        dateOfBirth: new Date(),
        uniqueTag: "TEMP" + Date.now(),
        currentLocation: {
          type: "Point",
          coordinates: [0, 0] // Default coordinates
        }
      });
    } else {
      // Update existing user to mark OTP as verified
      if (!existingUser.otp) {
        existingUser.otp = {};
      }
      existingUser.otp.verified = true;
      existingUser.isEmailVerified = false; // Since OTP is not required, email is not verified
      await existingUser.save();
    }
    
    return res.status(200).json(
      new ApiResponse(
        200, 
        { 
          otpRequired: false,
          message: "OTP verification is not required. You can proceed with registration." 
        }, 
        "OTP verification skipped"
      )
    );
  }

  try {
    // Check if email already exists and is verified
    const existingUser = await User.findOne({ email });
    console.log("Existing user check:", { found: !!existingUser, verified: existingUser?.otp?.verified });
    
    if (existingUser && existingUser.otp && existingUser.otp.verified) {
      throw new ApiError(409, "Email is already registered and verified");
    }
    
    // Generate OTP
    const otp = generateOTP();
    console.log("Generated OTP:", otp);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    // Send OTP via email
    console.log("Calling sendOtpEmail...");
    const emailResult = await sendOtpEmail(email, otp);
    console.log("Email result:", emailResult);
    
    // If user exists, update OTP; otherwise, create temporary user
    if (existingUser) {
      if (!existingUser.otp) {
        existingUser.otp = {};
      }
      existingUser.otp.code = otp;
      existingUser.otp.expiresAt = otpExpiresAt;
      existingUser.otp.verified = false;
      await existingUser.save();
      console.log("Updated existing user with new OTP");
    } else {
      // Create temporary user with OTP (will be completed after verification)
      const newUser = await User.create({
        email,
        otp: {
          code: otp,
          expiresAt: otpExpiresAt,
          verified: false
        },
        // Set temporary values for required fields to avoid validation errors
        fullName: "Temporary User",
        password: "temporary_password_will_be_updated",
        gender: "unspecified",
        dateOfBirth: new Date(),
        uniqueTag: "TEMP" + Date.now(),
        currentLocation: {
          type: "Point",
          coordinates: [0, 0] // Default coordinates
        }
      });
      console.log("Created new temporary user:", newUser._id);
    }
    
    return res.status(200).json(
      new ApiResponse(
        200, 
        { 
          emailSent: true, 
          requestCount: emailResult.requestCount 
        }, 
        "OTP sent successfully"
      )
    );
  } catch (error) {
    console.error("Error in sendRegistrationOtp:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to send OTP: " + (error.message || "Unknown error"));
  }
});

// Verify OTP
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  // Check if OTP has expired
  if (user.otp.expiresAt < new Date()) {
    throw new ApiError(400, "OTP has expired");
  }
  
  // Verify OTP
  if (user.otp.code !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }
  
  // Mark as verified and set email as verified
  user.otp.verified = true;
  user.isEmailVerified = true; // Email is now verified through OTP
  await user.save();
  
  return res.status(200).json(
    new ApiResponse(
      200, 
      { verified: true }, 
      "OTP verified successfully"
    )
  );
});

// Get OTP request statistics (admin only)
export const getOtpRequestStats = asyncHandler(async (req, res) => {
  // This should have admin middleware
  const requestCount = getOtpRequestCount();
  
  return res.status(200).json(
    new ApiResponse(
      200, 
      { requestCount }, 
      "OTP request statistics retrieved successfully"
    )
  );
});

// Reset OTP counter (admin only)
export const resetOtpCounter = asyncHandler(async (req, res) => {
  // This should have admin middleware
  const result = resetOtpRequestCounter();
  
  return res.status(200).json(
    new ApiResponse(
      200, 
      result, 
      "OTP counter reset successfully"
    )
  );
});

// Send OTP for password reset
export const sendPasswordResetOtp = asyncHandler(async (req, res) => {
  console.log("Password Reset OTP Request received:", { email: req.body.email });
  
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    
    if (!existingUser) {
      throw new ApiError(404, "User with this email does not exist");
    }
    
    // Generate OTP
    const otp = generateOTP();
    console.log("Generated Password Reset OTP:", otp);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    // Send OTP via email
    console.log("Sending password reset OTP email...");
    const emailResult = await sendOtpEmail(email, otp, 'password-reset');
    console.log("Email result:", emailResult);
    
    // Update user with reset OTP
    existingUser.passwordReset = {
      otp: otp,
      expiresAt: otpExpiresAt,
      verified: false
    };
    await existingUser.save();
    
    return res.status(200).json(
      new ApiResponse(
        200, 
        { 
          emailSent: true,
          requestCount: emailResult.requestCount 
        }, 
        "Password reset OTP sent successfully"
      )
    );
  } catch (error) {
    console.error("Error in sendPasswordResetOtp:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to send password reset OTP: " + (error.message || "Unknown error"));
  }
});

// Verify OTP for password reset
export const verifyPasswordResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  if (!user.passwordReset || !user.passwordReset.otp) {
    throw new ApiError(400, "No password reset request found");
  }
  
  // Check if OTP has expired
  if (user.passwordReset.expiresAt < new Date()) {
    throw new ApiError(400, "OTP has expired");
  }
  
  // Verify OTP
  if (user.passwordReset.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }
  
  // Mark as verified
  user.passwordReset.verified = true;
  await user.save();
  
  return res.status(200).json(
    new ApiResponse(
      200, 
      { verified: true }, 
      "OTP verified successfully. You can now reset your password."
    )
  );
});

// Reset password after OTP verification
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  
  if (!email || !newPassword) {
    throw new ApiError(400, "Email and new password are required");
  }
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  // Check if OTP was verified
  if (!user.passwordReset || !user.passwordReset.verified) {
    throw new ApiError(400, "Please verify OTP before resetting password");
  }
  
  // Update password
  user.password = newPassword;
  
  // Clear password reset data
  user.passwordReset = undefined;
  
  // Save user with new password (password will be hashed by pre-save hook)
  await user.save();
  
  return res.status(200).json(
    new ApiResponse(
      200, 
      { passwordReset: true }, 
      "Password reset successfully"
    )
  );
}); 