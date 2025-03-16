import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { X, Info } from "lucide-react";

const UpdateField = ({ initialValue, fieldLabel, fieldType, onClose, onUpdate }) => {
  const { userInfoRules, fetchUserInfoRules } = useAuthStore();
  const [value, setValue] = useState(initialValue || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(!userInfoRules);
  
  // Fetch user info rules when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!userInfoRules) {
        setIsLoading(true);
        try {
          // Get the userId from the store
          const userId = useAuthStore.getState().authUser?.data?.user?._id;
          if (userId) {
            await fetchUserInfoRules(userId);
          }
        } catch (error) {
          console.error("Error fetching user info rules:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [fetchUserInfoRules, userInfoRules]);
  
  // Set initial value when the component mounts
  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);
  
  // Convert fieldLabel to a key that matches userInfoRules structure
  const getFieldKey = (label) => {
    if (label === "Full Name") return "fullName";
    if (label === "Gender") return "gender";
    if (label === "Date of Birth") return "dateOfBirth";
    if (label === "Bio") return "bio";
    if (label === "Location Radius") return "locationRadiusPreference";
    return label.toLowerCase().replace(/\s+/g, "");
  };
  
  const fieldKey = getFieldKey(fieldLabel);
  const rules = userInfoRules?.[fieldKey];

  // Handle validation based on field type and rules
  const validateField = () => {
    if (!rules) return true;
    
    if (fieldKey === "fullName") {
      if (value.length < rules.minLength) {
        setErrorMessage(`Name must be at least ${rules.minLength} characters`);
        return false;
      }
      if (value.length > rules.maxLength) {
        setErrorMessage(`Name cannot exceed ${rules.maxLength} characters`);
        return false;
      }
    } else if (fieldKey === "locationRadiusPreference") {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        setErrorMessage("Please enter a valid number");
        return false;
      }
      if (numValue < rules.minLength) {
        setErrorMessage(`Radius must be at least ${rules.minLength}m`);
        return false;
      }
      if (numValue > rules.maxLength) {
        setErrorMessage(`Radius cannot exceed ${rules.maxLength}m`);
        return false;
      }
    } else if (fieldKey === "dateOfBirth") {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < rules.minAge) {
        setErrorMessage(`You must be at least ${rules.minAge} years old`);
        return false;
      }
      if (age > rules.maxAge) {
        setErrorMessage(`Age cannot exceed ${rules.maxAge} years`);
        return false;
      }
    } else if (fieldKey === "bio") {
      const bioArray = value ? value.split(", ").filter(Boolean) : [];
      if (bioArray.length > rules.selectionLimit) {
        setErrorMessage(`You can select up to ${rules.selectionLimit} interests`);
        return false;
      }
    }
    
    setErrorMessage("");
    return true;
  };

  const handleSubmit = () => {
    if (validateField()) {
      // Create an object with the field name and its new value
      const updatedData = {
        field: fieldKey,
        value: fieldKey === "bio" ? value.split(", ").filter(Boolean) : value,
      };
      
      console.log("Data being sent to API:", updatedData);
      
      // Then continue with the existing update logic
      onUpdate(value);
      onClose();
    }
  };
  
  // Render field constraints based on the field type
  const renderConstraints = () => {
    if (!rules) return null;
    
    if (fieldKey === "fullName") {
      return (
        <div className="mt-2 text-[#D8D9DA]/60 text-sm flex items-start gap-2">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>Name must be between {rules.minLength} and {rules.maxLength} characters</span>
        </div>
      );
    } else if (fieldKey === "locationRadiusPreference") {
      return (
        <div className="mt-2 text-[#D8D9DA]/60 text-sm flex items-start gap-2">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>Radius must be between {rules.minLength}m and {rules.maxLength}m</span>
        </div>
      );
    } else if (fieldKey === "dateOfBirth") {
      return (
        <div className="mt-2 text-[#D8D9DA]/60 text-sm flex items-start gap-2">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>Age must be between {rules.minAge} and {rules.maxAge} years</span>
        </div>
      );
    } else if (fieldKey === "bio") {
      return (
        <div className="mt-2 text-[#D8D9DA]/60 text-sm flex items-start gap-2">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>You can select up to {rules.selectionLimit} interests</span>
        </div>
      );
    }
    
    return null;
  };
  
  // Different input types based on fieldLabel and fieldType
  const renderInput = () => {
    // Show loading state if data is being fetched
    if (isLoading) {
      return (
        <div className="w-full p-3 bg-[#31333A] rounded-lg border border-[#61677A] text-[#D8D9DA] flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-[#FFF6E0] border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading options...
        </div>
      );
    }
    
    // Special handling for Gender field
    if (fieldLabel === "Gender" || fieldType === "select") {
      // Check if genderList exists in userInfoRules
      const genderOptions = userInfoRules?.genderList;
      
      if (Array.isArray(genderOptions) && genderOptions.length > 0) {
        return (
          <select
            className="w-full p-3 bg-[#31333A] rounded-lg border border-[#61677A] text-[#D8D9DA] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0] focus:border-transparent"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            <option value="">Select gender</option>
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      }
    } 
    // Special handling for Bio field
    else if (fieldLabel === "Bio" && userInfoRules?.bio?.options) {
      const bioArray = value ? value.split(", ").filter(Boolean) : [];
      const selectionLimit = userInfoRules.bio.selectionLimit;
      
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {bioArray.map((item, index) => (
              <div key={index} className="bg-[#61677A] text-[#FFF6E0] px-3 py-1 rounded-full text-sm flex items-center">
                {item}
                <button 
                  className="ml-2 hover:text-red-300"
                  onClick={() => {
                    const newBio = [...bioArray];
                    newBio.splice(index, 1);
                    setValue(newBio.join(", "));
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          
          <select
            className="w-full p-3 bg-[#31333A] rounded-lg border border-[#61677A] text-[#D8D9DA] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0] focus:border-transparent"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                const newBio = [...bioArray];
                if (!newBio.includes(e.target.value) && newBio.length < selectionLimit) {
                  newBio.push(e.target.value);
                  setValue(newBio.join(", "));
                }
              }
            }}
            disabled={bioArray.length >= selectionLimit}
          >
            <option value="">Select interests</option>
            {userInfoRules.bio.options.map((option) => (
              <option key={option} value={option} disabled={bioArray.includes(option)}>
                {option}
              </option>
            ))}
          </select>
          
          <div className="text-[#D8D9DA]/60 text-sm">
            {bioArray.length}/{selectionLimit} selected
          </div>
        </div>
      );
    } 
    // Date input
    else if (fieldType === "date") {
      return (
        <input
          type="date"
          className="w-full p-3 bg-[#31333A] rounded-lg border border-[#61677A] text-[#D8D9DA] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0] focus:border-transparent"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    } 
    // Number input
    else if (fieldType === "number") {
      const min = rules?.minLength;
      const max = rules?.maxLength;
      
      return (
        <input
          type="number"
          className="w-full p-3 bg-[#31333A] rounded-lg border border-[#61677A] text-[#D8D9DA] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0] focus:border-transparent"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min={min}
          max={max}
        />
      );
    } 
    // Default text input
    else {
      return (
        <input
          type="text"
          className="w-full p-3 bg-[#31333A] rounded-lg border border-[#61677A] text-[#D8D9DA] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0] focus:border-transparent"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={rules?.maxLength}
        />
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-[#272829] p-6 rounded-xl shadow-xl w-full max-w-md border border-[#61677A]/50">
        {/* Background effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#61677A]/20 blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#61677A]/20 blur-xl"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#FFF6E0]">Update {fieldLabel}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#61677A]/30"
            >
              <X size={20} className="text-[#D8D9DA]" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[#D8D9DA] mb-2">{fieldLabel}:</label>
              {renderInput()}
              {renderConstraints()}
              {errorMessage && (
                <p className="mt-2 text-red-400 text-sm">{errorMessage}</p>
              )}
            </div>
            
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#31333A] text-[#D8D9DA] rounded-lg hover:bg-[#61677A]/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-gradient-to-r from-[#61677A] to-[#61677A]/70 text-[#FFF6E0] rounded-lg hover:opacity-90 transition-opacity"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateField;