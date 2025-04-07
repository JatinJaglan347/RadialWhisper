import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import { 
  User, 
  Lock, 
  Calendar, 
  MapPin, 
  Radio, 
  Edit, 
  Plus, 
  Check, 
  X, 
  Save
} from "lucide-react";
import Loader from "../../components/Loader";

function ConfigRulesPage() {
  const { authUser } = useAuthStore();
  const userId = authUser?.data?.user?._id;

  const [userInfoRulesData, setUserInfoRulesData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [key, setKey] = useState(0);

  const [configRules, setConfigRules] = useState({
    minFullNameLength: 0,
    maxFullNameLength: 0,
    minPasswordLength: 0,
    requireUpperCase: false,
    requireNumber: false,
    requireSpecialChar: false,
    minAge: 0,
    maxAge: 0,
    minRadiusLength: 0,
    maxRadiusLength: 0,
  });

  const [bioOptions, setBioOptions] = useState([]);
  const [genderList, setGenderList] = useState([]);
  const [editingBioIndex, setEditingBioIndex] = useState(null);
  const [editingGenderIndex, setEditingGenderIndex] = useState(null);
  const [newBioOption, setNewBioOption] = useState("");
  const [newGenderOption, setNewGenderOption] = useState("");

  // Fetch user rules on mount
  useEffect(() => {
    if (!userId) return;
    const fetchUserInfoRules = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post("/api/v1/op/user-info-rules", { userId });
        const data = response.data.data;
        setUserInfoRulesData(data);
        setOriginalData(data);

        setConfigRules({
          minFullNameLength: data?.fullName?.minLength || 0,
          maxFullNameLength: data?.fullName?.maxLength || 0,
          minPasswordLength: data?.password?.minCharLength || 0,
          requireUpperCase: data?.password?.requireUpperCase || false,
          requireNumber: data?.password?.requireNumber || false,
          requireSpecialChar: data?.password?.requireSpecialChar || false,
          minAge: data?.dateOfBirth?.minAge || 0,
          maxAge: data?.dateOfBirth?.maxAge || 0,
          minRadiusLength: data?.locationRadiusPreference?.minLength || 0,
          maxRadiusLength: data?.locationRadiusPreference?.maxLength || 0,
        });

        setBioOptions(data?.bio?.options || []);
        setGenderList(data?.genderList || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfoRules();
  }, [userId, key]);

  // Check if any changes were made
  useEffect(() => {
    if (!originalData) return;

    const originalConfig = {
      minFullNameLength: originalData?.fullName?.minLength || 0,
      maxFullNameLength: originalData?.fullName?.maxLength || 0,
      minPasswordLength: originalData?.password?.minCharLength || 0,
      requireUpperCase: originalData?.password?.requireUpperCase || false,
      requireNumber: originalData?.password?.requireNumber || false,
      requireSpecialChar: originalData?.password?.requireSpecialChar || false,
      minAge: originalData?.dateOfBirth?.minAge || 0,
      maxAge: originalData?.dateOfBirth?.maxAge || 0,
      minRadiusLength: originalData?.locationRadiusPreference?.minLength || 0,
      maxRadiusLength: originalData?.locationRadiusPreference?.maxLength || 0,
    };

    const rulesChanged = JSON.stringify(configRules) !== JSON.stringify(originalConfig);
    const bioChanged = JSON.stringify(bioOptions) !== JSON.stringify(originalData?.bio?.options || []);
    const genderChanged = JSON.stringify(genderList) !== JSON.stringify(originalData?.genderList || []);

    setIsChanged(rulesChanged || bioChanged || genderChanged);
  }, [configRules, originalData, bioOptions, genderList]);

  // Handle input changes for numeric and checkbox fields
  const handleInputChange = (e) => {
    const { name, value, type, checked, min, max } = e.target;
    let newValue = type === "checkbox" ? checked : Number(value);

    if (type !== "checkbox" && newValue < 0) {
      toast.error(`${name} cannot be negative.`);
      return;
    }
    if (min && newValue < Number(min)) {
      toast.error(`${name} cannot be less than ${min}.`);
      return;
    }
    if (max && newValue > Number(max)) {
      toast.error(`${name} cannot be more than ${max}.`);
      return;
    }
    if (name === "minFullNameLength" && newValue > configRules.maxFullNameLength) {
      toast.error("Min Full Name Length cannot exceed Max Full Name Length.");
      return;
    }
    if (name === "maxFullNameLength" && newValue < configRules.minFullNameLength) {
      toast.error("Max Full Name Length cannot be less than Min Full Name Length.");
      return;
    }
    if (name === "minPasswordLength" && newValue > configRules.maxPasswordLength) {
      toast.error("Min Password Length cannot exceed Max Password Length.");
      return;
    }
    if (name === "minAge" && newValue > configRules.maxAge) {
      toast.error("Min Age cannot be greater than Max Age.");
      return;
    }
    if (name === "maxAge" && newValue < configRules.minAge) {
      toast.error("Max Age cannot be less than Min Age.");
      return;
    }
    if (name === "minRadiusLength" && newValue > configRules.maxRadiusLength) {
      toast.error("Min Radius cannot be greater than Max Radius.");
      return;
    }
    if (name === "maxRadiusLength" && newValue < configRules.minRadiusLength) {
      toast.error("Max Radius cannot be less than Min Radius.");
      return;
    }

    setConfigRules((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Bio Options Handlers
  const startEditingBio = (index) => setEditingBioIndex(index);
  const finishEditingBio = (index, value) => {
    if (!value.trim()) {
      toast.error("Bio option cannot be empty.");
      return;
    }
    const newOptions = [...bioOptions];
    newOptions[index] = value;
    setBioOptions(newOptions);
    setEditingBioIndex(null);
  };

  const handleAddBioOption = () => {
    if (!newBioOption.trim()) {
      toast.error("New bio option cannot be empty.");
      return;
    }
    setBioOptions((prev) => [...prev, newBioOption.trim()]);
    setNewBioOption("");
  };

  const handleRemoveBioOption = (index) => {
    const newOptions = bioOptions.filter((_, i) => i !== index);
    setBioOptions(newOptions);
  };

  // Gender Options Handlers
  const startEditingGender = (index) => setEditingGenderIndex(index);
  const finishEditingGender = (index, value) => {
    if (!value.trim()) {
      toast.error("Gender option cannot be empty.");
      return;
    }
    const newList = [...genderList];
    newList[index] = value;
    setGenderList(newList);
    setEditingGenderIndex(null);
  };

  const handleAddGender = () => {
    if (!newGenderOption.trim()) {
      toast.error("New gender option cannot be empty.");
      return;
    }
    setGenderList((prev) => [...prev, newGenderOption.trim()]);
    setNewGenderOption("");
  };

  const handleRemoveGender = (index) => {
    const newList = genderList.filter((_, i) => i !== index);
    setGenderList(newList);
  };

  // Handle Save
  const handleSave = async () => {
    const filteredBioOptions = bioOptions.filter((option) => option.trim() !== "");
    const filteredGenderList = genderList.filter((gender) => gender.trim() !== "");

    const updatedData = {};

    if (configRules.minFullNameLength !== originalData?.fullName?.minLength) {
      updatedData.fullName = {
        ...updatedData.fullName,
        minLength: configRules.minFullNameLength,
      };
    }
    if (configRules.maxFullNameLength !== originalData?.fullName?.maxLength) {
      updatedData.fullName = {
        ...updatedData.fullName,
        maxLength: configRules.maxFullNameLength,
      };
    }
    if (configRules.minPasswordLength !== originalData?.password?.minCharLength) {
      updatedData.password = {
        ...updatedData.password,
        minCharLength: configRules.minPasswordLength,
      };
    }
    if (configRules.requireUpperCase !== originalData?.password?.requireUpperCase) {
      updatedData.password = {
        ...updatedData.password,
        requireUpperCase: configRules.requireUpperCase,
      };
    }
    if (configRules.requireNumber !== originalData?.password?.requireNumber) {
      updatedData.password = {
        ...updatedData.password,
        requireNumber: configRules.requireNumber,
      };
    }
    if (configRules.requireSpecialChar !== originalData?.password?.requireSpecialChar) {
      updatedData.password = {
        ...updatedData.password,
        requireSpecialChar: configRules.requireSpecialChar,
      };
    }
    if (configRules.minAge !== originalData?.dateOfBirth?.minAge) {
      updatedData.dateOfBirth = {
        ...updatedData.dateOfBirth,
        minAge: configRules.minAge,
      };
    }
    if (configRules.maxAge !== originalData?.dateOfBirth?.maxAge) {
      updatedData.dateOfBirth = {
        ...updatedData.dateOfBirth,
        maxAge: configRules.maxAge,
      };
    }
    if (configRules.minRadiusLength !== originalData?.locationRadiusPreference?.minLength) {
      updatedData.locationRadiusPreference = {
        ...updatedData.locationRadiusPreference,
        minLength: configRules.minRadiusLength,
      };
    }
    if (configRules.maxRadiusLength !== originalData?.locationRadiusPreference?.maxLength) {
      updatedData.locationRadiusPreference = {
        ...updatedData.locationRadiusPreference,
        maxLength: configRules.maxRadiusLength,
      };
    }
    if (
      JSON.stringify(filteredBioOptions) !==
      JSON.stringify((originalData?.bio?.options || []).filter((o) => o.trim() !== ""))
    ) {
      updatedData.bio = { options: filteredBioOptions };
    }
    if (
      JSON.stringify(filteredGenderList) !==
      JSON.stringify((originalData?.genderList || []).filter((g) => g.trim() !== ""))
    ) {
      updatedData.genderList = filteredGenderList;
    }

    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes to save.");
      return;
    }

    try {
      await axiosInstance.patch("/api/v1/op/update-user-info-rules", {
        userId,
        ...updatedData,
      });

      toast.success("Rules updated successfully");
      setOriginalData((prev) => ({
        ...prev,
        fullName: {
          minLength: configRules.minFullNameLength,
          maxLength: configRules.maxFullNameLength,
        },
        password: {
          minCharLength: configRules.minPasswordLength,
          requireUpperCase: configRules.requireUpperCase,
          requireNumber: configRules.requireNumber,
          requireSpecialChar: configRules.requireSpecialChar,
        },
        dateOfBirth: {
          minAge: configRules.minAge,
          maxAge: configRules.maxAge,
        },
        locationRadiusPreference: {
          minLength: configRules.minRadiusLength,
          maxLength: configRules.maxRadiusLength,
        },
        bio: { options: filteredBioOptions },
        genderList: filteredGenderList,
      }));
      setIsChanged(false);
      setKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating rules:", error);
      toast.error("Failed to update rules.");
    }
  };

  // Show loader while fetching data
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#272829] text-[#FFF6E0] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#272829] opacity-80"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
      </div>
      
      {/* Animated floating orbs */}
      {/* <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-[#61677A] blur-[100px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-[#61677A] blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute top-20 left-1/4 w-40 h-40 rounded-full bg-[#FFF6E0] blur-[80px] opacity-10 animate-pulse"></div> */}
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto p-6 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full">
            <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-6 py-2 rounded-full text-lg font-medium flex items-center">
              <Radio size={20} className="mr-2" />
              Configuration Rules
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-10">
          <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">User Settings Configuration</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Info */}
          <div className="bg-[#31333A]/80 rounded-2xl backdrop-blur-sm border border-[#61677A]/30 shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <User className="mr-3 h-5 w-5 text-[#FFF6E0]" />
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">User Info</span>
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="minFullNameLength" className="block text-[#D8D9DA] text-sm">
                  Full Name - Min Length
                </label>
                <input
                  type="number"
                  min="3"
                  max="60"
                  id="minFullNameLength"
                  name="minFullNameLength"
                  value={configRules.minFullNameLength}
                  onChange={handleInputChange}
                  className="w-full bg-[#272829]/80 border border-[#61677A]/50 rounded-lg px-4 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxFullNameLength" className="block text-[#D8D9DA] text-sm">
                  Full Name - Max Length
                </label>
                <input
                  type="number"
                  min="3"
                  max="60"
                  id="maxFullNameLength"
                  name="maxFullNameLength"
                  value={configRules.maxFullNameLength}
                  onChange={handleInputChange}
                  className="w-full bg-[#272829]/80 border border-[#61677A]/50 rounded-lg px-4 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
                />
              </div>
            </div>
            
            <div className="my-8 border-t border-[#61677A]/30"></div>
            
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Lock className="mr-3 h-5 w-5 text-[#FFF6E0]" />
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Password</span>
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="minPasswordLength" className="block text-[#D8D9DA] text-sm">
                  Min Length
                </label>
                <input
                  type="number"
                  min="3"
                  max="100"
                  id="minPasswordLength"
                  name="minPasswordLength"
                  value={configRules.minPasswordLength}
                  onChange={handleInputChange}
                  className="w-full bg-[#272829]/80 border border-[#61677A]/50 rounded-lg px-4 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
                />
              </div>
              
              <div className="flex items-center justify-between px-1">
                <span className="text-[#D8D9DA] text-sm">Require Upper Case</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="requireUpperCase"
                    checked={configRules.requireUpperCase}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#272829] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D8D9DA] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFF6E0]/30"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between px-1">
                <span className="text-[#D8D9DA] text-sm">Require Number</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="requireNumber"
                    checked={configRules.requireNumber}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#272829] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D8D9DA] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFF6E0]/30"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between px-1">
                <span className="text-[#D8D9DA] text-sm">Require Special Char</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="requireSpecialChar"
                    checked={configRules.requireSpecialChar}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#272829] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D8D9DA] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFF6E0]/30"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Date of Birth & Location */}
          <div className="bg-[#31333A]/80 rounded-2xl backdrop-blur-sm border border-[#61677A]/30 shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Calendar className="mr-3 h-5 w-5 text-[#FFF6E0]" />
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Date of Birth &amp; Location</span>
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="minAge" className="block text-[#D8D9DA] text-sm">
                  User Age - Min Years
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  id="minAge"
                  name="minAge"
                  value={configRules.minAge}
                  onChange={handleInputChange}
                  className="w-full bg-[#272829]/80 border border-[#61677A]/50 rounded-lg px-4 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxAge" className="block text-[#D8D9DA] text-sm">
                  User Age - Max Years
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  id="maxAge"
                  name="maxAge"
                  value={configRules.maxAge}
                  onChange={handleInputChange}
                  className="w-full bg-[#272829]/80 border border-[#61677A]/50 rounded-lg px-4 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
                />
              </div>
            </div>
            
            <div className="my-8 border-t border-[#61677A]/30"></div>
            
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <MapPin className="mr-3 h-5 w-5 text-[#FFF6E0]" />
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Location Radius</span>
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="minRadiusLength" className="block text-[#D8D9DA] text-sm">
                  Min Radius (m)
                </label>
                <input
                  type="number"
                  min="1"
                  id="minRadiusLength"
                  name="minRadiusLength"
                  value={configRules.minRadiusLength}
                  onChange={handleInputChange}
                  className="w-full bg-[#272829]/80 border border-[#61677A]/50 rounded-lg px-4 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxRadiusLength" className="block text-[#D8D9DA] text-sm">
                  Max Radius (m)
                </label>
                <input
                  type="number"
                  min="1"
                  id="maxRadiusLength"
                  name="maxRadiusLength"
                  value={configRules.maxRadiusLength}
                  onChange={handleInputChange}
                  className="w-full bg-[#272829]/80 border border-[#61677A]/50 rounded-lg px-4 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Gender Options Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Bio Options Panel */}
          <div className="bg-[#31333A]/80 rounded-2xl backdrop-blur-sm border border-[#61677A]/30 shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Radio className="mr-3 h-5 w-5 text-[#FFF6E0]" />
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Bio Options</span>
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {bioOptions.map((option, index) =>
                editingBioIndex === index ? (
                  <input
                    key={index}
                    type="text"
                    defaultValue={option}
                    onBlur={(e) => finishEditingBio(index, e.target.value)}
                    className="bg-[#272829]/80 border border-[#61677A]/50 rounded-lg px-3 py-1 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
                    autoFocus
                  />
                ) : (
                  <div
                    key={index}
                    className="bg-[#61677A]/40 px-3 py-1 rounded-full flex items-center gap-2 cursor-pointer group transition-all hover:bg-[#61677A]/60"
                    onClick={() => startEditingBio(index)}
                  >
                    <span className="text-[#FFF6E0]">{option}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBioOption(index);
                      }}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-[#FFF6E0]" />
                    </button>
                  </div>
                )
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new bio option"
                value={newBioOption}
                onChange={(e) => setNewBioOption(e.target.value)}
                className="w-full bg-[#272829]/80 border border-[#61677A]/50 rounded-lg px-4 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
              />
              <button
                onClick={handleAddBioOption}
                className="bg-[#FFF6E0]/10 hover:bg-[#FFF6E0]/20 text-[#FFF6E0] rounded-lg px-3 transition-colors flex items-center justify-center"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Gender Options Panel */}
          <div className="bg-[#31333A]/80 rounded-2xl backdrop-blur-sm border border-[#61677A]/30 shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Radio className="mr-3 h-5 w-5 text-[#FFF6E0]" />
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Gender Options</span>
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {genderList.map((option, index) =>
                editingGenderIndex === index ? (
                  <input
                    key={index}
                    type="text"
                    defaultValue={option}
                    onBlur={(e) => finishEditingGender(index, e.target.value)}
                    className="bg-[#272829]/80 border border-[#61677A]/50 rounded-lg px-3 py-1 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
                    autoFocus
                  />
                ) : (
                  <div
                    key={index}
                    className="bg-[#61677A]/40 px-3 py-1 rounded-full flex items-center gap-2 cursor-pointer group transition-all hover:bg-[#61677A]/60"
                    onClick={() => startEditingGender(index)}
                  >
                    <span className="text-[#FFF6E0]">{option}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveGender(index);
                      }}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-[#FFF6E0]" />
                    </button>
                  </div>
                )
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new gender option"
                value={newGenderOption}
                onChange={(e) => setNewGenderOption(e.target.value)}
                className="w-full bg-[#272829]/80 border border-[#61677A]/50 rounded-lg px-4 py-2 text-[#FFF6E0] focus:outline-none focus:ring-2 focus:ring-[#FFF6E0]/30"
              />
              <button
                onClick={handleAddGender}
                className="bg-[#FFF6E0]/10 hover:bg-[#FFF6E0]/20 text-[#FFF6E0] rounded-lg px-3 transition-colors flex items-center justify-center"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isChanged && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={handleSave} 
              className="bg-gradient-to-r from-[#FFF6E0]/20 to-[#D8D9DA]/20 hover:from-[#FFF6E0]/30 hover:to-[#D8D9DA]/30 px-6 py-3 rounded-xl text-[#FFF6E0] font-medium transition-all shadow-lg flex items-center gap-2"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfigRulesPage;