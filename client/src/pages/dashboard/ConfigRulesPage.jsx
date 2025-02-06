import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import {
  AiOutlineUser,
  AiOutlineLock,
  AiOutlineCalendar,
  AiOutlineBulb,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineCheck
} from "react-icons/ai";

function ConfigRulesPage() {
  const { authUser } = useAuthStore();
  const userId = authUser?.data?.user?._id;

  const [userInfoRulesData, setUserInfoRulesData] = useState(null);
  const [originalData, setOriginalData] = useState(null); // Store original values
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChanged, setIsChanged] = useState(false); // Track changes
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

  // New state for Bio and Gender options
  const [bioOptions, setBioOptions] = useState([]);
  const [genderList, setGenderList] = useState([]);
  // New states for inline editing and new additions
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
        setOriginalData(data); // Store original data for comparison

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

        // Set the new states from fetched data
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

  // Check if any changes were made (including bioOptions and genderList)
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

    const rulesChanged =
      JSON.stringify(configRules) !== JSON.stringify(originalConfig);
    const bioChanged =
      JSON.stringify(bioOptions) !==
      JSON.stringify(originalData?.bio?.options || []);
    const genderChanged =
      JSON.stringify(genderList) !==
      JSON.stringify(originalData?.genderList || []);

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

  // ----- Bio Options Handlers -----
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

  // ----- Gender Options Handlers -----
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
    // Filter out empty strings (although our UI prevents empty values)
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

    console.log("Data being sent to API:", updatedData);
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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-teal-500">
        User Configuration Rules
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Info */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <AiOutlineUser className="text-teal-500" />
              User Info
            </h2>
            <div className="form-control mt-4">
              <label htmlFor="minFullNameLength" className="label">
                <span className="label-text">Full Name - Min Length</span>
              </label>
              <input
                type="number"
                min="3"
                max="60"
                id="minFullNameLength"
                name="minFullNameLength"
                value={configRules.minFullNameLength}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-4">
              <label htmlFor="maxFullNameLength" className="label">
                <span className="label-text">Full Name - Max Length</span>
              </label>
              <input
                type="number"
                min="3"
                max="60"
                id="maxFullNameLength"
                name="maxFullNameLength"
                value={configRules.maxFullNameLength}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            <hr className="my-6" />
            <h2 className="card-title flex items-center gap-2">
              <AiOutlineLock className="text-teal-500" />
              Password
            </h2>
            <div className="form-control mt-4">
              <label htmlFor="minPasswordLength" className="label">
                <span className="label-text">Min Length</span>
              </label>
              <input
                type="number"
                min="3"
                max="100"
                id="minPasswordLength"
                name="minPasswordLength"
                value={configRules.minPasswordLength}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-4">
              <label className="cursor-pointer label">
                <span className="label-text">Require Upper Case</span>
                <input
                  type="checkbox"
                  name="requireUpperCase"
                  checked={configRules.requireUpperCase}
                  onChange={handleInputChange}
                  className="toggle toggle-success"
                />
              </label>
            </div>
            <div className="form-control mt-4">
              <label className="cursor-pointer label">
                <span className="label-text">Require Number</span>
                <input
                  type="checkbox"
                  name="requireNumber"
                  checked={configRules.requireNumber}
                  onChange={handleInputChange}
                  className="toggle toggle-success"
                />
              </label>
            </div>
            <div className="form-control mt-4">
              <label className="cursor-pointer label">
                <span className="label-text">Require Special Char</span>
                <input
                  type="checkbox"
                  name="requireSpecialChar"
                  checked={configRules.requireSpecialChar}
                  onChange={handleInputChange}
                  className="toggle toggle-success"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Date of Birth & Location */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <AiOutlineCalendar className="text-teal-500" />
              Date of Birth &amp; Location
            </h2>
            <div className="form-control mt-4">
              <label htmlFor="minAge" className="label">
                <span className="label-text">User Age - Min Years</span>
              </label>
              <input
                type="number"
                min="5"
                max="120"
                id="minAge"
                name="minAge"
                value={configRules.minAge}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-4">
              <label htmlFor="maxAge" className="label">
                <span className="label-text">User Age - Max Years</span>
              </label>
              <input
                type="number"
                min="5"
                max="120"
                id="maxAge"
                name="maxAge"
                value={configRules.maxAge}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            <hr className="my-6" />
            <h2 className="card-title">Location Radius</h2>
            <div className="form-control mt-4">
              <label htmlFor="minRadiusLength" className="label">
                <span className="label-text">Min Radius (m)</span>
              </label>
              <input
                type="number"
                min="1"
                id="minRadiusLength"
                name="minRadiusLength"
                value={configRules.minRadiusLength}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-4">
              <label htmlFor="maxRadiusLength" className="label">
                <span className="label-text">Max Radius (m)</span>
              </label>
              <input
                type="number"
                min="1"
                id="maxRadiusLength"
                name="maxRadiusLength"
                value={configRules.maxRadiusLength}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bio & Gender Options Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Bio Options Panel */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <AiOutlineBulb className="text-teal-500" />
              Bio Options
            </h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {bioOptions.map((option, index) =>
                editingBioIndex === index ? (
                  <input
                    key={index}
                    type="text"
                    defaultValue={option}
                    onBlur={(e) => finishEditingBio(index, e.target.value)}
                    className="input input-bordered"
                    autoFocus
                  />
                ) : (
                  <div
                    key={index}
                    className="badge badge-lg badge-secondary flex items-center gap-1 cursor-pointer"
                    onClick={() => startEditingBio(index)}
                    title="Click to edit"
                  >
                    {option}
                    <AiOutlineClose
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBioOption(index);
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                )
              )}
            </div>
            <div className="input-group mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Add new bio option"
                value={newBioOption}
                onChange={(e) => setNewBioOption(e.target.value)}
                className="input input-bordered w-full"
              />
              <button onClick={handleAddBioOption} className="btn btn-square btn-outline">
                <AiOutlineCheck size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Gender Options Panel */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <AiOutlineBulb className="text-teal-500" />
              Gender Options
            </h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {genderList.map((option, index) =>
                editingGenderIndex === index ? (
                  <input
                    key={index}
                    type="text"
                    defaultValue={option}
                    onBlur={(e) => finishEditingGender(index, e.target.value)}
                    className="input input-bordered"
                    autoFocus
                  />
                ) : (
                  <div
                    key={index}
                    className="badge badge-lg badge-accent flex items-center gap-1 cursor-pointer"
                    onClick={() => startEditingGender(index)}
                    title="Click to edit"
                  >
                    {option}
                    <AiOutlineClose
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveGender(index);
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                )
              )}
            </div>
            <div className="input-group mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Add new gender option"
                value={newGenderOption}
                onChange={(e) => setNewGenderOption(e.target.value)}
                className="input input-bordered w-full"
              />
              <button onClick={handleAddGender} className="btn btn-square btn-outline">
                <AiOutlineCheck size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isChanged && (
        <div className="mt-8 flex justify-center">
          <button onClick={handleSave} className="btn btn-primary btn-lg">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default ConfigRulesPage;
