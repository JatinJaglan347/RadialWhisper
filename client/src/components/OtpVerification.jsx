import React, { useState, useEffect } from 'react';
import { Mail, Check, AlertCircle, Loader2, Clock, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OtpVerification = ({ email, onVerificationComplete }) => {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSendingOtp(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/otp/send`, {
        email
      });

      if (response.data.success) {
        setOtpSent(true);
        toast.success('OTP sent to your email');
        setRequestCount(response.data.data.requestCount);
        // Start a 60 second countdown
        setTimeLeft(60);
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/otp/verify`, {
        email,
        otp
      });

      if (response.data.success) {
        toast.success('Email verified successfully');
        
        // Call the parent component's callback with the OTP value
        onVerificationComplete(otp);
        
        // Automatically submit registration with the OTP value
        setTimeout(() => {
          // Redirect directly to chat
          navigate('/chat');
        }, 1000);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (email && !otpSent && !sendingOtp) {
      handleSendOtp();
    }
  }, [email]);

  return (
    <div className="w-full bg-gradient-to-b from-[#31333A]/70 to-[#272829]/70 backdrop-blur-md rounded-2xl border border-[#61677A]/30 p-6 md:p-8 shadow-2xl">
      <div className="text-center mb-6">
        <div className="relative flex justify-center mb-6">
          <div className="absolute w-16 h-16 bg-gradient-to-r from-[#FFF6E0]/10 to-[#61677A]/10 rounded-full blur-md"></div>
          <div className="relative">
            <Mail 
              size={36} 
              className="text-[#FFF6E0] opacity-80"
            />
            <div
              className="absolute inset-0 w-full h-full rounded-full border-2 border-[#FFF6E0]/20 animate-ping"
              style={{ animationDuration: "4s" }}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
          <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
            Email Verification
          </span>
        </h2>
        
        <p className="text-[#D8D9DA] mb-1 leading-relaxed">
          We've sent a verification code to
        </p>
        <p className="text-[#FFF6E0] font-medium mb-3">
          {email}
        </p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-[#FFF6E0] to-transparent mx-auto my-2 rounded-full"></div>
      </div>
      
      {!otpSent ? (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSendOtp}
            disabled={sendingOtp}
            className="group relative overflow-hidden bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg"
          >
            <span className="relative z-10 flex items-center justify-center font-semibold">
              {sendingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Send OTP</span>
                </>
              )}
            </span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {timeLeft > 0 ? (
                <div className="flex items-center text-[#FFF6E0]/70 text-sm px-3 py-1.5 rounded-full bg-[#61677A]/20 border border-[#61677A]/30">
                  <Clock className="w-4 h-4 mr-1.5 text-[#FFF6E0]/70" />
                  <span>Resend in {timeLeft}s</span>
                </div>
              ) : (
                <button
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="flex items-center text-[#FFF6E0] text-sm px-3 py-1.5 rounded-full bg-[#31333A] hover:bg-[#61677A]/30 border border-[#61677A]/30 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${sendingOtp ? 'animate-spin' : ''}`} />
                  <span>{sendingOtp ? 'Sending...' : 'Resend OTP'}</span>
                </button>
              )}
            </div>
            
            {otpSent && (
              <div className="text-center text-xs text-[#D8D9DA]/60 mb-2">
                OTP requests sent: <span className="text-[#FFF6E0]/80">{requestCount}</span>
              </div>
            )}
          </div>
          
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-6">
              <label 
                htmlFor="otp" 
                className="block text-xs sm:text-sm font-medium text-[#D8D9DA] mb-2 flex items-center justify-center"
              >
                <Check className="mr-1.5 h-3.5 w-3.5 text-[#FFF6E0]/70" />
                <span>Enter 6-digit OTP</span>
              </label>
              
              <div className={`relative transition-all duration-300 ${inputFocused ? 'scale-105' : ''}`}>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full py-3 px-4 rounded-xl bg-[#272829]/80 border border-[#61677A]/50 text-center text-xl tracking-widest text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20 focus:border-[#FFF6E0]/30 transition-all font-mono"
                  maxLength={6}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
                <div className="absolute inset-0 border border-[#FFF6E0]/5 rounded-xl pointer-events-none"></div>
              </div>
              
              <p className="mt-2 text-xs text-center text-[#D8D9DA]/60">
                Please check your inbox for a 6-digit verification code
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              className={`group relative overflow-hidden w-full border-none px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg ${
                otp.length === 6 
                ? 'bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829]' 
                : 'bg-[#61677A]/30 text-[#D8D9DA]/50 cursor-not-allowed'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center font-semibold">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  'Verify Email'
                )}
              </span>
              {otp.length === 6 && (
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              )}
            </button>
          </form>
        </>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-xs text-[#D8D9DA]/60">
          Didn't receive the code? Check your spam folder or verify your email address.
        </p>
      </div>
    </div>
  );
};

export default OtpVerification; 