import React, { useEffect, useState } from "react";
import { Edit3, MapPin, Cake, Hash, User, Globe, Clock, Radio, Shield, Settings } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import UpdateField from "../components/UpdateField";
import Loader from "../components/Loader";

const ProfilePage = () => {
  const { authUser, isGettingUserInfoRules, userInfoRulesData, fetchPublicUserInfoRules } = useAuthStore();
  const userData = authUser?.data?.user;

  const [showUpdateBox, setShowUpdateBox] = useState(false);
  const [editField, setEditField] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [fieldType, setFieldType] = useState("");

  // In ProfilePage.jsx, add these logs in the handleEditClick function
const handleEditClick = (field, value, type) => {
  console.log('EditClick triggered:', { field, value, type });
  console.log('userInfoRulesData:', userInfoRulesData); // Check if this data exists
  console.log('Gender options:', userInfoRulesData?.genderList); // Check if gender list exists
  setEditField(field);
  setFieldValue(value);
  setFieldType(type);
  setShowUpdateBox(true);
};
  console.count("Profile Page Render");

  const handleFieldUpdate = (newValue) => {
    console.log(`Updated ${editField}:`, newValue);
    // You can update the user data here (e.g., by calling an API).
  };
  useEffect(() => {
    fetchPublicUserInfoRules();
  },[]);

 

  // Destructure user data.
  const {
    fullName,
    email,
    gender,
    dateOfBirth,
    uniqueTag,
    bio,
    currentLocation,
    previousLocation,
    profileImageURL,
    userRole,
    locationRadiusPreference,
    createdAt,
    updatedAt,
    isEmailVerified,
  } = userData;

  const role = userRole === "normalUser" ? "Default User" : userRole;

  let genderIcon = "";
  if (gender === "Male") {
    genderIcon = "🚹";
  } else if (gender === "Female") {
    genderIcon = "🚺";
  } else if (gender === "Transgender") {
    genderIcon = "🏳️‍⚧️";
  } 
  else {
    genderIcon = "🏳️‍🌈";
  }

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="min-h-screen bg-[#272829] py-8 px-4 relative overflow-hidden">
      {/* Background elements */}
    
    
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {showUpdateBox && (
        <UpdateField
          initialValue={fieldValue}
          fieldLabel={editField}
          fieldType={fieldType}
          onClose={() => setShowUpdateBox(false)}
          onUpdate={handleFieldUpdate}
        />
      )}

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-2">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-4 py-1 rounded-full text-sm font-medium">{fullName.split(' ')[0]}'s Profile</span>
          </div>

        </div>

        {/* Profile Header */}
        <div className="bg-[#31333A]/30 backdrop-blur-sm border border-[#61677A]/50 rounded-xl shadow-xl p-6 flex flex-col md:flex-row items-center mb-8 relative overflow-hidden">
          {/* Background effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#61677A]/20 blur-xl"></div>
          
          <div className="relative">
            <div className="w-40 h-40 rounded-full ring-2 ring-[#FFF6E0]/50 ring-offset-2 ring-offset-[#272829]/50 overflow-hidden backdrop-blur-sm">
              <img
                src={profileImageURL || "https://via.placeholder.com/150"}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute bottom-2 right-2 bg-[#FFF6E0] text-[#272829] w-10 h-10 rounded-full flex items-center justify-center">
              <Radio size={16} />
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 md:ml-8 w-full text-[#D8D9DA]">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-[#FFF6E0]">{fullName}</h2>
              <button
                className="p-2 z-10 rounded-full hover:bg-[#FFF6E0]/10 transition-colors"
                onClick={() => handleEditClick("Full Name", fullName, "text")}
              >
                <Edit3 size={18} className="text-[#FFF6E0]" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-[#61677A]/40 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                <Hash size={14} />
                <span>{uniqueTag}</span>
              </div>
              <div className="bg-[#61677A]/40 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                <span>{email}</span>
                {isEmailVerified ? (
                  <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded-full text-xs bg-green-900/40 text-green-300">
                    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded-full text-xs bg-yellow-900/40 text-yellow-300">
                    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Not Verified
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-[#31333A]/50 rounded-lg p-3 backdrop-blur-sm border border-[#61677A]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{genderIcon}</span>
                    <span className="text-[#D8D9DA]">{gender}</span>
                  </div>
                  <button
  className="p-1 rounded-full hover:bg-[#FFF6E0]/10 transition-colors"
  onClick={() => handleEditClick("Gender", gender, "select")}
>
  <Edit3 size={14} className="text-[#D8D9DA]" />
</button>
                </div>
              </div>
              
              <div className="bg-[#31333A]/50 rounded-lg p-3 backdrop-blur-sm border border-[#61677A]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cake size={16} className="text-[#D8D9DA]" />
                    <span>{new Date(dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <button
                    className="p-1 rounded-full hover:bg-[#FFF6E0]/10 transition-colors"
                    onClick={() =>
                      handleEditClick("Date of Birth", dateOfBirth, "date")
                    }
                  >
                    <Edit3 size={14} className="text-[#D8D9DA]" />
                  </button>
                </div>
              </div>
              
              <div className="bg-[#31333A]/50 rounded-lg p-3 backdrop-blur-sm border border-[#61677A]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio size={16} className="text-[#D8D9DA]" />
                    <span>Zone: </span>
                    <span className="font-bold text-[#FFF6E0]">
                      {locationRadiusPreference || "Not set"}m
                    </span>
                  </div>
                  <button
                    className="p-1 rounded-full hover:bg-[#FFF6E0]/10 transition-colors"
                    onClick={() =>
                      handleEditClick(
                        "Location Radius",
                        locationRadiusPreference,
                        "number"
                      )
                    }
                  >
                    <Edit3 size={14} className="text-[#D8D9DA]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-[#31333A]/30 backdrop-blur-sm border border-[#61677A]/50 rounded-xl shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-[#61677A]/20 blur-xl"></div>
          <div className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#FFF6E0]/10 p-2 rounded-full">
                  <User size={18} className="text-[#FFF6E0]" />
                </div>
                <h3 className="text-xl font-bold text-[#FFF6E0]">Bio</h3>
              </div>
              <button 
                className="p-1 rounded-full hover:bg-[#FFF6E0]/10 transition-colors"
                onClick={() => handleEditClick("Bio", bio?.join(", "), "text")}
              >
                <Edit3 size={16} className="text-[#FFF6E0]" />
              </button>
            </div>
            {bio && bio.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {bio.map((line, index) => (
                  <span key={index} className="bg-gradient-to-r from-[#61677A] to-[#61677A]/70 text-[#FFF6E0] px-4 py-1.5 rounded-full text-sm shadow-md">
                    {line}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-[#D8D9DA]/60">No bio available.</p>
                <button 
                  className="mt-2 bg-[#61677A]/30 hover:bg-[#61677A]/50 transition-colors text-[#FFF6E0] px-4 py-1 rounded-full text-sm"
                  onClick={() => handleEditClick("Bio", "", "text")}
                >
                  Add bio
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Location Information */}
          <div className="bg-[#31333A]/30 backdrop-blur-sm border border-[#61677A]/50 rounded-xl shadow-xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#61677A]/20 blur-xl"></div>
            <div className="p-6 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#FFF6E0]/10 p-2 rounded-full">
                  <MapPin size={18} className="text-[#FFF6E0]" />
                </div>
                <h3 className="text-xl font-bold text-[#FFF6E0]">Location</h3>
              </div>
              <div className="mt-4 text-[#D8D9DA]">
                {currentLocation ? (
                  <div className="mb-6 bg-[#31333A]/50 rounded-lg p-4 backdrop-blur-sm border border-[#61677A]/30">
                    <h4 className="font-bold text-[#FFF6E0] mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#FFF6E0] rounded-full animate-pulse"></div>
                      Current Location
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-[#D8D9DA]/60" />
                        <span className="text-[#D8D9DA]/80">Longitude:</span>
                      </div>
                      <span className="text-right text-[#FFF6E0]">{currentLocation.coordinates[0].toFixed(4)}</span>
                      
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-[#D8D9DA]/60" />
                        <span className="text-[#D8D9DA]/80">Latitude:</span>
                      </div>
                      <span className="text-right text-[#FFF6E0]">{currentLocation.coordinates[1].toFixed(4)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 mb-6 bg-[#31333A]/50 rounded-lg backdrop-blur-sm border border-[#61677A]/30">
                    <p className="text-[#D8D9DA]/60">
                      No current location data available.
                    </p>
                  </div>
                )}
                
                {previousLocation ? (
                  <div className="bg-[#31333A]/50 rounded-lg p-4 backdrop-blur-sm border border-[#61677A]/30">
                    <h4 className="font-bold text-[#FFF6E0] mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#D8D9DA] rounded-full"></div>
                      Previous Location
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-[#D8D9DA]/60" />
                        <span className="text-[#D8D9DA]/80">Longitude:</span>
                      </div>
                      <span className="text-right text-[#FFF6E0]">{previousLocation.coordinates[0].toFixed(4)}</span>
                      
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-[#D8D9DA]/60" />
                        <span className="text-[#D8D9DA]/80">Latitude:</span>
                      </div>
                      <span className="text-right text-[#FFF6E0]">{previousLocation.coordinates[1].toFixed(4)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-[#31333A]/50 rounded-lg backdrop-blur-sm border border-[#61677A]/30">
                    <p className="text-[#D8D9DA]/60">
                      No previous location data available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-[#31333A]/30 backdrop-blur-sm border border-[#61677A]/50 rounded-xl shadow-xl relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#61677A]/20 blur-xl"></div>
            <div className="p-6 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#FFF6E0]/10 p-2 rounded-full">
                  <Settings size={18} className="text-[#FFF6E0]" />
                </div>
                <h3 className="text-xl font-bold text-[#FFF6E0]">Additional Info</h3>
              </div>
              
              <div className="bg-[#31333A]/50 rounded-lg p-4 backdrop-blur-sm border border-[#61677A]/30 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-[#D8D9DA]" />
                    <span className="text-[#D8D9DA]">Role:</span>
                  </div>
                  <span className="font-bold text-[#FFF6E0] bg-[#61677A]/40 px-3 py-0.5 rounded-full text-sm">{role}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#31333A]/50 rounded-lg p-4 backdrop-blur-sm border border-[#61677A]/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-[#D8D9DA]/60" />
                    <span className="font-bold text-[#FFF6E0] text-sm">Created At</span>
                  </div>
                  <p className="text-[#D8D9DA]/80 text-sm">{formatDateTime(createdAt)}</p>
                </div>
                
                <div className="bg-[#31333A]/50 rounded-lg p-4 backdrop-blur-sm border border-[#61677A]/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-[#D8D9DA]/60" />
                    <span className="font-bold text-[#FFF6E0] text-sm">Updated At</span>
                  </div>
                  <p className="text-[#D8D9DA]/80 text-sm">{formatDateTime(updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Radio signal visual element at bottom */}
      
      </div>
    </div>
  );
};

export default ProfilePage;