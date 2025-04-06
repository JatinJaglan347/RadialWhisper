import React, { useState, useEffect } from 'react';
import { 
  User, 
  X, 
  Save, 
  Edit, 
  Mail,
  Calendar, 
  Tag, 
  Clock, 
  Shield, 
  CheckCircle, 
  UserX, 
  Key, 
  Pencil,
  Trash2,
  Info,
  ShieldAlert,
  Globe,
  UserCheck,
  ChevronRight,
  FileText,
  Settings,
  MapPin,
  AlertTriangle,
  Activity,
  LogOut,
  Eye
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with the correct backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500/api/v1',
  withCredentials: true
});

// Function to ensure all fields are displayed in JSON
const replacer = (key, value) => {
  // Convert undefined to null to ensure it appears in JSON
  if (value === undefined) {
    return null;
  }
  return value;
};

const OverlordUserInfo = ({ userId, isOpen, onClose, onUpdate }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [showPassword, setShowPassword] = useState(false);

  // Get user details
  const getUserDetails = async () => {
    if (!userId) {
      toast.error('No user selected');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/v1/overlord/user-details', {
        userId: userId
      });
      
      const userData = response.data.data;
      
      // No need to flatten the structure anymore since we're using the actual nested structure
      // Just make a deep copy to avoid reference issues
      const editableUserData = JSON.parse(JSON.stringify(userData));
      
      // Ensure the banned structure exists for safety
      if (!editableUserData.banned) {
        editableUserData.banned = {
          current: {
            status: false,
            reason: "",
            date: new Date()
          },
          history: []
        };
      }
      
      setUserData(userData);
      setEditedData(editableUserData);
      toast.success('User data retrieved');
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  // Save edited user data
  const saveUserData = async (customData = null) => {
    if (!userId) {
      toast.error('No user selected');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = customData || editedData;
      
      const response = await api.post('/api/v1/overlord/edit-user', {
        userId: userId,
        fieldData: dataToSend
      });
      
      setUserData(response.data.data.user);
      setEditedData(response.data.data.user);
      setEditMode(false);
      toast.success('User data updated successfully');
      
      if (onUpdate) {
        onUpdate(response.data.data.user);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for simple fields
  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested object changes
  const handleNestedChange = (parent, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [field]: value
      }
    }));
  };

  // Handle deeply nested changes using dot notation
  const handleDotNotationChange = (path, value) => {
    setEditedData(prev => {
      // Create a copy of the previous state
      const newData = { ...prev };
      
      // Split the path into parts
      const parts = path.split('.');
      
      // Navigate to the object
      let current = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      
      // Set the value
      current[parts[parts.length - 1]] = value;
      
      return newData;
    });
  };

  // Reset edited data
  const cancelEdit = () => {
    setEditedData(userData);
    setEditMode(false);
  };

  // Parse ISO date string to YYYY-MM-DD format
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Load user data when component mounts or becomes visible
  useEffect(() => {
    if (userId && isOpen) {
      getUserDetails();
    }
  }, [userId, isOpen]);

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-gradient-to-br from-[#1A1B1F] to-[#25272E] rounded-xl border border-red-900/20 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#1A1B1F] border-b border-red-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#272829] rounded-lg">
              <User className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#FFF6E0]">
                {userData?.fullName || 'User Details'}
              </h2>
              <p className="text-[#FFF6E0]/70 text-sm">
                {userData?.email || 'Loading...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditedData(userData);
                  }}
                  className="p-2 hover:bg-[#272829] rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-[#FFF6E0]/70" />
                </button>
                <button
                  onClick={() => saveUserData()}
                  disabled={loading}
                  className="flex items-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#272829] rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-[#FFF6E0]/70" />
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
        
        {/* Content area */}
        {!loading && userData && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left sidebar - Sections */}
            <div className="space-y-3">
              <button
                onClick={() => setActiveSection('basic')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between ${
                  activeSection === 'basic' ? 'bg-purple-900/30 border border-purple-500/30' : 'hover:bg-[#272829]'
                } transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-purple-400" />
                  <span>Basic Information</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#FFF6E0]/70" />
              </button>
              
              <button
                onClick={() => setActiveSection('location')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between ${
                  activeSection === 'location' ? 'bg-purple-900/30 border border-purple-500/30' : 'hover:bg-[#272829]'
                } transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <span>Location Data</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#FFF6E0]/70" />
              </button>
              
              <button
                onClick={() => setActiveSection('account')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between ${
                  activeSection === 'account' ? 'bg-purple-900/30 border border-purple-500/30' : 'hover:bg-[#272829]'
                } transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span>Account Status</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#FFF6E0]/70" />
              </button>
              
              <button
                onClick={() => setActiveSection('sessions')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between ${
                  activeSection === 'sessions' ? 'bg-purple-900/30 border border-purple-500/30' : 'hover:bg-[#272829]'
                } transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-yellow-400" />
                  <span>Active Sessions</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#FFF6E0]/70" />
              </button>
              
              <button
                onClick={() => setActiveSection('advanced')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between ${
                  activeSection === 'advanced' ? 'bg-purple-900/30 border border-purple-500/30' : 'hover:bg-[#272829]'
                } transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-red-400" />
                  <span>Advanced Settings</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#FFF6E0]/70" />
              </button>
              
              <button
                onClick={() => setActiveSection('raw')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between ${
                  activeSection === 'raw' ? 'bg-purple-900/30 border border-purple-500/30' : 'hover:bg-[#272829]'
                } transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span>Raw Data</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#FFF6E0]/70" />
              </button>
            </div>
            
            {/* Main content area */}
            <div className="md:col-span-2">
              {/* Basic Information Section */}
              {activeSection === 'basic' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold border-b border-red-900/20 pb-2">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Full Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="fullName"
                          value={editedData.fullName || ''}
                          onChange={(e) => handleChange('fullName', e.target.value)}
                          className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                        />
                      ) : (
                        <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                          {userData.fullName || 'Not set'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Email</label>
                      {editMode ? (
                        <input
                          type="email"
                          name="email"
                          value={editedData.email || ''}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                        />
                      ) : (
                        <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                          {userData.email || 'Not set'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Unique Tag</label>
                      <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                        {userData.uniqueTag || 'Not set'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Gender</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="gender"
                          value={editedData.gender || ''}
                          onChange={(e) => handleChange('gender', e.target.value)}
                          className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                        />
                      ) : (
                        <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                          {userData.gender || 'Not specified'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Date of Birth</label>
                      {editMode ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formatDateForInput(editedData.dateOfBirth)}
                          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                          className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                        />
                      ) : (
                        <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                          {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not set'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">User ID</label>
                      <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 text-sm">
                        {userData._id || 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Location Data Section */}
              {activeSection === 'location' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold border-b border-red-900/20 pb-2">Location Data</h3>
                  
                  {/* Current Location */}
                  <div className="space-y-2">
                    <label className="block text-sm text-[#FFF6E0]/70">Current Location</label>
                    <div className="p-3 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                      {userData.currentLocation?.coordinates?.length === 2 ? (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-[#FFF6E0]/70">Longitude:</span>
                            <span>{userData.currentLocation.coordinates[0]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#FFF6E0]/70">Latitude:</span>
                            <span>{userData.currentLocation.coordinates[1]}</span>
                          </div>
                          <div className="mt-2">
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${userData.currentLocation.coordinates[1]},${userData.currentLocation.coordinates[0]}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                            >
                              <Globe className="h-4 w-4" />
                              <span>View on Google Maps</span>
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[#FFF6E0]/50">No current location data</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Location Radius Preference */}
                  <div className="space-y-2">
                    <label className="block text-sm text-[#FFF6E0]/70">Location Radius Preference (meters)</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={editedData.locationRadiusPreference || 0}
                        onChange={(e) => handleChange('locationRadiusPreference', parseInt(e.target.value))}
                        className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                      />
                    ) : (
                      <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                        {userData.locationRadiusPreference || 0}
                      </p>
                    )}
                  </div>
                  
                  {/* Location Updated At */}
                  <div className="space-y-2">
                    <label className="block text-sm text-[#FFF6E0]/70">Location Last Updated</label>
                    <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                      {userData.locationUpdatedAt ? new Date(userData.locationUpdatedAt).toLocaleString() : 'Never updated'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Account Status Section */}
              {activeSection === 'account' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold border-b border-red-900/20 pb-2">Account Status</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">User Role</label>
                      {editMode ? (
                        <select
                          name="userRole"
                          value={editedData.userRole || 'normalUser'}
                          onChange={(e) => handleChange('userRole', e.target.value)}
                          className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                        >
                          <option value="normalUser">User</option>
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                          <option value="king">King</option>
                        </select>
                      ) : (
                        <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                          {userData.userRole || 'normalUser'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Account Status</label>
                      {editMode ? (
                        <div className="space-y-2">
                          <select
                            name="banned.current.status"
                            value={editedData.banned?.current?.status ? 'true' : 'false'}
                            onChange={(e) => handleDotNotationChange('banned.current.status', e.target.value === 'true')}
                            className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                          >
                            <option value="false">Active</option>
                            <option value="true">Banned</option>
                          </select>
                          
                          {editedData.banned?.current?.status && (
                            <div className="mt-2">
                              <label className="block text-sm text-[#FFF6E0]/70 mb-1">Ban Reason</label>
                              <textarea
                                name="banned.current.reason"
                                value={editedData.banned?.current?.reason || ''}
                                onChange={(e) => handleDotNotationChange('banned.current.reason', e.target.value)}
                                rows="3"
                                className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                                placeholder="Enter reason for ban..."
                              ></textarea>
                              
                              <p className="text-xs text-[#FFF6E0]/50 mt-1">
                                This ban reason will be added to the user's ban history
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className={`p-2 rounded-lg ${userData.banned?.current?.status ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'} border border-red-900/20 flex-1`}>
                            {userData.banned?.current?.status ? 'Banned' : 'Active'}
                          </p>
                          {userData.banned?.current?.status ? (
                            <button
                              onClick={() => {
                                // Create a deep copy of the current user data
                                const updatedData = JSON.parse(JSON.stringify(userData));
                                
                                // Update ban status
                                if (!updatedData.banned) updatedData.banned = { current: {}, history: [] };
                                updatedData.banned.current.status = false;
                                updatedData.banned.current.reason = "Unbanned by admin";
                                updatedData.banned.current.date = new Date();
                                
                                // Add to history
                                if (!Array.isArray(updatedData.banned.history)) {
                                  updatedData.banned.history = [];
                                }
                                updatedData.banned.history.push({
                                  status: false,
                                  reason: "Unbanned by admin",
                                  date: new Date()
                                });
                                
                                setEditedData(updatedData);
                                
                                // Save changes immediately
                                saveUserData(updatedData);
                              }}
                              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                // Create a deep copy of the current user data
                                const updatedData = JSON.parse(JSON.stringify(userData));
                                
                                // Update ban status
                                if (!updatedData.banned) updatedData.banned = { current: {}, history: [] };
                                updatedData.banned.current.status = true;
                                updatedData.banned.current.reason = "Banned by admin";
                                updatedData.banned.current.date = new Date();
                                
                                // Add to history
                                if (!Array.isArray(updatedData.banned.history)) {
                                  updatedData.banned.history = [];
                                }
                                updatedData.banned.history.push({
                                  status: true,
                                  reason: "Banned by admin",
                                  date: new Date()
                                });
                                
                                setEditedData(updatedData);
                                
                                // Save changes immediately
                                saveUserData(updatedData);
                              }}
                              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
                            >
                              Ban
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {userData.banned?.current?.status && (
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm text-[#FFF6E0]/70">Ban Reason</label>
                        <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                          {userData.banned?.current?.reason || 'No reason provided'}
                        </p>
                        {userData.banned?.current?.date && (
                          <p className="text-xs text-[#FFF6E0]/50">
                            Banned on: {new Date(userData.banned.current.date).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Email Verified</label>
                      {editMode ? (
                        <select
                          name="emailVerified"
                          value={editedData.emailVerified ? 'true' : 'false'}
                          onChange={(e) => setEditedData({
                            ...editedData,
                            emailVerified: e.target.value === 'true'
                          })}
                          className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                        >
                          <option value="true">Verified</option>
                          <option value="false">Not Verified</option>
                        </select>
                      ) : (
                        <p className={`p-2 rounded-lg ${userData.emailVerified ? 'bg-green-900/30 text-green-300' : 'bg-yellow-900/30 text-yellow-300'} border border-red-900/20`}>
                          {userData.emailVerified ? 'Verified' : 'Not Verified'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Created At</label>
                      <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                        {userData.createdAt ? new Date(userData.createdAt).toLocaleString() : 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Active Sessions Section */}
              {activeSection === 'sessions' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold border-b border-red-900/20 pb-2">Active Sessions</h3>
                  
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-[#FFF6E0]/70">
                      {userData.activeSessions?.length || 0} active sessions found
                    </p>
                    
                    <button
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const response = await api.post('/api/v1/overlord/force-logout', {
                            userId: userData._id
                          });
                          
                          toast.success('All sessions terminated');
                          getUserDetails(); // Refresh user data
                        } catch (error) {
                          console.error('Error logging out sessions:', error);
                          toast.error(error.response?.data?.message || 'Failed to logout sessions');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors inline-flex items-center gap-2"
                      disabled={loading || !(userData.activeSessions?.length > 0)}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout All Sessions</span>
                    </button>
                  </div>
                  
                  {userData.activeSessions && userData.activeSessions.length > 0 ? (
                    <div className="space-y-4">
                      {userData.activeSessions.map((session, index) => (
                        <div key={index} className="p-3 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <LogOut className="h-4 w-4 text-blue-400" />
                              <span className="font-medium">Session {index + 1}</span>
                            </div>
                            <div className="text-xs text-[#FFF6E0]/70">
                              {session._id}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-sm">
                            <div>
                              <span className="text-[#FFF6E0]/70">Device:</span>
                              <p className="mt-1 text-xs bg-[#25272E] p-2 rounded border border-red-900/10">
                                {session.deviceInfo || 'Unknown device'}
                              </p>
                            </div>
                            
                            <div>
                              <span className="text-[#FFF6E0]/70">IP Address:</span>
                              <p className="mt-1 text-xs bg-[#25272E] p-2 rounded border border-red-900/10">
                                {session.ip || 'Unknown IP'}
                              </p>
                            </div>
                            
                            <div>
                              <span className="text-[#FFF6E0]/70">Last Active:</span>
                              <p className="mt-1 text-xs">
                                {session.lastActive ? new Date(session.lastActive).toLocaleString() : 'Unknown'}
                              </p>
                            </div>
                            
                            <div>
                              <span className="text-[#FFF6E0]/70">Issued At:</span>
                              <p className="mt-1 text-xs">
                                {session.issuedAt ? new Date(session.issuedAt).toLocaleString() : 'Unknown'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-[#1A1B1F] rounded-lg border border-red-900/20 text-center">
                      <p className="text-[#FFF6E0]/70">No active sessions found</p>
                    </div>
                  )}
                  
                  {/* Token Information */}
                  <div className="space-y-2">
                    <label className="block text-sm text-[#FFF6E0]/70">Token Version</label>
                    <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                      {userData.tokenVersion !== undefined ? userData.tokenVersion : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Advanced Settings Section */}
              {activeSection === 'advanced' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold border-b border-red-900/20 pb-2">Advanced Settings</h3>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-yellow-400 bg-yellow-900/20 p-3 rounded-lg">
                      <AlertTriangle className="inline-block h-4 w-4 mr-2" />
                      Warning: Changes in this section can significantly impact user functionality.
                    </p>
                    
                    {/* Bio */}
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Bio</label>
                      {editMode ? (
                        <div className="space-y-2">
                          {!editedData.bio && (
                            <button
                              onClick={() => handleChange('bio', [])}
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              Initialize bio array
                            </button>
                          )}
                          
                          {Array.isArray(editedData.bio) && (
                            <>
                              {editedData.bio.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={item || ''}
                                    onChange={(e) => {
                                      const newBio = [...editedData.bio];
                                      newBio[index] = e.target.value;
                                      handleChange('bio', newBio);
                                    }}
                                    className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => {
                                      const newBio = [...editedData.bio];
                                      newBio.splice(index, 1);
                                      handleChange('bio', newBio);
                                    }}
                                    className="p-2 hover:bg-[#272829] rounded-lg transition-colors"
                                  >
                                    <X className="h-4 w-4 text-red-400" />
                                  </button>
                                </div>
                              ))}
                              
                              <button
                                onClick={() => {
                                  const newBio = [...(editedData.bio || []), ''];
                                  handleChange('bio', newBio);
                                }}
                                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1"
                              >
                                + Add bio entry
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                          {userData.bio && userData.bio.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {userData.bio.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[#FFF6E0]/50">No bio entries</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Profile Image URL */}
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Profile Image</label>
                      {editMode ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-[#FFF6E0]/50 mb-1">Custom Profile Image URL</label>
                            <input
                              type="text"
                              value={editedData.customProfileImageURL || ''}
                              onChange={(e) => handleChange('customProfileImageURL', e.target.value)}
                              placeholder="Enter URL for custom profile image"
                              className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                            />
                            <p className="text-xs text-[#FFF6E0]/50 mt-1">
                              If provided, this will be used as the user's profile image.
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-[#FFF6E0]/50 mb-1">Auto-Generated Profile Image URL</label>
                            <input
                              type="text"
                              value={editedData.autoGenProfileImageURL || ''}
                              onChange={(e) => handleChange('autoGenProfileImageURL', e.target.value)}
                              placeholder="Auto-generated profile image URL"
                              className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                            />
                            <p className="text-xs text-[#FFF6E0]/50 mt-1">
                              This is used as fallback when no custom image is provided.
                            </p>
                          </div>
                          
                          <div className="pt-2 border-t border-red-900/10">
                            <label className="block text-xs text-[#FFF6E0]/50 mb-1">Current Profile Image Display</label>
                            <p className="text-xs text-blue-400">
                              {editedData.customProfileImageURL ? 'Using custom image' : 'Using auto-generated image'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full overflow-hidden bg-[#1A1B1F] border border-red-900/20">
                              <img
                                src={userData.profileImageURL}
                                alt="Profile"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=fallback';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {userData.customProfileImageURL ? 'Using custom profile image' : 'Using auto-generated image'}
                              </p>
                              <p className="text-xs text-[#FFF6E0]/50 break-all mt-1">
                                {userData.customProfileImageURL || userData.autoGenProfileImageURL}
                              </p>
                            </div>
                          </div>
                          
                          {userData.customProfileImageURL && (
                            <div className="p-2 bg-[#1A1B1F] rounded-lg border border-red-900/20">
                              <p className="text-xs font-medium mb-1">Custom Image URL:</p>
                              <p className="text-xs text-[#FFF6E0]/70 break-all">{userData.customProfileImageURL}</p>
                            </div>
                          )}
                          
                          <div className="p-2 bg-[#1A1B1F] rounded-lg border border-red-900/20">
                            <p className="text-xs font-medium mb-1">Auto-Generated Image URL:</p>
                            <p className="text-xs text-[#FFF6E0]/70 break-all">{userData.autoGenProfileImageURL}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Token Version */}
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Token Version</label>
                      {editMode ? (
                        <input
                          type="number"
                          value={editedData.tokenVersion || 0}
                          onChange={(e) => handleChange('tokenVersion', parseInt(e.target.value))}
                          className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                        />
                      ) : (
                        <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20">
                          {userData.tokenVersion !== undefined ? userData.tokenVersion : 'N/A'}
                        </p>
                      )}
                    </div>
                    
                    {/* Active Status */}
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Active Status</label>
                      {editMode ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editedData.activeStatus?.isActive || false}
                              onChange={(e) => handleNestedChange('activeStatus', 'isActive', e.target.checked)}
                              className="rounded border-red-900/20 bg-[#1A1B1F] text-purple-500 focus:ring-purple-500"
                            />
                            <span>Is currently active</span>
                          </div>
                        </div>
                      ) : (
                        <p className={`p-2 rounded-lg ${userData.activeStatus?.isActive ? 'bg-green-900/30 text-green-300' : 'bg-gray-900/30 text-gray-300'} border border-red-900/20`}>
                          {userData.activeStatus?.isActive ? 'Active' : 'Inactive'}{' '}
                          {userData.activeStatus?.lastActive && `(Last active: ${new Date(userData.activeStatus.lastActive).toLocaleString()})`}
                        </p>
                      )}
                    </div>
                    
                    {/* Reset Password */}
                    <div className="space-y-2 pt-4 border-t border-red-900/20">
                      <label className="block text-sm text-[#FFF6E0]/70">Reset Password</label>
                      {editMode ? (
                        <div className="space-y-2 relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={editedData.password || ''}
                            onChange={(e) => handleChange('password', e.target.value)}
                            className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none pr-10"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-2 right-2 text-[#FFF6E0]/70 hover:text-[#FFF6E0]"
                          >
                            {showPassword ? <Eye className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          <p className="text-xs text-yellow-400 mt-1">
                            <AlertTriangle className="inline-block h-3 w-3 mr-1" />
                            Password will be hashed before saving. For security reasons, you can't view the current password.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <p className="p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 flex-1 font-mono">
                              ••••••••••••••
                            </p>
                            <button
                              onClick={() => setEditMode(true)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-2"
                            >
                              <Key className="h-4 w-4" />
                              <span>Reset</span>
                            </button>
                          </div>
                          <p className="text-xs text-gray-400">
                            <Info className="inline-block h-3 w-3 mr-1" />
                            For security reasons, the actual password is not displayed.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Email Verification */}
                    <div className="space-y-2">
                      <label className="block text-sm text-[#FFF6E0]/70">Email Verification</label>
                      {editMode ? (
                        <select
                          value={editedData.emailVerified ? 'true' : 'false'}
                          onChange={(e) => handleChange('emailVerified', e.target.value === 'true')}
                          className="w-full p-2 rounded-lg bg-[#1A1B1F] border border-red-900/20 focus:border-purple-500 focus:outline-none"
                        >
                          <option value="true">Verified</option>
                          <option value="false">Not Verified</option>
                        </select>
                      ) : (
                        <p className={`p-2 rounded-lg ${userData.emailVerified ? 'bg-green-900/30 text-green-300' : 'bg-yellow-900/30 text-yellow-300'} border border-red-900/20`}>
                          {userData.emailVerified ? 'Verified' : 'Not Verified'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Raw Data Section */}
              {activeSection === 'raw' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold border-b border-red-900/20 pb-2">Raw User Data</h3>
                  
                  <div className="relative">
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button 
                        onClick={() => {
                          // Create a deep copy of the user data with all fields
                          const fullUserData = JSON.parse(JSON.stringify(userData));
                          
                          // Redact sensitive data
                          if (fullUserData.password) fullUserData.password = "[REDACTED]";
                          if (fullUserData.refreshToken) fullUserData.refreshToken = "[REDACTED]";
                          
                          // Copy to clipboard
                          navigator.clipboard.writeText(JSON.stringify(fullUserData, replacer, 2));
                          toast.success('JSON copied to clipboard');
                        }}
                        className="p-1.5 bg-[#25272E] rounded-md hover:bg-[#31333A] text-xs flex items-center gap-1"
                      >
                        <span>Copy JSON</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-lg bg-[#1A1B1F] border border-red-900/20 overflow-auto max-h-[500px] text-sm">
                      {JSON.stringify(userData, replacer, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverlordUserInfo; 