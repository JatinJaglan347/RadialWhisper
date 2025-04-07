import { Router } from "express";
import { 
  sendRegistrationOtp, 
  verifyOtp, 
  getOtpRequestStats, 
  resetOtpCounter,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword
} from "../controllers/otp.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdminRole } from "../middlewares/role.middleware.js";
import { sendOtpEmail, generateOTP } from "../utils/brevoService.js";

const router = Router();

// Test route
router.route("/test").get((req, res) => {
  console.log("OTP test route hit");
  res.status(200).json({ 
    success: true, 
    message: "OTP routes are working correctly",
    env: {
      brevoKeyConfigured: !!process.env.BREVO_API_KEY,
      brevoSenderConfigured: !!process.env.BREVO_SENDER_EMAIL
    }
  });
});

// Test email route (for debugging)
router.route("/test-email").get(async (req, res) => {
  try {
    console.log("Testing Brevo email directly");
    const testEmail = req.query.email || "test@example.com";
    const testOtp = generateOTP();
    
    console.log(`Sending test OTP ${testOtp} to ${testEmail}`);
    const result = await sendOtpEmail(testEmail, testOtp);
    
    res.status(200).json({
      success: true,
      message: "Test email sent successfully",
      result
    });
  } catch (error) {
    console.error("Error in test-email route:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message
    });
  }
});

// Public routes
router.route("/send").post(sendRegistrationOtp);
router.route("/verify").post(verifyOtp);

// Password reset routes
router.route("/forgot-password").post(sendPasswordResetOtp);
router.route("/verify-reset-otp").post(verifyPasswordResetOtp);
router.route("/reset-password").post(resetPassword);

// Admin-only routes
router.route("/stats").get(verifyJWT, verifyAdminRole, getOtpRequestStats);
router.route("/reset-counter").post(verifyJWT, verifyAdminRole, resetOtpCounter);

export default router; 