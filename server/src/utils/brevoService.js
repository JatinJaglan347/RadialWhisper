import axios from 'axios';
import { ApiError } from './ApiError.js';

// Counter for OTP requests
let otpRequestCounter = 0;

// Function to send OTP email using Brevo's direct API
export const sendOtpEmail = async (email, otp, purpose = 'registration') => {
  try {
    console.log(`Starting OTP email sending process for ${purpose}`);
    console.log("API Key configured:", !!process.env.BREVO_API_KEY);
    console.log("Sender email:", process.env.BREVO_SENDER_EMAIL || 'noreply@radialwhisper.com');

    // Brevo API v3 endpoint
    const url = 'https://api.brevo.com/v3/smtp/email';
    
    // Email content based on purpose
    let subject = '';
    let htmlContent = '';
    let textContent = '';
    
    if (purpose === 'password-reset') {
      subject = 'Password Reset - Radial Whisper';
      htmlContent = `
        <html>
          <body>
            <h1>Password Reset Request</h1>
            <p>We received a request to reset your Radial Whisper account password.</p>
            <p>Your OTP for password reset is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>
          </body>
        </html>
      `;
      textContent = `Your OTP for Radial Whisper Password Reset is: ${otp}. This OTP will expire in 10 minutes.`;
    } else {
      // Default registration OTP
      subject = 'Your OTP for Radial Whisper Registration';
      htmlContent = `
        <html>
          <body>
            <h1>Welcome to Radial Whisper!</h1>
            <p>Your OTP for account verification is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
          </body>
        </html>
      `;
      textContent = `Your OTP for Radial Whisper Registration is: ${otp}. This OTP will expire in 10 minutes.`;
    }
    
    // Email data
    const data = {
      sender: {
        name: 'Radial Whisper',
        email: process.env.BREVO_SENDER_EMAIL || 'noreply@radialwhisper.com'
      },
      to: [{
        email: email
      }],
      subject: subject,
      htmlContent: htmlContent,
      textContent: textContent
    };
    
    // Increment counter
    otpRequestCounter++;
    
    console.log("Sending email with Brevo API...");
    
    // Send the request
    const response = await axios.post(url, data, {
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      }
    });
    
    console.log("Email sent successfully:", response.data);
    
    return {
      success: true,
      messageId: response.data?.messageId,
      requestCount: otpRequestCounter
    };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    if (error.response) {
      console.error("API error response:", error.response.data);
    }
    throw new ApiError(500, "Failed to send OTP email: " + (error.message || "Unknown error"));
  }
};

// Function to generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to get current OTP request count
export const getOtpRequestCount = () => {
  return otpRequestCounter;
};

// Function to reset counter (for testing/admin purposes)
export const resetOtpRequestCounter = () => {
  otpRequestCounter = 0;
  return { success: true, message: "OTP request counter reset" };
}; 