import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Mail, Lock, User, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
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
    
  
    if (!formData.currentLocation.latitude && !formData.currentLocation.longitude ) {
      toast.error("Current location is required when using live location");
      return false;
    }
  
    return true;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const success = validateForm();
    if (success == true) signup(formData);
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
          } ,
        });
        setUseLiveLocation(true);
      },
      (error) => {
        console.error("Error fetching location: ", error);
      }
    );
  };

  const cancelLiveLocation = () => {
    setIsPopupVisible(false);
    setUseLiveLocation(false);
    setFormData({ ...formData, currentLocation: "" });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen rounded-lg shadow-md">
      {isPopupVisible && (
        <div className="fixed inset-0  bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <p className="mb-4 ">
              The application will only use your location to search users around you. It will not be shared with any third party. We respect your privacy.
            </p>
            <button
              className="btn btn-accent w-full mb-2"
              onClick={confirmLiveLocation}
            >
              OK
            </button>
            <button
              className="btn btn-error w-full"
              onClick={cancelLiveLocation}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <form
        className="w-full max-w-md p-6  "
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {/* Full Name */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 " />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="input input-bordered w-full pl-10"
              
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 " />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input input-bordered w-full pl-10"
              
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 " />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input input-bordered w-full pl-10"
              
            />
            {showPassword ? (
              <EyeOff
                className="absolute right-3 top-3  cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                className="absolute right-3 top-3  cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        </div>

        {/* Gender */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Gender</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="select select-bordered w-full"
            
          >
            <option value="" disabled>
              Select your gender
            </option>
            {genderOptions.map((gender, index) => (
              <option key={index} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        {/* Date of Birth */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Date of Birth</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 " />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="input input-bordered w-full pl-10"
              
            />
          </div>
        </div>

        {/* Bio */}
      {/* Bio */}
<div className="form-control mb-4">
  <label className="label">
    <span className="label-text">Choose up to 6 fields that describe you</span>
  </label>
  <div className="flex flex-wrap gap-2">
    {bioOptions.map((option, index) => (
      <div
        key={index}
        className={`badge cursor-pointer ${
          formData.bio.includes(option) ? "badge-primary" : "badge-outline"
        }`}
        onClick={() => handleBioSelection(option)}
      >
        {option}
      </div>
    ))}
  </div>
  {formData.bio.length > 0 && (
    <p className="mt-2 text-sm">
      Selected: {formData.bio.join(", ")}
    </p>
  )}
</div>


        {/* Current Location */}
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text">Live Location</span>
          </label>
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              className="checkbox checkbox-primary mr-2"
              
              checked={useLiveLocation}
              onChange={() => {
                if (!useLiveLocation) handleLiveLocation();
              }}
            />
            Use live location
          </label>
          {useLiveLocation && formData.currentLocation.latitude && formData.currentLocation.longitude && (
            <p className="mt-2 text-sm">
              Current Location: {`${formData.currentLocation.latitude}, ${formData.currentLocation.longitude}`}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${isSigningUp ? "loading" : ""}`}
          disabled={isSigningUp}
        >
          {isSigningUp ? (
            <>
            <Loader2 className="size-5 animate-spin" />
            Loading...
            </>
           
          ):(
            "Create Account"
          )}
        </button>
      </form>
      <div className="text-clenter">
        <p className="text-base-content/60">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary">
           Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
