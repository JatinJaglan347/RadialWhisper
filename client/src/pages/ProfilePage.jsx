import React, {useState} from "react";
import { Edit3, MapPin, Cake,Hash } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import UpdateField from "../componenst/UpdateField";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const userData = authUser?.data?.user;


  const [showUpdateBox, setShowUpdateBox] = useState(false);
  const [editField, setEditField] = useState("");
  const [fieldValue, setFieldValue] = useState("");
 const [fieldType, setFieldType] = useState("");
  const handleEditClick = (field, value , type) => {
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
  console.log("User Data:", userData);

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
    active,
    createdAt,
    updatedAt,
  } = userData;

let role ="";
if (userRole === "normalUser") {
  role = "Default User";
}else{
  role= userRole;
}

let genderIcon = ""; 

  if (gender === "Male") {
    genderIcon = "🚹";
  }else if (gender === "Female") {
    genderIcon = "🚺";
  }else if(gender === "Transgender"){
    genderIcon = "🏳️‍⚧️";
  }else{
    genderIcon = "🏳️‍🌈";
  }

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

   

  return (
    <div className="max-w-4xl mx-auto px-8 py-12 ">


{showUpdateBox && (

        <UpdateField
          initialValue={fieldValue}
          fieldLabel={editField}
          fieldType={fieldType}
          onClose={() => setShowUpdateBox(false)}
          onUpdate={handleFieldUpdate}
        />
      )}


      {/* Profile Header */}
      <div className="flex flex-col md:flex-row bg-gray-800 p-8 rounded-xl shadow-xl mb-8">
        {/* Profile Image */}
        <div className="flex md:justify-start justify-center items-center  md:w-auto w-full">
          <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative">
            <img
              src={profileImageURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-white/50 shadow-lg"
            />
          </div>
        </div>
        

        {/* User Info */}
        <div className="text-center md:text-left text-gray-100">
          {/* Full Name with Edit */}
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold ">{fullName}</h1>
            <button className="p-2 text-accent rounded-full  hover:text-white transition duration-300 flex items-center gap-2"
              onClick={() => handleEditClick("Full Name", fullName)}
            >
              <Edit3 size={16} />
            </button>
          </div>
          

          {/*Unique Tag */}
          <div className="flex flex-wrap justify-start gap-4 ">
            <p className="flex items-center gap-1 text-gray-400 ">
              <Hash size={18} />
              {uniqueTag}
            </p>
          </div>
          
          {/* Email */}
          <div className="flex items-center justify-start"> 
            <p className="text-gray-300 mt-3">{email}</p>
          </div>
          

          {/* Gender with Edit */}
          <div className="flex items-center justify-between">
            <p className="text-gray-400 ">{genderIcon} <span className=" text-gray-300">{gender}</span></p>
            <button className="p-2 text-accent rounded-full   hover:text-white transition duration-300 flex items-center gap-2"
              onClick={() => handleEditClick("Gender", gender , "text")}
            >
              <Edit3 size={16} />
            </button>
          </div>

          {/* Date of Birth with Edit */}
          <div className="flex items-center justify-between">
            <p className="text-gray-400 mb-1 flex justify-center items-center gap-1"><Cake size={18} /> {new Date(dateOfBirth).toLocaleDateString()}</p>
            <button className="p-2 text-accent rounded-full   hover:text-white transition duration-300 flex items-center gap-2"
              onClick={() => handleEditClick("Date of Birth", dateOfBirth , "date")}
              >
              <Edit3 size={16} />
            </button>
          </div>
        
          {/* Location Radius with Edit */}
          <div className="flex items-center justify-between ">
              <p className="font-medium text-gray-400">
              Zone: <span className=" text-gray-300">{locationRadiusPreference || "Not set"}m</span>
              </p>
              <button className="p-2 text-accent rounded-full  hover:text-white transition duration-300 flex items-center gap-2"
                onClick={() => handleEditClick("Location Radius", locationRadiusPreference , "number")}
              >
                <Edit3 size={16} />
              </button>
            </div>
          
        </div>
      </div>

      {/* Bio Section with Edit */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Bio</h2>
          <button className="p-2 text-accent rounded-full  hover:text-white transition duration-300 flex items-center gap-2">
            <Edit3 size={16} />
            
          </button>
        </div>
        {bio && bio.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {bio.map((line, index) => (
              <span
                key={index}
                className="bg-indigo-600/30 text-white text-sm font-semibold py-1 px-4 rounded-full"
              >
                {line}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No bio available.</p>
        )}
      </div>

      {/* Profile Sections */}
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-8">
        {/* Location Information */}
        <div className=" col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-100 flex items-center gap-2">Location <MapPin /></h2>

          <div className="text-gray-300">
            {/* Current Location */}
            {currentLocation ? (
              <>
                <div className=" mb-3">
                  <div className=" text-lg text-gray-300">Current</div>
                  <p className="font-medium text-gray-400">Long: {currentLocation.coordinates[0]}</p>
                  <p className="font-medium text-gray-400">Lat: {currentLocation.coordinates[1]}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No current location data available.</p>
            )}

            {/* Previous Location */}
            {previousLocation ? (
              <>
                <div className="">
                  <div className=" text-lg text-gray-300">Previous</div>
                  <p className="font-medium text-gray-400">Long: {previousLocation.coordinates[0]}</p>
                  <p className="font-medium text-gray-400">Lat: {previousLocation.coordinates[1]}</p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 mt-2">No previous location data available.</p>
            )}

            
          </div>
        </div>

        {/* Additional Info */}
        <div className="col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Additional Info</h2>
          <p className="text-gray-400">
            Role: <span className="font-semibold text-gray-300">{role}</span>
          </p>
          <div className="mt-4">
            <p className="text-gray-400 ">
              <p>Created At:</p>
              <p>{formatDateTime(createdAt)}</p> 
            </p>
            <p className="text-gray-400 mt-3">
              <p>Updated At:</p>
              <p>{formatDateTime(updatedAt)}</p> 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
