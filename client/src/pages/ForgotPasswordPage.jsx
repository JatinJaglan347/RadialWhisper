import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/otp/forgot-password`, { email });
      
      if (response.data.success) {
        toast.success("OTP sent to your email");
        setCurrentStep(2);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error("OTP is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/otp/verify-reset-otp`, { email, otp });
      
      if (response.data.success) {
        toast.success("OTP verified successfully");
        setCurrentStep(3);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("OTP verification failed. Please try again.");
      }
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword.trim()) {
      toast.error("New password is required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/otp/reset-password`, { 
        email, 
        newPassword 
      });
      
      if (response.data.success) {
        toast.success("Password reset successfully");
        setCurrentStep(4);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Password reset failed. Please try again.");
      }
      console.error("Error resetting password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0] relative overflow-hidden flex items-center justify-center">
      {/* Background elements - same as LoginPage */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
      </div>
      
      {/* Enhanced animated floating orbs */}
      <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse" style={{animationDuration: '7s'}}></div>
      <div className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '10s'}}></div>
      <div className="absolute top-20 left-1/4 w-40 h-40 rounded-full bg-[#FFF6E0] blur-[80px] opacity-10 animate-pulse" style={{animationDuration: '8s'}}></div>
      <div className="absolute bottom-20 right-1/3 w-56 h-56 rounded-full bg-[#D8D9DA] blur-[90px] opacity-15 animate-pulse" style={{animationDuration: '9s'}}></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="max-w-md w-full mx-auto px-6 py-16 relative z-10">
        {/* Go back button */}
        <div className="absolute top-8 left-6">
          <button 
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/login')}
            className="text-[#FFF6E0]/80 hover:text-[#FFF6E0] flex items-center transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>{currentStep > 1 ? "Back" : "Back to Login"}</span>
          </button>
        </div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-1 bg-gradient-to-r from-[#FFF6E0] to-transparent mx-auto my-4 rounded-full"></div>

          {currentStep < 4 ? (
            <>
              <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
                  {currentStep === 1 && "Forgot Password"}
                  {currentStep === 2 && "Verify OTP"}
                  {currentStep === 3 && "Reset Password"}
                </span>
              </h1>
              
              <p className="text-[#D8D9DA] max-w-sm mx-auto leading-relaxed text-lg mb-2">
                {currentStep === 1 && "Enter your email to receive an OTP"}
                {currentStep === 2 && "Enter the OTP sent to your email"}
                {currentStep === 3 && "Create a new password for your account"}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="bg-[#FFF6E0]/10 rounded-full p-4 mb-6 animate-fade-in">
                <CheckCircle2 size={50} className="text-[#FFF6E0]" />
              </div>
              <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
                  Password Reset Successful
                </span>
              </h1>
              <p className="text-[#D8D9DA] max-w-sm mx-auto leading-relaxed text-lg mb-8">
                Your password has been reset successfully. You can now login with your new password.
              </p>
            </div>
          )}
        </div>
        
        {/* Step 1: Email Form */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmitEmail} className="bg-gradient-to-b from-[#31333A]/70 to-[#272829]/70 backdrop-blur-md rounded-2xl border border-[#61677A]/30 p-8 shadow-2xl">
            <div className="space-y-6">
              {/* Email */}
              <div className="form-control">
                <label className="text-sm font-medium text-[#D8D9DA] mb-2 flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-[#FFF6E0]/70" />
                  <span>Email</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full py-3 px-4 rounded-xl bg-[#272829]/80 border border-[#61677A]/50 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20 focus:border-[#FFF6E0]/30 transition-all"
                  />
                  <div className="absolute inset-0 border border-[#FFF6E0]/5 rounded-xl pointer-events-none"></div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative overflow-hidden w-full bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-6 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl mt-6"
              >
                <span className="relative z-10 flex items-center justify-center font-semibold">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              </button>
            </div>
          </form>
        )}
        
        {/* Step 2: OTP Verification */}
        {currentStep === 2 && (
          <form onSubmit={handleVerifyOtp} className="bg-gradient-to-b from-[#31333A]/70 to-[#272829]/70 backdrop-blur-md rounded-2xl border border-[#61677A]/30 p-8 shadow-2xl">
            <div className="space-y-6">
              {/* OTP */}
              <div className="form-control">
                <label className="text-sm font-medium text-[#D8D9DA] mb-2 flex items-center">
                  <KeyRound className="mr-2 h-4 w-4 text-[#FFF6E0]/70" />
                  <span>OTP Code</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP sent to your email"
                    className="w-full py-3 px-4 rounded-xl bg-[#272829]/80 border border-[#61677A]/50 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20 focus:border-[#FFF6E0]/30 transition-all"
                  />
                  <div className="absolute inset-0 border border-[#FFF6E0]/5 rounded-xl pointer-events-none"></div>
                </div>
              </div>

              <div className="text-center text-sm text-[#D8D9DA]">
                <p>OTP sent to: <span className="text-[#FFF6E0] font-medium">{email}</span></p>
                <button 
                  type="button"
                  onClick={handleSubmitEmail}
                  disabled={isLoading}
                  className="mt-2 text-[#FFF6E0]/70 hover:text-[#FFF6E0] underline transition-colors"
                >
                  Resend OTP
                </button>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative overflow-hidden w-full bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-6 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl mt-6"
              >
                <span className="relative z-10 flex items-center justify-center font-semibold">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              </button>
            </div>
          </form>
        )}
        
        {/* Step 3: New Password */}
        {currentStep === 3 && (
          <form onSubmit={handleResetPassword} className="bg-gradient-to-b from-[#31333A]/70 to-[#272829]/70 backdrop-blur-md rounded-2xl border border-[#61677A]/30 p-8 shadow-2xl">
            <div className="space-y-6">
              {/* New Password */}
              <div className="form-control">
                <label className="text-sm font-medium text-[#D8D9DA] mb-2 flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-[#FFF6E0]/70" />
                  <span>New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full py-3 px-4 rounded-xl bg-[#272829]/80 border border-[#61677A]/50 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20 focus:border-[#FFF6E0]/30 transition-all pr-10"
                  />
                  <div className="absolute inset-0 border border-[#FFF6E0]/5 rounded-xl pointer-events-none"></div>
                  <button 
                    type="button"
                    className="absolute right-3 top-2.5 text-[#FFF6E0]/70 h-7 w-7 rounded-full hover:bg-[#FFF6E0]/10 flex items-center justify-center transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {/* Confirm Password */}
              <div className="form-control">
                <label className="text-sm font-medium text-[#D8D9DA] mb-2 flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-[#FFF6E0]/70" />
                  <span>Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full py-3 px-4 rounded-xl bg-[#272829]/80 border border-[#61677A]/50 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20 focus:border-[#FFF6E0]/30 transition-all pr-10"
                  />
                  <div className="absolute inset-0 border border-[#FFF6E0]/5 rounded-xl pointer-events-none"></div>
                  <button 
                    type="button"
                    className="absolute right-3 top-2.5 text-[#FFF6E0]/70 h-7 w-7 rounded-full hover:bg-[#FFF6E0]/10 flex items-center justify-center transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative overflow-hidden w-full bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-6 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl mt-6"
              >
                <span className="relative z-10 flex items-center justify-center font-semibold">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              </button>
            </div>
          </form>
        )}
        
        {/* Step 4: Success */}
        {currentStep === 4 && (
          <div className="text-center">
            <Link 
              to="/login"
              className="group relative overflow-hidden bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-6 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl mt-6 mx-auto inline-flex"
            >
              <span className="relative z-10 flex items-center justify-center font-semibold">
                Back to Login
              </span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </Link>
          </div>
        )}
        
      </div>
      
    </div>
  );
}

export default ForgotPasswordPage; 