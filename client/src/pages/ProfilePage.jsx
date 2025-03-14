import React, { useState } from "react";
import { Edit3, MapPin, Cake, Hash, User, Globe, Clock } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import UpdateField from "../components/UpdateField"

const ProfilePage = () => {
  const { authUser, isGettingUserInfoRules, userInfoRulesData } = useAuthStore();
  const userData = authUser?.data?.user;

  const [showUpdateBox, setShowUpdateBox] = useState(false);
  const [editField, setEditField] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [fieldType, setFieldType] = useState("");

  const handleEditClick = (field, value, type) => {
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

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#272829]">
        <p className="text-xl font-semibold text-[#D8D9DA]">Loading profile...</p>
      </div>
    );
  }

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
  } = userData;

  const role = userRole === "normalUser" ? "Default User" : userRole;

  let genderIcon = "";
  if (gender === "Male") {
    genderIcon = "🚹";
  } else if (gender === "Female") {
    genderIcon = "🚺";
  } else if (gender === "Transgender") {
    genderIcon = "🏳️‍⚧️";
  } else {
    genderIcon = "🏳️‍🌈";
  }

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="min-h-screen bg-[#272829] py-8 px-4">
      {showUpdateBox && (
        <UpdateField
          initialValue={fieldValue}
          fieldLabel={editField}
          fieldType={fieldType}
          onClose={() => setShowUpdateBox(false)}
          onUpdate={handleFieldUpdate}
        />
      )}

      <div className="container mx-auto max-w-6xl">
        {/* Profile Header */}
        <div className="bg-[#272829] border border-[#61677A] rounded-xl shadow-xl p-6 flex flex-col md:flex-row items-center mb-8">
          <div className="avatar">
            <div className="w-40 h-40 rounded-full ring ring-[#61677A] ring-offset-1 ring-offset-[#272829]">
              <img
                src={profileImageURL || "https://via.placeholder.com/150"}
                alt="Profile"
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-8 w-full text-[#D8D9DA]">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-[#FFF6E0]">{fullName}</h1>
              <button
                className="p-2 rounded-full hover:bg-[#61677A]/30 transition-colors"
                onClick={() => handleEditClick("Full Name", fullName, "text")}
              >
                <Edit3 size={18} className="text-[#D8D9DA]" />
              </button>
            </div>
            <p className="text-sm text-[#D8D9DA]/60 mt-1 flex items-center gap-1">
              <Hash size={18} /> {uniqueTag}
            </p>
            <p className="text-[#D8D9DA] mt-2">{email}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{genderIcon}</span>
                <span className="text-[#D8D9DA]">{gender}</span>
              </div>
              <button
                className="p-1 rounded-full hover:bg-[#61677A]/30 transition-colors"
                onClick={() => handleEditClick("Gender", gender, "text")}
              >
                <Edit3 size={16} className="text-[#D8D9DA]" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Cake size={18} className="text-[#D8D9DA]" />
                <span>{new Date(dateOfBirth).toLocaleDateString()}</span>
              </div>
              <button
                className="p-1 rounded-full hover:bg-[#61677A]/30 transition-colors"
                onClick={() =>
                  handleEditClick("Date of Birth", dateOfBirth, "date")
                }
              >
                <Edit3 size={16} className="text-[#D8D9DA]" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <span className="text-[#D8D9DA]">Zone:</span>
                <span className="font-bold text-[#FFF6E0]">
                  {locationRadiusPreference || "Not set"}m
                </span>
              </div>
              <button
                className="p-1 rounded-full hover:bg-[#61677A]/30 transition-colors"
                onClick={() =>
                  handleEditClick(
                    "Location Radius",
                    locationRadiusPreference,
                    "number"
                  )
                }
              >
                <Edit3 size={16} className="text-[#D8D9DA]" />
              </button>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-[#272829] border border-[#61677A] rounded-xl shadow-xl mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#FFF6E0]">Bio</h3>
              <button 
                className="p-1 rounded-full hover:bg-[#61677A]/30 transition-colors"
                onClick={() => handleEditClick("Bio", bio?.join(", "), "text")}
              >
                <Edit3 size={16} className="text-[#D8D9DA]" />
              </button>
            </div>
            {bio && bio.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {bio.map((line, index) => (
                  <span key={index} className="bg-[#61677A] text-[#FFF6E0] px-3 py-1 rounded-full text-sm">
                    {line}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[#D8D9DA]/60 mt-4">No bio available.</p>
            )}
          </div>
        </div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Location Information */}
          <div className="bg-[#272829] border border-[#61677A] rounded-xl shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#FFF6E0] flex items-center gap-2">
                <MapPin className="text-[#D8D9DA]" /> Location
              </h3>
              <div className="mt-4 text-[#D8D9DA]">
                {currentLocation ? (
                  <div className="mb-6">
                    <h4 className="font-bold text-[#FFF6E0] mb-2">Current Location</h4>
                    <p className="text-[#D8D9DA]/80">
                      Longitude: {currentLocation.coordinates[0]} <br />
                      Latitude: {currentLocation.coordinates[1]}
                    </p>
                  </div>
                ) : (
                  <p className="text-[#D8D9DA]/60 mb-6">
                    No current location data available.
                  </p>
                )}
                {previousLocation ? (
                  <div>
                    <h4 className="font-bold text-[#FFF6E0] mb-2">Previous Location</h4>
                    <p className="text-[#D8D9DA]/80">
                      Longitude: {previousLocation.coordinates[0]} <br />
                      Latitude: {previousLocation.coordinates[1]}
                    </p>
                  </div>
                ) : (
                  <p className="text-[#D8D9DA]/60">
                    No previous location data available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-[#272829] border border-[#61677A] rounded-xl shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#FFF6E0]">Additional Info</h3>
              <p className="mt-4 text-[#D8D9DA]">
                Role: <span className="font-bold text-[#FFF6E0]">{role}</span>
              </p>
              <div className="mt-6 text-sm">
                <div>
                  <span className="font-bold text-[#FFF6E0]">Created At:</span>
                  <p className="text-[#D8D9DA]/80 mt-1">{formatDateTime(createdAt)}</p>
                </div>
                <div className="mt-4">
                  <span className="font-bold text-[#FFF6E0]">Updated At:</span>
                  <p className="text-[#D8D9DA]/80 mt-1">{formatDateTime(updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;