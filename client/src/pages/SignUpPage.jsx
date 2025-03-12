import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, User, Calendar, MapPin, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    bio: [],
    currentLocation: {
      latitude: "",
      longitude: "",
    }
  });
  const [useLiveLocation, setUseLiveLocation] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

  const { signup, isSigningUp } = useAuthStore();

  const genderOptions = [
    "Male",
    "Female",
    "Non-binary",
    "Genderfluid",
    "Agender",
    "Transgender",
    "Intersex",
    "Attack Helicopter",
    "Cloud",
    "Pussy(cat)",
    "The Internet", 
    "Penguin in a Suit",
    "Cock(male chicken)",
    "Supercar",
    "Tank",
    "Pookie",
    "Mig-31",
    "usb cable 1m",
    "USB CABLE 1.5M",
  ];

  // Define bio options
  const bioOptions = [
    "Adventurous",
    "Bookworm",
    "Foodie",
    "Fitness Enthusiast",
    "Tech Geek",
    "Music Lover",
    "Travel Junkie",
    "Nature Lover",
    "Pet Friendly",
    "Night Owl",
    "Early Bird",
    "Movie Buff",
    "Art Enthusiast",
    "Gamer",
  ];

  const handleBioSelection = (option) => {
    let selectedOptions = [...formData.bio];
    if (selectedOptions.includes(option)) {
      // Remove the option if it's already selected
      selectedOptions = selectedOptions.filter((item) => item !== option);
    } else if (selectedOptions.length < 6) {
      // Add the option if it's not already selected and limit is not reached
      selectedOptions.push(option);
    } else {
      toast.error("You can select up to 6 fields only.");
    }
    setFormData({ ...formData, bio: selectedOptions });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    
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
  
    if (!formData.gender.trim()) {
      toast.error("Gender is required");
      return false;
    }
  
    if (!formData.dateOfBirth.trim()) {
      toast.error("Date of birth is required");
      return false;
    }
  
    if (formData.bio.length === 0) {
      toast.error("Please select at least one bio field");
      return false;
    }
    
    if (useLiveLocation && (!formData.currentLocation.latitude || !formData.currentLocation.longitude)) {
      toast.error("Current location is required when using live location");
      return false;
    }
  
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const success = validateForm();
    if (success === true) signup(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLiveLocation = () => {
    setIsPopupVisible(true);
  };

  const confirmLiveLocation = () => {
    setIsPopupVisible(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          currentLocation:{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
        });
        setUseLiveLocation(true);
      },
      (error) => {
        console.error("Error fetching location: ", error);
        toast.error("Could not access your location");
      }
    );
  };

  const cancelLiveLocation = () => {
    setIsPopupVisible(false);
    setUseLiveLocation(false);
    setFormData({ 
      ...formData, 
      currentLocation: {
        latitude: "",
        longitude: ""
      } 
    });
  };

  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0] relative overflow-hidden flex items-center justify-center">
      {/* Background elements - matching login page style */}
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
      
      {/* Location confirmation popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-[#272829]/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gradient-to-b from-[#31333A] to-[#272829] p-8 rounded-2xl border border-[#61677A]/30 shadow-2xl max-w-md mx-6 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[#61677A]/5 rounded-2xl"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-4 text-[#FFF6E0]">Location Access</h3>
              <p className="mb-6 text-[#D8D9DA] leading-relaxed">
                The application will only use your location to connect with users nearby. Your privacy is important to us - location data will not be shared with third parties.
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-[#D8D9DA] hover:to-[#FFF6E0]"
                  onClick={confirmLiveLocation}
                >
                  Allow Access
                </button>
                <button
                  className="bg-transparent border border-[#61677A]/50 hover:bg-[#31333A] text-[#FFF6E0] px-6 py-3 rounded-xl font-medium transition-all duration-300"
                  onClick={cancelLiveLocation}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="w-full max-w-2xl mx-auto px-6 py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="relative flex justify-center mb-8">
            <div className="absolute w-32 h-32 bg-gradient-to-r from-[#FFF6E0]/10 to-[#61677A]/10 rounded-full blur-md"></div>
            <div className="relative">
              <User size={80} className="text-[#FFF6E0] opacity-80" />
              <div className="absolute inset-0 w-full h-full rounded-full border-2 border-[#FFF6E0]/20 animate-ping" style={{animationDuration: '4s'}}></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Join Our Community</span>
          </h1>
          
          <p className="text-[#D8D9DA] max-w-lg mx-auto leading-relaxed text-lg mb-2">
            Create your account and begin your journey with us
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#FFF6E0] to-transparent mx-auto my-4 rounded-full"></div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gradient-to-b from-[#31333A]/70 to-[#272829]/70 backdrop-blur-md rounded-2xl border border-[#61677A]/30 p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="form-control col-span-1">
              <label className="text-sm font-medium text-[#D8D9DA] mb-2 flex items-center">
                <User className="mr-2 h-4 w-4 text-[#FFF6E0]/70" />
                <span>Full Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full py-3 px-4 rounded-xl bg-[#272829]/80 border border-[#61677A]/50 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20 focus:border-[#FFF6E0]/30 transition-all"
                />
                <div className="absolute inset-0 border border-[#FFF6E0]/5 rounded-xl pointer-events-none"></div>
              </div>
            </div>

            {/* Email */}
            <div className="form-control col-span-1">
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
            <div className="form-control col-span-1">
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
                {/* <div className="absolute inset-0 border border-[#FFF6E0]/5 rounded-xl */}
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

            {/* Gender */}
            <div className="form-control col-span-1">
              <label className="text-sm font-medium text-[#D8D9DA] mb-2 flex items-center">
                <User className="mr-2 h-4 w-4 text-[#FFF6E0]/70" />
                <span>Gender</span>
              </label>
              <div className="relative">
                <div 
                  className="w-full py-3 px-4 rounded-xl bg-[#272829]/80 border border-[#61677A]/50 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20 focus:border-[#FFF6E0]/30 transition-all flex justify-between items-center cursor-pointer"
                  onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                >
                  <span className={formData.gender ? "text-[#FFF6E0]" : "text-[#FFF6E0]/50"}>
                    {formData.gender || "Select your gender"}
                  </span>
                  <ChevronDown size={18} className={`transition-transform ${isGenderDropdownOpen ? "rotate-180" : ""}`} />
                </div>
                <div className="absolute inset-0 border border-[#FFF6E0]/5 rounded-xl pointer-events-none"></div>
                
                {isGenderDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full py-2 bg-[#31333A] border border-[#61677A]/50 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                    {genderOptions.map((gender, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-[#61677A]/20 cursor-pointer transition-colors"
                        onClick={() => {
                          setFormData({ ...formData, gender });
                          setIsGenderDropdownOpen(false);
                        }}
                      >
                        {gender}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="form-control col-span-1">
              <label className="text-sm font-medium text-[#D8D9DA] mb-2 flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-[#FFF6E0]/70" />
                <span>Date of Birth</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-xl bg-[#272829]/80 border border-[#61677A]/50 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/20 focus:border-[#FFF6E0]/30 transition-all"
                />
                <div className="absolute inset-0 border border-[#FFF6E0]/5 rounded-xl pointer-events-none"></div>
              </div>
            </div>

            {/* Bio */}
            <div className="form-control col-span-2">
              <label className="text-sm font-medium text-[#D8D9DA] mb-3 flex items-center">
                <span>Choose up to 6 fields that describe you</span>
                <span className="ml-2 text-xs text-[#FFF6E0]/50">({formData.bio.length}/6 selected)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {bioOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300 text-sm ${
                      formData.bio.includes(option) 
                        ? "bg-gradient-to-r from-[#FFF6E0]/20 to-[#D8D9DA]/20 border border-[#FFF6E0]/30 text-[#FFF6E0]" 
                        : "bg-[#272829]/80 border border-[#61677A]/30 text-[#D8D9DA] hover:border-[#FFF6E0]/20"
                    }`}
                    onClick={() => handleBioSelection(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Location */}
            <div className="form-control col-span-2">
              <label className="text-sm font-medium text-[#D8D9DA] mb-2 flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-[#FFF6E0]/70" />
                <span>Live Location</span>
              </label>
              <div className="flex items-center space-x-2 bg-[#272829]/80 border border-[#61677A]/50 rounded-xl p-4">
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 flex items-center ${useLiveLocation ? "bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA]" : "bg-[#61677A]/30"}`}
                  onClick={() => {
                    if (!useLiveLocation) handleLiveLocation();
                    else cancelLiveLocation();
                  }}
                >
                  <div 
                    className={`bg-[#272829] w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${useLiveLocation ? "translate-x-6" : ""}`}
                  ></div>
                </div>
                <span className="text-[#FFF6E0]/80">Use live location</span>
              </div>
              {useLiveLocation && formData.currentLocation.latitude && formData.currentLocation.longitude && (
                <div className="mt-2 text-xs text-[#FFF6E0]/50 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Current Location: {formData.currentLocation.latitude.toFixed(4)}, {formData.currentLocation.longitude.toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSigningUp}
            className="group relative overflow-hidden w-full bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] hover:from-[#D8D9DA] hover:to-[#FFF6E0] text-[#272829] border-none px-6 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl mt-8"
          >
            <span className="relative z-10 flex items-center justify-center font-semibold">
              {isSigningUp ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8D9DA] to-[#FFF6E0] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          </button>
        </form>
        
        {/* Sign in link */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#61677A]/50"></div>
            <p className="text-[#D8D9DA] mx-3">
              Already have an account?
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#61677A]/50"></div>
          </div>
          <Link to="/login" className="inline-block mt-3 text-[#FFF6E0] bg-[#31333A]/50 hover:bg-[#31333A] border border-[#61677A]/30 transition-all duration-300 px-6 py-2.5 rounded-xl font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;