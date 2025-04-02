import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, Radio, UserCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn, showSingleDevicePrompt, confirmSingleDeviceLogin, cancelSingleDeviceLogin } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM SUBMIT with data:", JSON.stringify(formData));

    if (validateForm()) {
      console.log("FORM VALIDATED, calling login");
      const result = await login(formData);
      console.log("LOGIN RESULT:", result);
      // If the result indicates already logged in on another device, the showSingleDevicePrompt state will be true
      // The modal will be shown from the conditional rendering below
    }
  };

  const handleConfirmSingleDevice = async () => {
    console.log("CONFIRM BUTTON CLICKED - Using stored credentials from auth store");
    await confirmSingleDeviceLogin();
  };

  const handleCancelSingleDevice = () => {
    cancelSingleDeviceLogin();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0] relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
        {/* Add a subtle pattern overlay */}
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
      
      {/* Single Device Login Modal */}
      {showSingleDevicePrompt && (
        <div className="fixed inset-0 bg-[#272829]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#31333A] to-[#272829] p-6 sm:p-8 rounded-2xl border border-[#61677A]/30 shadow-2xl w-full max-w-md mx-auto relative animate-fade-in-up">
            <div className="absolute top-0 left-0 w-full h-full bg-[#61677A]/5 rounded-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-[#FFF6E0]/10 rounded-full flex items-center justify-center mr-3">
                  <AlertCircle className="h-6 w-6 text-[#FFF6E0]" />
                </div>
                <h3 className="text-xl font-semibold text-[#FFF6E0]">
                  Already Logged In
                </h3>
              </div>
              
              <p className="mb-6 text-[#D8D9DA] leading-relaxed">
                You are already logged in on another device. For security reasons, you can only be logged in on one device at a time. Would you like to log out from all other devices and continue with this login?
              </p>
              
              <div className="flex flex-col space-y-3">
                <button
                  className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-[#D8D9DA] hover:to-[#FFF6E0]"
                  onClick={handleConfirmSingleDevice}
                >
                  {isLoggingIn ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Yes, log me in here only"
                  )}
                </button>
                <button
                  className="bg-transparent border border-[#61677A]/50 hover:bg-[#31333A] text-[#FFF6E0] px-6 py-3 rounded-xl font-medium transition-all duration-300"
                  onClick={handleCancelSingleDevice}
                  disabled={isLoggingIn}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="max-w-md w-full mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-8">
          <div className="relative flex justify-center mb-8">
            <div className="absolute w-32 h-32 bg-gradient-to-r from-[#FFF6E0]/10 to-[#61677A]/10 rounded-full blur-md"></div>
            <div className="relative">
              <UserCircle2 size={80} className="text-[#FFF6E0] opacity-80" />
              <div className="absolute inset-0 w-full h-full rounded-full border-2 border-[#FFF6E0]/20 animate-ping" style={{animationDuration: '4s'}}></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Welcome Back</span>
          </h1>
          
          <p className="text-[#D8D9DA] max-w-sm mx-auto leading-relaxed text-lg mb-2">
            Sign in to continue your journey
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#FFF6E0] to-transparent mx-auto my-4 rounded-full"></div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gradient-to-b from-[#31333A]/70 to-[#272829]/70 backdrop-blur-md rounded-2xl border border-[#61677A]/30 p-8 shadow-2xl">
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full py-3 px-4 rounded-xl bg-[#272829]/80 border border-[#61677A]/50 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20 focus:border-[#FFF6E0]/30 transition-all"
                />
                <div className="absolute inset-0 border border-[#FFF6E0]/5 rounded-xl pointer-events-none"></div>
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="text-sm font-medium text-[#D8D9DA] mb-2 flex items-center">
                <Lock className="mr-2 h-4 w-4 text-[#FFF6E0]/70" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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
              <div className="flex justify-end">
                <a href="#" className="text-xs text-[#FFF6E0]/70 hover:text-[#FFF6E0] mt-2 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="group relative overflow-hidden w-full bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-6 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl mt-6"
            >
              <span className="relative z-10 flex items-center justify-center font-semibold">
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </button>
          </div>
        </form>
        
        {/* Sign up link */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#61677A]/50"></div>
            <p className="text-[#D8D9DA] mx-3">
              New to our platform?
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#61677A]/50"></div>
          </div>
          <Link to="/signup" className="inline-block mt-3 text-[#FFF6E0] bg-[#31333A]/50 hover:bg-[#31333A] border border-[#61677A]/30 transition-all duration-300 px-6 py-2.5 rounded-xl font-medium">
            Create Account
          </Link>
        </div>
      </div>
      
      
    </div>
  );
}

export default LoginPage;