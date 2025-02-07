import React, { useState } from "react";
import { Edit3, MapPin, Cake, Hash } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import UpdateField from "../componenst/UpdateField"

const ProfilePage = () => {
  const { authUser } = useAuthStore();
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-800 to-gray-800">
        <p className="text-xl font-semibold text-gray-300">Loading profile...</p>
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
    <div className="container mx-auto px-4 py-8">
      {showUpdateBox && (
        <UpdateField
          initialValue={fieldValue}
          fieldLabel={editField}
          fieldType={fieldType}
          onClose={() => setShowUpdateBox(false)}
          onUpdate={handleFieldUpdate}
        />
      )}

      {/* Improved Profile Header */}
      <div className="bg-base-200 rounded-xl shadow-xl p-6 flex flex-col md:flex-row items-center mb-8">
        <div className="avatar">
          <div className="w-40 h-40 rounded-full ring ring-primary ring-offset-2">
            <img
              src={profileImageURL || "https://via.placeholder.com/150"}
              alt="Profile"
            />
          </div>
        </div>
        <div className="mt-6 md:mt-0 md:ml-8 w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">{fullName}</h1>
            <button
              className="btn btn-ghost"
              onClick={() => handleEditClick("Full Name", fullName, "text")}
            >
              <Edit3 size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <Hash size={18} /> {uniqueTag}
          </p>
          <p className="text-gray-600 mt-2">{email}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{genderIcon}</span>
              <span>{gender}</span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => handleEditClick("Gender", gender, "text")}
            >
              <Edit3 size={16} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Cake size={18} />
              <span>{new Date(dateOfBirth).toLocaleDateString()}</span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() =>
                handleEditClick("Date of Birth", dateOfBirth, "date")
              }
            >
              <Edit3 size={16} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span>Zone:</span>
              <span className="font-bold">
                {locationRadiusPreference || "Not set"}m
              </span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() =>
                handleEditClick(
                  "Location Radius",
                  locationRadiusPreference,
                  "number"
                )
              }
            >
              <Edit3 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bio Section Without Secondary Color */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h3 className="card-title">Bio</h3>
            <button className="btn btn-ghost btn-sm">
              <Edit3 size={16} />
            </button>
          </div>
          {bio && bio.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {bio.map((line, index) => (
                <span key={index} className="badge badge-outline">
                  {line}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No bio available.</p>
          )}
        </div>
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Location Information */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title flex items-center gap-2">
              Location <MapPin />
            </h3>
            <div className="mt-2 text-sm">
              {currentLocation ? (
                <div className="mb-4">
                  <h4 className="font-bold">Current Location</h4>
                  <p>
                    Longitude: {currentLocation.coordinates[0]} <br />
                    Latitude: {currentLocation.coordinates[1]}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">
                  No current location data available.
                </p>
              )}
              {previousLocation ? (
                <div>
                  <h4 className="font-bold">Previous Location</h4>
                  <p>
                    Longitude: {previousLocation.coordinates[0]} <br />
                    Latitude: {previousLocation.coordinates[1]}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">
                  No previous location data available.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Additional Info</h3>
            <p className="mt-2">
              Role: <span className="font-bold">{role}</span>
            </p>
            <div className="mt-4 text-sm">
              <div>
                <span className="font-bold">Created At:</span>
                <p>{formatDateTime(createdAt)}</p>
              </div>
              <div className="mt-2">
                <span className="font-bold">Updated At:</span>
                <p>{formatDateTime(updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
