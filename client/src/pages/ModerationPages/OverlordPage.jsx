import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Database, 
  Shield, 
  Search, 
  Edit, 
  Trash2, 
  Key, 
  Eye, 
  Map, 
  LogOut, 
  FileDown, 
  RefreshCw,
  MessageSquare,
  UserX,
  Terminal,
  AlertCircle,
  Folder,
  FileText,
  Clock,
  HardDrive,
  MapPin,
  ExternalLink,
  Crown,
  Power,
  Activity,
  Server,
  Cpu,
  Hash,
  Award,
  BarChart4,
  Lock,
  User,
  AlertTriangle,
  GitBranch,
  Skull,
  ArrowRight,
  ChevronRight,
  X,
  Copy,
  Settings,
  Sliders,
  UserPlus,
  FileSearch
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
// Import the components
import OverlordMessage from '../../components/ModerationComponents/OverlordMessage';
import OverlordLocation from '../../components/ModerationComponents/OverlordLocation';
import OverlordUserInfo from '../../components/ModerationComponents/OverlordUserInfo';

// Create axios instance with the correct backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500/api/v1',
  withCredentials: true
});

const OverlordPage = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [loading, setLoading] = useState(false);
  const [userSearchInput, setUserSearchInput] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [showLocationData, setShowLocationData] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [dbOperation, setDbOperation] = useState('find');
  const [queryInput, setQueryInput] = useState('{}');
  const [updateInput, setUpdateInput] = useState('{}');
  const [optionsInput, setOptionsInput] = useState('{}');
  const [queryResult, setQueryResult] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [backups, setBackups] = useState([]);
  const [backupsLoading, setBackupsLoading] = useState(false);
  const [temporaryUsers, setTemporaryUsers] = useState([]);
  const [tempUserLoading, setTempUserLoading] = useState(false);
  const [tempUserSearch, setTempUserSearch] = useState('');
  const [tempUserSortBy, setTempUserSortBy] = useState('createdAt');
  const [tempUserSortOrder, setTempUserSortOrder] = useState('desc');
  const [tempUserFilterType, setTempUserFilterType] = useState('temporary'); // Default to show 'Temporary User' named users
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [temporaryUsersPagination, setTemporaryUsersPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 20,
    totalCount: 0
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [dashboardStats, setDashboardStats] = useState({
    usersCount: 0,
    sessionCount: 0,
    messagesCount: 0,
    collectionCount: 0,
    temporaryUsersCount: 0
  });
  const { authUser } = useAuthStore();

  // Check if user is king
  const isKing = authUser?.data?.user?.userRole === 'king';

  // If not king, show unauthorized message
  if (!isKing) {
    return (
      <div className="min-h-screen bg-[#1A1B1F] text-[#FFF6E0] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#1A1B1F] opacity-95"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1B1F] via-red-900/20 to-transparent opacity-70"></div>
        </div>
        
        {/* Animated floating orbs */}
        <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-red-500 blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '7s'}}></div>
        <div className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-red-800 blur-[150px] opacity-10 animate-pulse" style={{animationDuration: '10s'}}></div>
        
        <div className="relative z-10 max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-[#31333A]/90 to-[#272829]/90 backdrop-blur-lg border border-red-800/30 shadow-2xl flex flex-col items-center">
          <Skull className="w-24 h-24 text-red-500 mb-6" />
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-red-500 to-red-300 text-transparent bg-clip-text">Access Forbidden</h1>
          <div className="w-40 h-1 bg-gradient-to-r from-red-800 to-transparent mb-6"></div>
          <p className="text-xl text-center text-[#FFF6E0]/90 mb-2">Only the King can access the Absolute Power controls.</p>
          <p className="text-sm text-center text-[#FFF6E0]/60 max-w-md mb-6">This page contains powerful tools that can irreversibly affect the entire system.</p>
          <div className="flex gap-3">
            <button onClick={() => window.history.back()} className="bg-[#272829] hover:bg-[#31333A] border border-red-900/30 text-[#FFF6E0] px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2">
              <Power size={18} />
              Return to Safety
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard data fetch - using real endpoint
  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/api/v1/overlord/dashboard-stats');
      setDashboardStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard statistics');
      // Fallback to dummy data if API call fails
      setDashboardStats({
        usersCount: 0,
        sessionCount: 0,
        messagesCount: 0,
        collectionCount: 0,
        temporaryUsersCount: 0
      });
    }
  };
  
  // Delete multiple users at once
  const bulkDeleteUsers = async () => {
    if (selectedUserIds.length === 0) {
      toast.error('No users selected for deletion');
      return;
    }
    
    const confirmMessage = selectedUserIds.length === temporaryUsers.length ?
      `Are you sure you want to delete ALL ${selectedUserIds.length} displayed users? This cannot be undone.` :
      `Are you sure you want to delete ${selectedUserIds.length} selected users? This cannot be undone.`;
      
    if (!window.confirm(confirmMessage)) return;
    
    setBulkDeleteLoading(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      
      const verifyInput = window.prompt(
        `Please enter this verification code to confirm bulk deletion:\n${code}`
      );
      
      if (!verifyInput || verifyInput !== code) {
        toast.error('Verification failed. Bulk deletion canceled.');
        setBulkDeleteLoading(false);
        return;
      }
      
      // Process deletion in batches to avoid overwhelming the server
      let successCount = 0;
      let failCount = 0;
      
      // Process in batches of 5
      for (let i = 0; i < selectedUserIds.length; i += 5) {
        const batch = selectedUserIds.slice(i, i + 5);
        await Promise.all(batch.map(async (userId) => {
          try {
            await api.post('/api/v1/overlord/delete-user', {
              userId: userId,
              verificationCode: code,
              verificationInput: code
            });
            successCount++;
          } catch (error) {
            console.error(`Error deleting user ${userId}:`, error);
            failCount++;
          }
        }));
      }
      
      // Refresh the temporary users list
      fetchTemporaryUsers();
      fetchDashboardStats();
      
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} users`);
      }
      
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} users`);
      }
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast.error(error.response?.data?.message || 'Bulk deletion failed');
    } finally {
      setBulkDeleteLoading(false);
      setSelectedUserIds([]);
    }
  };
  
  // Fetch temporary users with filtering and pagination
  const fetchTemporaryUsers = async () => {
    setTempUserLoading(true);
    setSelectedUserIds([]); // Reset selected users on fetch
    try {
      const response = await api.post('/api/v1/overlord/temporary-users', {
        limit: temporaryUsersPagination.limit,
        offset: (temporaryUsersPagination.currentPage - 1) * temporaryUsersPagination.limit,
        searchTerm: tempUserSearch,
        sortBy: tempUserSortBy,
        sortOrder: tempUserSortOrder,
        filterType: tempUserFilterType,
        dateRangeStart: dateRangeStart || undefined,
        dateRangeEnd: dateRangeEnd || undefined
      });
      
      setTemporaryUsers(response.data.data.users);
      setTemporaryUsersPagination({
        ...temporaryUsersPagination,
        totalCount: response.data.data.totalCount,
        totalPages: response.data.data.totalPages,
        currentPage: response.data.data.currentPage || 1
      });
      
    } catch (error) {
      console.error('Error fetching temporary users:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch temporary users');
    } finally {
      setTempUserLoading(false);
    }
  };

  // Search for user by email, ID, or uniqueTag
  const searchUser = async () => {
    if (!userSearchInput.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/v1/overlord/user-details', {
        userId: userSearchInput
      });
      
      setSelectedUser(response.data.data);
      toast.success('User found');
    } catch (error) {
      console.error('Error searching user:', error);
      toast.error(error.response?.data?.message || 'Failed to find user');
      setSelectedUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input key press (for Enter key)
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchUser();
    }
  };

  // Edit user data
  const editUserData = async (fieldData) => {
    if (!selectedUser?._id) {
      toast.error('No user selected');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/v1/overlord/edit-user', {
        userId: selectedUser._id,
        fieldData
      });
      
      setSelectedUser(response.data.data.user);
      toast.success('User data updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  // Reset user password
  const resetPassword = async () => {
    if (!selectedUser?._id) {
      toast.error('No user selected');
      return;
    }

    const newPassword = prompt('Enter new password for user:');
    if (!newPassword) return;

    setLoading(true);
    try {
      await api.post('/api/v1/overlord/reset-password', {
        userId: selectedUser._id,
        newPassword
      });
      
      toast.success('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Generate random verification code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  };
  
  // Show delete confirmation modal
  const showDeleteConfirmationModal = () => {
    if (!selectedUser?._id) {
      toast.error('No user selected');
      return;
    }
    
    // Generate verification code
    setVerificationCode(generateVerificationCode());
    setVerificationInput('');
    setUserToDelete(selectedUser);
    setShowDeleteConfirmation(true);
  };
  
  // Delete user account with verification
  const deleteUser = async () => {
    if (!userToDelete?._id || !verificationCode || !verificationInput) {
      toast.error('Verification information missing');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/v1/overlord/delete-user', {
        userId: userToDelete._id,
        verificationCode,
        verificationInput
      });
      
      // If the deleted user was in the temporary users list, remove them from the list
      if (activeTab === 'temporaryUsers') {
        setTemporaryUsers(prev => prev.filter(user => user._id !== userToDelete._id));
      }
      
      toast.success('User deleted successfully');
      setSelectedUser(null);
      setShowDeleteConfirmation(false);
      setUserToDelete(null);
      
      // Refresh dashboard stats if needed
      fetchDashboardStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Get user messages
  const getUserMessages = async () => {
    if (!selectedUser?._id) {
      toast.error('No user selected');
      return;
    }

    setShowMessages(true);
  };

  // Get user location history
  const getUserLocationHistory = async () => {
    if (!selectedUser?._id) {
      toast.error('No user selected');
      return;
    }

    setShowLocationData(true);
  };

  // Database operations
  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/overlord/collections');
      setCollections(response.data.data.collections);
      if (response.data.data.collections.length > 0) {
        setSelectedCollection(response.data.data.collections[0]);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async () => {
    if (!selectedCollection) {
      toast.error('Please select a collection');
      return;
    }

    try {
      // Parse JSON inputs
      const query = JSON.parse(queryInput);
      const update = dbOperation.includes('update') ? JSON.parse(updateInput) : undefined;
      const options = JSON.parse(optionsInput);

      setLoading(true);
      const response = await api.post('/api/v1/overlord/db-query', {
        collection: selectedCollection,
        operation: dbOperation,
        query,
        update,
        options
      });
      
      setQueryResult(response.data.data.result);
      toast.success(`${dbOperation} operation executed successfully`);
    } catch (error) {
      console.error('Error executing query:', error);
      toast.error(error.response?.data?.message || 'Failed to execute query');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/v1/overlord/create-backup');
      toast.success('Database backup created successfully');
      alert(`Backup created at: ${response.data.data.message}`);
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error(error.response?.data?.message || 'Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  // Security operations
  const fetchActiveSessions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/overlord/user-sessions');
      setActiveSessions(response.data.data.users);
      toast.success(`Fetched ${response.data.data.users.length} users with active sessions`);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const forceLogoutUser = async (userId, sessionId) => {
    setLoading(true);
    try {
      await api.post('/api/v1/overlord/force-logout', {
        userId,
        sessionId
      });
      
      // Refresh sessions
      fetchActiveSessions();
      toast.success('User logged out successfully');
    } catch (error) {
      console.error('Error logging out user:', error);
      toast.error(error.response?.data?.message || 'Failed to log out user');
    } finally {
      setLoading(false);
    }
  };

  const forceLogoutAllUsers = async () => {
    const confirm = window.confirm('Are you sure you want to log out ALL users from the system? This is a drastic action.');
    if (!confirm) return;

    setLoading(true);
    try {
      const response = await api.post('/api/v1/overlord/force-logout-all');
      toast.success(`Logged out ${response.data.data.modifiedCount} users`);
      setActiveSessions([]);
    } catch (error) {
      console.error('Error logging out all users:', error);
      toast.error(error.response?.data?.message || 'Failed to log out users');
    } finally {
      setLoading(false);
    }
  };

  // Add function to fetch backups
  const fetchBackups = async () => {
    setBackupsLoading(true);
    try {
      const response = await api.get('/api/v1/overlord/backups');
      setBackups(response.data.data.backups);
    } catch (error) {
      console.error('Error fetching backups:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch backups');
    } finally {
      setBackupsLoading(false);
    }
  };
  
  // Add function to delete a backup
  const deleteBackupFile = async (backupPath) => {
    const confirm = window.confirm('Are you sure you want to delete this backup? This action cannot be undone.');
    if (!confirm) return;
    
    setBackupsLoading(true);
    try {
      await api.post('/api/v1/overlord/delete-backup', { backupPath });
      toast.success('Backup deleted successfully');
      fetchBackups(); // Refresh the list
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast.error(error.response?.data?.message || 'Failed to delete backup');
    } finally {
      setBackupsLoading(false);
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get icon based on file type
  const getFileIcon = (backup) => {
    if (backup.isDirectory) return <Folder size={18} className="text-yellow-400" />;
    
    switch (backup.type) {
      case '.json':
        return <FileText size={18} className="text-blue-400" />;
      default:
        return <FileText size={18} className="text-gray-400" />;
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Fetch collections when tab changes
  useEffect(() => {
    if (activeTab === 'database') {
      fetchCollections();
      fetchBackups();
    } else if (activeTab === 'security') {
      fetchActiveSessions();
    } else if (activeTab === 'temporaryUsers') {
      fetchTemporaryUsers();
    }
  }, [activeTab]);

  // Get user details
  const getUserDetails = async () => {
    if (!selectedUser?._id) {
      toast.error('No user selected');
      return;
    }

    setShowUserInfo(true);
  };

  // Update user from userinfo component
  const handleUserUpdate = (updatedUser) => {
    setSelectedUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-[#1A1B1F] text-[#FFF6E0] relative overflow-hidden">
      {/* Delete User Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#272829] to-[#31333A] rounded-xl border border-red-900/30 shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-[#FFF6E0]">Delete User Confirmation</h3>
              <button 
                onClick={() => setShowDeleteConfirmation(false)}
                className="text-[#FFF6E0]/70 hover:text-[#FFF6E0] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-900/30">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="font-semibold text-red-400">This action cannot be undone</span>
                </div>
                <p className="text-sm text-[#FFF6E0]/80">
                  You are about to permanently delete user {userToDelete?.fullName || 'Unknown'}. This will remove all their data from the system.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-[#FFF6E0]/80">Verification Required</label>
                <p className="text-xs mb-3 text-[#FFF6E0]/60">
                  To confirm deletion, enter the 6-digit code below, the user's email, or their unique tag.
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#1A1B1F] p-3 rounded-lg font-mono text-center border border-red-900/30 text-red-400">
                    {verificationCode}
                  </div>
                  <div className="text-xs text-[#FFF6E0]/60">
                    <p>Email: {userToDelete?.email}</p>
                    <p>Unique Tag: {userToDelete?.uniqueTag}</p>
                  </div>
                </div>
                
                <input 
                  type="text" 
                  className="w-full bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-700/50"
                  placeholder="Enter verification code, email, or unique tag"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="flex-1 px-4 py-3 bg-[#1A1B1F] hover:bg-[#31333A] text-[#FFF6E0]/90 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={deleteUser}
                  disabled={loading || !verificationInput}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading || !verificationInput
                      ? 'bg-red-900/30 text-red-400/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-700 to-red-900 text-[#FFF6E0] hover:from-red-600 hover:to-red-800'
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Processing</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-5 w-5" />
                      <span>Delete User</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#1A1B1F] opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1B1F] via-red-900/20 to-transparent opacity-70"></div>
      </div>
      
      {/* Animated floating orbs */}
      <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-red-500 blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '7s'}}></div>
      <div className="absolute bottom-60 left-20 w-96 h-96 rounded-full bg-red-800 blur-[150px] opacity-10 animate-pulse" style={{animationDuration: '10s'}}></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FF4136 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 px-4 py-8 container mx-auto max-w-7xl">
        {/* Header */}
      <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-700 to-red-900 rounded-xl flex items-center justify-center">
              <Crown className="h-8 w-8 text-[#FFF6E0]" />
            </div>
            <div>
              <div className="bg-gradient-to-r from-red-700 to-red-500 p-1 inline-block rounded-full mb-1">
                <span className="bg-[#1A1B1F] text-[#FFF6E0] px-4 py-1 rounded-full text-xs tracking-wider uppercase font-semibold">
                  Absolute Authority
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-300 text-transparent bg-clip-text">
                Overlord Control Center
        </h1>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#272829]/80 backdrop-blur-sm p-4 rounded-xl border border-red-900/30">
            <div className="max-w-2xl">
              <p className="text-[#FFF6E0]/80 text-sm md:text-base">
                <span className="text-red-400 font-semibold">WARNING:</span> These controls bypass normal system safeguards and can cause irreversible changes. With great power comes great responsibility.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-sm text-red-400">System Access: SOVEREIGN</span>
            </div>
          </div>
      </header>

        {/* Navigation Tabs */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
        <button
            className={`py-3 px-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center ${
              activeTab === 'user' 
                ? 'bg-gradient-to-br from-red-800 to-red-900 text-[#FFF6E0] shadow-lg shadow-red-900/30' 
                : 'bg-[#272829]/60 hover:bg-[#272829]/90 text-[#FFF6E0]/70 hover:text-[#FFF6E0]'
            }`}
          onClick={() => setActiveTab('user')}
        >
            <Users size={24} className={activeTab === 'user' ? 'mb-1 text-red-300' : 'mb-1'} />
            <span className="text-sm font-medium">User Control</span>
        </button>
        
        <button
            className={`py-3 px-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center ${
              activeTab === 'temporaryUsers' 
                ? 'bg-gradient-to-br from-red-800 to-red-900 text-[#FFF6E0] shadow-lg shadow-red-900/30' 
                : 'bg-[#272829]/60 hover:bg-[#272829]/90 text-[#FFF6E0]/70 hover:text-[#FFF6E0]'
            }`}
          onClick={() => setActiveTab('temporaryUsers')}
        >
            <UserPlus size={24} className={activeTab === 'temporaryUsers' ? 'mb-1 text-red-300' : 'mb-1'} />
            <span className="text-sm font-medium">Temporary Users</span>
            {dashboardStats.temporaryUsersCount > 0 && (
              <span className="mt-1 px-2 py-0.5 bg-red-500/30 text-red-400 text-xs rounded-full">
                {dashboardStats.temporaryUsersCount}
              </span>
            )}
        </button>
          
        <button
            className={`py-3 px-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center ${
              activeTab === 'database' 
                ? 'bg-gradient-to-br from-red-800 to-red-900 text-[#FFF6E0] shadow-lg shadow-red-900/30' 
                : 'bg-[#272829]/60 hover:bg-[#272829]/90 text-[#FFF6E0]/70 hover:text-[#FFF6E0]'
            }`}
          onClick={() => setActiveTab('database')}
        >
            <Database size={24} className={activeTab === 'database' ? 'mb-1 text-red-300' : 'mb-1'} />
            <span className="text-sm font-medium">Database</span>
        </button>
          
        <button
            className={`py-3 px-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center ${
              activeTab === 'security' 
                ? 'bg-gradient-to-br from-red-800 to-red-900 text-[#FFF6E0] shadow-lg shadow-red-900/30' 
                : 'bg-[#272829]/60 hover:bg-[#272829]/90 text-[#FFF6E0]/70 hover:text-[#FFF6E0]'
            }`}
          onClick={() => setActiveTab('security')}
        >
            <Shield size={24} className={activeTab === 'security' ? 'mb-1 text-red-300' : 'mb-1'} />
            <span className="text-sm font-medium">Security</span>
        </button>
      </div>

        {/* Temporary Users Tab */}
        {activeTab === 'temporaryUsers' && (
          <div className="space-y-6">
            {/* Temporary Users Header */}
            <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center mb-2">
                    <UserPlus className="mr-3 text-red-400" /> Temporary Users
                  </h2>
                  <p className="text-[#FFF6E0]/70 max-w-xl">
                    Manage users with pending verification. These users have registered but have not completed email verification.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={fetchTemporaryUsers}
                    className="px-4 py-2 bg-[#1A1B1F] hover:bg-[#1A1B1F]/80 text-[#FFF6E0]/90 rounded-lg transition-colors flex items-center gap-2"
                    disabled={tempUserLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${tempUserLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Temporary Users Filtering and Table */}
            <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex flex-col gap-4 mb-6">
                {/* Header with title and bulk delete button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {temporaryUsersPagination.totalCount > 0 ? `${temporaryUsersPagination.totalCount} Temporary Users Found` : 'No Temporary Users Found'}
                    </h3>
                    {selectedUserIds.length > 0 && (
                      <p className="text-sm text-red-400 mt-1">{selectedUserIds.length} users selected for deletion</p>
                    )}
                  </div>
                  
                  <div>
                    {selectedUserIds.length > 0 && (
                      <button
                        onClick={bulkDeleteUsers}
                        disabled={bulkDeleteLoading}
                        className={`w-full md:w-auto px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${bulkDeleteLoading ? 'bg-red-900/30 text-red-400/50 cursor-not-allowed' : 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30'}`}
                      >
                        {bulkDeleteLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Selected ({selectedUserIds.length})</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Search section */}
                <div className="w-full">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    fetchTemporaryUsers();
                  }}>
                    <div className="flex w-full">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          placeholder="Search by name, email, or tag..."
                          value={tempUserSearch}
                          onChange={(e) => setTempUserSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/50"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#FFF6E0]/50" />
                      </div>
                      <button
                        type="submit"
                        className="ml-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/30 border border-red-900/30 text-[#FFF6E0]/90 rounded-lg focus:outline-none transition-colors"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Filter controls */}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
                    {/* Date Range Filter */}
                    <div className="flex flex-col gap-1 w-full">
                      <label className="text-xs text-[#FFF6E0]/60">Date Range</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={dateRangeStart}
                          onChange={(e) => setDateRangeStart(e.target.value)}
                          className="flex-1 px-2 py-1 bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/50"
                          placeholder="From"
                        />
                        <span className="text-[#FFF6E0]/60 whitespace-nowrap">to</span>
                        <input
                          type="date"
                          value={dateRangeEnd}
                          onChange={(e) => setDateRangeEnd(e.target.value)}
                          className="flex-1 px-2 py-1 bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/50"
                          placeholder="To"
                        />
                      </div>
                    </div>
                    
                    
                  
                    {/* Sort and Filter Controls */}
                    <div className="flex flex-col gap-1 w-full">
                      <label className="text-xs text-[#FFF6E0]/60">User Type & Sorting</label>
                      <div className="grid grid-cols-2 gap-2">
                        {/* User Type Filter */}
                        <select
                          value={tempUserFilterType}
                          onChange={(e) => {
                            setTempUserFilterType(e.target.value);
                            setTemporaryUsersPagination({
                              ...temporaryUsersPagination,
                              currentPage: 1
                            });
                          }}
                          className="w-full px-3 py-2 bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/50"
                        >
                          <option value="temporary">Temporary Users</option>
                          <option value="unverified">Unverified Users</option>
                          <option value="both">All Temporary Users</option>
                        </select>

                        {/* Sort Direction Toggle */}
                        <button
                          onClick={() => setTempUserSortOrder(tempUserSortOrder === 'asc' ? 'desc' : 'asc')}
                          className="px-3 py-2 bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg focus:outline-none hover:bg-[#31333A] transition-colors"
                        >
                          {tempUserSortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                        </button>
                        
                        {/* Sort By Field */}
                        <select
                          value={tempUserSortBy}
                          onChange={(e) => setTempUserSortBy(e.target.value)}
                          className="col-span-2 mt-2 w-full px-3 py-2 bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/50"
                        >
                          <option value="createdAt">Sort by: Date</option>
                          <option value="fullName">Sort by: Name</option>
                          <option value="email">Sort by: Email</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Filter Action Buttons */}
                    <div className="flex flex-col gap-1 w-full">
                      <label className="text-xs text-[#FFF6E0]/60">Actions</label>
                      <div className="flex gap-2">
                        <button
                          onClick={fetchTemporaryUsers}
                          className="flex-1 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-900/30 text-[#FFF6E0]/90 rounded-lg focus:outline-none transition-colors font-medium"
                        >
                          Apply Filters
                        </button>
                        
                        <button
                          onClick={() => {
                            setTempUserSearch('');
                            setTempUserSortBy('createdAt');
                            setTempUserSortOrder('desc');
                            setTempUserFilterType('temporary'); // Reset to default filter
                            setDateRangeStart('');
                            setDateRangeEnd('');
                            setTemporaryUsersPagination({
                              ...temporaryUsersPagination,
                              currentPage: 1
                            });
                            fetchTemporaryUsers();
                          }}
                          className="flex-1 px-3 py-2 bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg focus:outline-none hover:bg-[#31333A] transition-colors"
                        >
                          Reset All
                        </button>
                      </div>
                    </div>
                </div>
              </div>
              
              {/* User table section */}
              {tempUserLoading ? (
                <div className="flex justify-center py-12">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-10 w-10 text-red-400 animate-spin mb-4" />
                    <span className="text-[#FFF6E0]/70">Loading temporary users...</span>
                  </div>
                </div>
              ) : temporaryUsers.length > 0 ? (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[#FFF6E0]/90">
                      <thead className="bg-[#1A1B1F]">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#FFF6E0]/60 uppercase tracking-wider">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={temporaryUsers.length > 0 && selectedUserIds.length === temporaryUsers.length}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUserIds(temporaryUsers.map(user => user._id));
                                  } else {
                                    setSelectedUserIds([]);
                                  }
                                }}
                                className="mr-2 h-4 w-4 bg-[#1A1B1F] border border-red-900/30 rounded-sm focus:ring-red-500 text-red-600 focus:ring-2"
                              />
                              <span>User</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#FFF6E0]/60 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#FFF6E0]/60 uppercase tracking-wider">Unique Tag</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#FFF6E0]/60 uppercase tracking-wider">Registered</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-[#FFF6E0]/60 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-red-900/10">
                        {temporaryUsers.map(user => (
                          <tr key={user._id} className="hover:bg-[#1A1B1F]/50">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedUserIds.includes(user._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedUserIds([...selectedUserIds, user._id]);
                                    } else {
                                      setSelectedUserIds(selectedUserIds.filter(id => id !== user._id));
                                    }
                                  }}
                                  className="mr-3 h-4 w-4 bg-[#1A1B1F] border border-red-900/30 rounded-sm focus:ring-red-500 text-red-600 focus:ring-2"
                                />
                                <div className="h-10 w-10 rounded-full bg-[#1A1B1F] flex items-center justify-center text-sm font-semibold mr-3">
                                  {user.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">{user.fullName}</div>
                                  <div className="text-sm text-[#FFF6E0]/60">{user.gender || 'Not specified'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm">{user.email}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-mono bg-[#1A1B1F] inline-block px-2 py-1 rounded">{user.uniqueTag}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm">{new Date(user.createdAt).toLocaleString()}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setActiveTab('user');
                                  }}
                                  className="p-2 bg-[#1A1B1F] hover:bg-[#31333A] rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4 text-blue-400" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    showDeleteConfirmationModal();
                                  }}
                                  className="p-2 bg-red-900/20 hover:bg-red-900/40 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="h-4 w-4 text-red-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination Controls */}
                  {temporaryUsersPagination.totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-[#FFF6E0]/60">
                        Showing {((temporaryUsersPagination.currentPage - 1) * temporaryUsersPagination.limit) + 1} to {Math.min(temporaryUsersPagination.currentPage * temporaryUsersPagination.limit, temporaryUsersPagination.totalCount)} of {temporaryUsersPagination.totalCount} users
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (temporaryUsersPagination.currentPage > 1) {
                              setTemporaryUsersPagination({
                                ...temporaryUsersPagination,
                                currentPage: temporaryUsersPagination.currentPage - 1
                              });
                              fetchTemporaryUsers();
                            }
                          }}
                          disabled={temporaryUsersPagination.currentPage === 1}
                          className={`px-3 py-1.5 rounded-lg transition-colors ${temporaryUsersPagination.currentPage === 1 ? 'bg-[#1A1B1F]/50 text-[#FFF6E0]/30 cursor-not-allowed' : 'bg-[#1A1B1F] hover:bg-[#31333A] text-[#FFF6E0]/90'}`}
                        >
                          Previous
                        </button>
                        {Array.from({ length: temporaryUsersPagination.totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => {
                              if (page !== temporaryUsersPagination.currentPage) {
                                setTemporaryUsersPagination({
                                  ...temporaryUsersPagination,
                                  currentPage: page
                                });
                                fetchTemporaryUsers();
                              }
                            }}
                            className={`w-8 h-8 rounded-lg transition-colors ${page === temporaryUsersPagination.currentPage ? 'bg-gradient-to-br from-red-800 to-red-900 text-[#FFF6E0]' : 'bg-[#1A1B1F] hover:bg-[#31333A] text-[#FFF6E0]/90'}`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            if (temporaryUsersPagination.currentPage < temporaryUsersPagination.totalPages) {
                              setTemporaryUsersPagination({
                                ...temporaryUsersPagination,
                                currentPage: temporaryUsersPagination.currentPage + 1
                              });
                              fetchTemporaryUsers();
                            }
                          }}
                          disabled={temporaryUsersPagination.currentPage === temporaryUsersPagination.totalPages}
                          className={`px-3 py-1.5 rounded-lg transition-colors ${temporaryUsersPagination.currentPage === temporaryUsersPagination.totalPages ? 'bg-[#1A1B1F]/50 text-[#FFF6E0]/30 cursor-not-allowed' : 'bg-[#1A1B1F] hover:bg-[#31333A] text-[#FFF6E0]/90'}`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#1A1B1F] rounded-lg p-8 flex flex-col items-center justify-center text-center">
                  <UserPlus className="h-16 w-16 text-[#FFF6E0]/10 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Temporary Users Found</h3>
                  <p className="text-[#FFF6E0]/60 max-w-md">
                    There are currently no users with pending verification. All users have completed their signup process.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-4 rounded-xl border border-red-900/20 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#FFF6E0]/80 text-sm font-medium">Total Users</h3>
                  <User className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-3xl font-bold text-[#FFF6E0]">{dashboardStats.usersCount.toLocaleString()}</p>
                <div className="mt-2 text-xs text-[#FFF6E0]/60">System-wide accounts</div>
              </div>
              
              <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-4 rounded-xl border border-red-900/20 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#FFF6E0]/80 text-sm font-medium">Active Sessions</h3>
                  <Activity className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-3xl font-bold text-[#FFF6E0]">{dashboardStats.sessionCount.toLocaleString()}</p>
                <div className="mt-2 text-xs text-[#FFF6E0]/60">Currently logged in</div>
              </div>
              
              <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-4 rounded-xl border border-red-900/20 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#FFF6E0]/80 text-sm font-medium">Messages</h3>
                  <MessageSquare className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-3xl font-bold text-[#FFF6E0]">{dashboardStats.messagesCount.toLocaleString()}</p>
                <div className="mt-2 text-xs text-[#FFF6E0]/60">Total communications</div>
              </div>
              
              <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-4 rounded-xl border border-red-900/20 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#FFF6E0]/80 text-sm font-medium">Collections</h3>
                  <Database className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-3xl font-bold text-[#FFF6E0]">{dashboardStats.collectionCount.toLocaleString()}</p>
                <div className="mt-2 text-xs text-[#FFF6E0]/60">Database structure</div>
              </div>
            </div>
            
            {/* System Status */}
            <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-6 rounded-xl border border-red-900/20 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Server className="mr-3 text-red-400" /> System Status
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                <div>
                  <h3 className="text-[#FFF6E0]/80 text-sm font-medium mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={fetchActiveSessions}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#31333A] hover:bg-[#31333A]/70 rounded-lg transition-colors"
                    >
                      <span className="flex items-center">
                        <Activity className="mr-2 h-4 w-4 text-red-400" />
                        <span className="text-sm">Refresh Sessions</span>
                      </span>
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    
                    <button 
                      onClick={createBackup}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#31333A] hover:bg-[#31333A]/70 rounded-lg transition-colors"
                    >
                      <span className="flex items-center">
                        <HardDrive className="mr-2 h-4 w-4 text-red-400" />
                        <span className="text-sm">Create Backup</span>
                      </span>
                      <FileDown className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={forceLogoutAllUsers}
                      className="w-full flex items-center justify-between px-4 py-3 bg-red-900/50 hover:bg-red-900/70 rounded-lg transition-colors"
                    >
                      <span className="flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4 text-red-300" />
                        <span className="text-sm">Force Logout All</span>
                      </span>
                      <Power className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-[#FFF6E0]/80 text-sm font-medium mb-2">Security Status</h3>
                  <div className="p-4 bg-[#1A1B1F]/70 rounded-lg border border-[#31333A]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-[#FFF6E0]/90 text-sm">System Secure</span>
                      </div>
                      <Lock className="h-4 w-4 text-green-400" />
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#FFF6E0]/70">Last Backup:</span>
                        <span className="text-[#FFF6E0]/90">{new Date(dashboardStats.lastBackup || Date.now()).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#FFF6E0]/70">Auth Protocol:</span>
                        <span className="text-[#FFF6E0]/90">SOVEREIGN</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#FFF6E0]/70">Security Level:</span>
                        <span className="text-red-400 font-medium">MAXIMUM</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-[#FFF6E0]/80 text-sm font-medium mb-2">System Health</h3>
                  <div className="p-4 bg-[#1A1B1F]/70 rounded-lg border border-[#31333A]">
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#FFF6E0]/70">Database Load</span>
                        <span className="text-xs text-[#FFF6E0]/90">38%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#31333A] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '38%' }}></div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#FFF6E0]/70">Memory Usage</span>
                        <span className="text-xs text-[#FFF6E0]/90">62%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#31333A] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#FFF6E0]/70">CPU Load</span>
                        <span className="text-xs text-[#FFF6E0]/90">17%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#31333A] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '17%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'user' && (
          <div className="space-y-6">
            {/* User Search */}
            <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-6 rounded-xl border border-red-900/20 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Users className="mr-3 text-red-400" /> User Control Panel
              </h2>
              
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                <input
                  type="text"
                    placeholder="Search by user ID, email, or uniqueTag..."
                    className="w-full bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0] rounded-xl py-4 pl-5 pr-16 focus:outline-none focus:ring-2 focus:ring-red-700/50"
                  value={userSearchInput}
                  onChange={(e) => setUserSearchInput(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                />
                <button
                    className={`absolute right-2 top-2 p-2.5 rounded-lg transition-all duration-300 
                      ${loading ? 
                        'bg-red-900/30 text-red-400/50' : 
                        'bg-gradient-to-r from-red-700 to-red-900 text-[#FFF6E0] hover:from-red-600 hover:to-red-800'
                      }`}
                  onClick={searchUser}
                  disabled={loading}
                >
                    {loading ? 
                      <RefreshCw className="h-5 w-5 animate-spin" /> : 
                      <Search className="h-5 w-5" />
                    }
                </button>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2.5 text-xs text-[#FFF6E0]/60">
                  <span>Search tips:</span>
                  <span className="px-2 py-0.5 bg-[#1A1B1F]/70 rounded-md">Email: user@example.com</span>
                  <span className="px-2 py-0.5 bg-[#1A1B1F]/70 rounded-md">ID: 507f1f77bcf86cd799439011</span>
                  <span className="px-2 py-0.5 bg-[#1A1B1F]/70 rounded-md">Tag: #uniqueTag123</span>
                </div>
              </div>
            </div>

            {/* User Details */}
            {selectedUser ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Profile */}
                <div className="md:col-span-1 bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md rounded-xl border border-red-900/20 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-red-900/30 to-transparent p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-red-700 to-red-900 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                        <User className="h-8 w-8 text-[#FFF6E0]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#FFF6E0]">{selectedUser.fullName || "Unnamed User"}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            selectedUser.banned?.current?.status 
                              ? 'bg-red-500/20 text-red-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {selectedUser.banned?.current?.status ? "BANNED" : "ACTIVE"}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-[#FFF6E0]/10 text-[#FFF6E0]/90 uppercase">
                            {selectedUser.userRole || "USER"}
                          </span>
                        </div>
                      </div>
                  </div>
                </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-[#FFF6E0]/60">User ID</label>
                        <div className="mt-1 p-2 bg-[#1A1B1F] rounded-lg text-sm text-[#FFF6E0]/90 break-all font-mono">
                          {selectedUser._id}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-[#FFF6E0]/60">Email</label>
                        <div className="mt-1 p-2 bg-[#1A1B1F] rounded-lg text-sm text-[#FFF6E0]/90">
                          {selectedUser.email}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-[#FFF6E0]/60">Unique Tag</label>
                        <div className="mt-1 p-2 bg-[#1A1B1F] rounded-lg text-sm text-[#FFF6E0]/90">
                          {selectedUser.uniqueTag || "N/A"}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-[#FFF6E0]/60">Account Created</label>
                        <div className="mt-1 p-2 bg-[#1A1B1F] rounded-lg text-sm text-[#FFF6E0]/90">
                          {new Date(selectedUser.createdAt).toLocaleString()}
                        </div>
                      </div>
                      
                      {selectedUser.banned?.current?.status && (
                        <div>
                          <label className="text-xs text-red-400">Ban Reason</label>
                          <div className="mt-1 p-2 bg-red-900/20 border border-red-900/30 rounded-lg text-sm text-[#FFF6E0]/90">
                            {selectedUser.banned.current.reason || "No reason provided"}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-red-900/20">
                      <h4 className="text-sm font-semibold mb-3 text-[#FFF6E0]/80">Absolute Powers</h4>
                      <div className="space-y-2">
                    <button
                      onClick={() => document.getElementById('editModal').classList.remove('hidden')}
                          className="w-full flex items-center justify-between px-4 py-3 bg-[#1A1B1F] hover:bg-[#31333A] rounded-lg transition-colors text-[#FFF6E0]/90"
                        >
                          <span className="flex items-center">
                            <Edit className="mr-2 h-4 w-4 text-yellow-400" />
                            <span className="text-sm">Edit JSON Data</span>
                          </span>
                          <ChevronRight className="h-4 w-4 text-[#FFF6E0]/50" />
                    </button>
                        
                    <button
                      onClick={resetPassword}
                          className="w-full flex items-center justify-between px-4 py-3 bg-[#1A1B1F] hover:bg-[#31333A] rounded-lg transition-colors text-[#FFF6E0]/90"
                        >
                          <span className="flex items-center">
                            <Key className="mr-2 h-4 w-4 text-blue-400" />
                            <span className="text-sm">Reset Password</span>
                          </span>
                          <ChevronRight className="h-4 w-4 text-[#FFF6E0]/50" />
                    </button>
                        
                    <button
                      onClick={showDeleteConfirmationModal}
                          className="w-full flex items-center justify-between px-4 py-3 bg-red-900/20 hover:bg-red-900/40 rounded-lg transition-colors text-[#FFF6E0]/90"
                        >
                          <span className="flex items-center">
                            <Trash2 className="mr-2 h-4 w-4 text-red-400" />
                            <span className="text-sm">Delete Account</span>
                          </span>
                          <ChevronRight className="h-4 w-4 text-[#FFF6E0]/50" />
                    </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* User Data and Actions */}
                <div className="md:col-span-2 space-y-6">
                  {/* User Actions Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={getUserDetails}
                      className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 p-6 rounded-xl border border-red-900/20 shadow-lg hover:shadow-xl transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-[#1A1B1F] rounded-lg">
                          <FileSearch className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#1A1B1F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="h-4 w-4 text-[#FFF6E0]/70" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">User Details</h3>
                      <p className="text-[#FFF6E0]/70 text-sm">View and edit detailed user information</p>
                    </button>
                    
                    <button
                      onClick={getUserMessages}
                      className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 p-6 rounded-xl border border-red-900/20 shadow-lg hover:shadow-xl transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-[#1A1B1F] rounded-lg">
                          <MessageSquare className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#1A1B1F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="h-4 w-4 text-[#FFF6E0]/70" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">View Messages</h3>
                      <p className="text-[#FFF6E0]/70 text-sm">Access all communications sent and received</p>
                    </button>
                    
                    <button
                      onClick={getUserLocationHistory}
                      className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 p-6 rounded-xl border border-red-900/20 shadow-lg hover:shadow-xl transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-[#1A1B1F] rounded-lg">
                          <Map className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#1A1B1F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="h-4 w-4 text-[#FFF6E0]/70" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">Location History</h3>
                      <p className="text-[#FFF6E0]/70 text-sm">Track historical and current location data</p>
                    </button>
                  </div>

                  {/* Message and Location Components */}
                  <OverlordMessage 
                    userId={selectedUser?._id} 
                    isOpen={showMessages} 
                    onClose={() => setShowMessages(false)}
                  />

                  <OverlordLocation 
                    userId={selectedUser?._id} 
                    isOpen={showLocationData} 
                    onClose={() => setShowLocationData(false)}
                  />
                  
                  <OverlordUserInfo
                    userId={selectedUser?._id}
                    isOpen={showUserInfo}
                    onClose={() => setShowUserInfo(false)}
                    onUpdate={handleUserUpdate}
                  />

                  {/* JSON Data Viewer */}
                  <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-6 rounded-xl border border-red-900/20 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Database className="mr-2 h-5 w-5 text-red-400" />
                        <span>Raw Data Profile</span>
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#FFF6E0]/60">
                        <Hash className="h-4 w-4" />
                        <span>ID: {selectedUser._id}</span>
                  </div>
                </div>
                    
                    <div className="overflow-y-auto max-h-96 bg-[#1A1B1F] p-4 rounded-lg font-mono text-sm leading-relaxed">
                      <pre className="text-[#FFF6E0]/80 whitespace-pre-wrap">
                        {JSON.stringify(selectedUser, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ) : !loading && userSearchInput ? (
              <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-8 rounded-xl border border-red-900/20 shadow-lg text-center">
                <User className="h-16 w-16 mx-auto text-[#FFF6E0]/20 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No User Found</h3>
                <p className="text-[#FFF6E0]/70 max-w-md mx-auto mb-6">
                  We couldn't find a user matching "{userSearchInput}". Try checking for typos or using a different identifier.
                </p>
                          <button
                  onClick={() => setUserSearchInput('')}
                  className="px-4 py-2 bg-[#31333A] hover:bg-[#31333A]/70 rounded-lg text-[#FFF6E0]/90 transition-colors inline-flex items-center"
                          >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Another Search
                          </button>
                      </div>
                    ) : (
              <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-8 rounded-xl border border-red-900/20 shadow-lg text-center">
                <div className="p-6 mb-4 mx-auto w-24 h-24 rounded-full bg-[#1A1B1F]/70 flex items-center justify-center">
                  <Search className="h-10 w-10 text-red-400/70" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Search For A User</h3>
                <p className="text-[#FFF6E0]/70 max-w-md mx-auto">
                  Enter a user's email, ID, or unique tag to access their complete profile and take administrative actions.
                </p>
                      </div>
                    )}
                          </div>
        )}

        {/* Database Operations Tab */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Database Query Panel */}
              <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-6 rounded-xl border border-red-900/20 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <Terminal className="mr-3 text-red-400" /> Database Query
                  </h2>
                  <div className="flex gap-2">
                          <button
                      onClick={fetchCollections}
                      className="p-2 rounded-lg bg-[#1A1B1F] hover:bg-[#1A1B1F]/70 text-[#FFF6E0]/70 hover:text-[#FFF6E0] transition-colors"
                      title="Refresh Collections"
                          >
                      <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                
                <form onSubmit={(e) => { e.preventDefault(); executeQuery(); }} className="space-y-4">
          <div>
                    <label className="block text-sm font-medium mb-2 text-[#FFF6E0]/80">Collection</label>
                  <select
                      className="w-full bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-700/50 appearance-none"
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                  >
                      {collections.length === 0 ? (
                        <option value="">No collections found</option>
                      ) : (
                        collections.map(collection => (
                      <option key={collection} value={collection}>{collection}</option>
                        ))
                      )}
                  </select>
                </div>
                
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#FFF6E0]/80">Operation</label>
                  <select
                      className="w-full bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-700/50 appearance-none"
                    value={dbOperation}
                    onChange={(e) => setDbOperation(e.target.value)}
                  >
                    <option value="find">Find Documents</option>
                    <option value="findOne">Find One Document</option>
                    <option value="updateOne">Update One Document</option>
                    <option value="updateMany">Update Many Documents</option>
                    <option value="deleteOne">Delete One Document</option>
                    <option value="deleteMany">Delete Many Documents</option>
                    <option value="insertOne">Insert One Document</option>
                    <option value="insertMany">Insert Many Documents</option>
                  </select>
                </div>
                
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-[#FFF6E0]/80">Query</label>
                      <span className="text-xs text-[#FFF6E0]/60">JSON Format</span>
                    </div>
                  <textarea
                      className="w-full bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg px-4 py-3 h-24 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-700/50"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder='{ "field": "value" }'
                  />
                </div>
                
                {dbOperation.includes('update') && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-[#FFF6E0]/80">Update Operations</label>
                        <span className="text-xs text-[#FFF6E0]/60">JSON Format</span>
                      </div>
                    <textarea
                        className="w-full bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg px-4 py-3 h-24 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-700/50"
                      value={updateInput}
                      onChange={(e) => setUpdateInput(e.target.value)}
                      placeholder='{ "$set": { "field": "newValue" } }'
                    />
                  </div>
                )}
                
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-[#FFF6E0]/80">Options</label>
                      <span className="text-xs text-[#FFF6E0]/60">JSON Format</span>
                    </div>
                  <textarea
                      className="w-full bg-[#1A1B1F] border border-red-900/30 text-[#FFF6E0]/90 rounded-lg px-4 py-3 h-16 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-700/50"
                    value={optionsInput}
                    onChange={(e) => setOptionsInput(e.target.value)}
                      placeholder='{ "limit": 10, "sort": { "createdAt": -1 } }'
                  />
                </div>
                
                  <div className="flex gap-3">
                  <button
                      type="submit"
                      className={`flex-grow px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                        loading
                          ? 'bg-red-900/30 text-red-400/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-700 to-red-900 text-[#FFF6E0] hover:from-red-600 hover:to-red-800'
                      }`}
                    disabled={loading}
                  >
                      {loading ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          <span>Processing</span>
                        </>
                      ) : (
                        <>
                          <Terminal className="h-5 w-5" />
                          <span>Execute Query</span>
                        </>
                      )}
                  </button>
                  
                  <button
                      type="button"
                    onClick={createBackup}
                    disabled={loading || backupsLoading}
                      className="px-4 py-3 bg-[#1A1B1F] hover:bg-[#1A1B1F]/80 text-[#FFF6E0]/90 rounded-lg transition-colors flex items-center gap-2"
                  >
                      <FileDown className="h-5 w-5" />
                      <span>Create Backup</span>
                  </button>
                </div>
                </form>
              </div>
              
              {/* Query Results Panel */}
              <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-6 rounded-xl border border-red-900/20 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <Database className="mr-3 text-red-400" /> Query Results
                  </h2>
                </div>
                
                {queryResult ? (
                  <div className="relative">
                    <pre className="overflow-y-auto max-h-[500px] bg-[#1A1B1F] p-4 rounded-lg font-mono text-[#FFF6E0]/80 text-sm whitespace-pre-wrap break-all border border-red-900/20">
                      {JSON.stringify(queryResult, null, 2)}
                    </pre>
                    <div className="absolute bottom-3 right-3">
                      <button 
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText(JSON.stringify(queryResult, null, 2));
                            toast.success('Copied to clipboard');
                          } catch (err) {
                            toast.error('Failed to copy');
                          }
                        }}
                        className="p-2 rounded-lg bg-[#31333A] hover:bg-[#31333A]/70 text-[#FFF6E0]/70 hover:text-[#FFF6E0] transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[500px] bg-[#1A1B1F] rounded-lg text-[#FFF6E0]/50 border border-red-900/20">
                    <Database className="h-16 w-16 mb-4 opacity-30" />
                    <p>No query results to display</p>
                    <p className="text-sm mt-2">Execute a query to see results here</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Backups Management */}
            <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <HardDrive className="mr-3 text-red-400" /> Database Backups
                </h2>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 bg-[#1A1B1F] hover:bg-[#1A1B1F]/80 text-[#FFF6E0]/90 rounded-lg transition-colors flex items-center gap-2"
                    onClick={fetchBackups}
                    disabled={backupsLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${backupsLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-[#FFF6E0] rounded-lg transition-colors flex items-center gap-2"
                    onClick={createBackup}
                    disabled={loading || backupsLoading}
                  >
                    <FileDown className="h-4 w-4" />
                    <span>Create Backup</span>
                  </button>
                </div>
              </div>
              
              {backupsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-10 w-10 text-red-400 animate-spin mb-4" />
                    <p className="text-[#FFF6E0]/70">Loading backups...</p>
                  </div>
                </div>
              ) : backups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#FFF6E0]/60">
                  <HardDrive className="h-16 w-16 mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">No backups found</p>
                  <p className="text-sm mb-6 max-w-md text-center">
                    Create a backup to protect your database from data loss or corruption
                  </p>
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-[#FFF6E0] rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                    onClick={createBackup}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Create First Backup</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#1A1B1F]/80 text-left">
                        <th className="px-4 py-3 rounded-tl-lg font-medium text-sm text-[#FFF6E0]/80">Name</th>
                        <th className="px-4 py-3 font-medium text-sm text-[#FFF6E0]/80">Type</th>
                        <th className="px-4 py-3 font-medium text-sm text-[#FFF6E0]/80">Size</th>
                        <th className="px-4 py-3 font-medium text-sm text-[#FFF6E0]/80">Created</th>
                        <th className="px-4 py-3 rounded-tr-lg font-medium text-sm text-[#FFF6E0]/80">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-900/10">
                      {backups.map((backup) => (
                        <tr key={backup.path} className="hover:bg-[#1A1B1F]/30 transition-colors">
                          <td className="px-4 py-3 flex items-center">
                            <div className="p-1 bg-[#1A1B1F] rounded-md mr-3 flex items-center justify-center">
                            {getFileIcon(backup)}
                            </div>
                            <span className="text-[#FFF6E0]/90">{backup.name}</span>
                          </td>
                          <td className="px-4 py-3 text-[#FFF6E0]/70">
                            {backup.isDirectory ? 'Directory' : backup.type.replace('.', '').toUpperCase()}
                          </td>
                          <td className="px-4 py-3 text-[#FFF6E0]/70">{formatFileSize(backup.size)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center text-[#FFF6E0]/70">
                              <Clock className="h-4 w-4 mr-2 opacity-60" />
                              <span>{new Date(backup.created).toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                            <button
                              onClick={() => deleteBackupFile(backup.path)}
                                className="p-2 bg-red-900/20 hover:bg-red-900/40 rounded-lg transition-colors"
                              title="Delete backup"
                            >
                                <Trash2 className="h-4 w-4 text-red-400" />
                            </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Operations Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Security Header with Force Logout All */}
            <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-6 rounded-xl border border-red-900/20 shadow-lg">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
                  <h2 className="text-xl font-bold flex items-center mb-2">
                    <Shield className="mr-3 text-red-400" /> Security Operations
                  </h2>
                  <p className="text-[#FFF6E0]/70 max-w-xl">
                    Manage active user sessions across all devices. These actions affect user access immediately.
                  </p>
                </div>
                
                <div className="flex gap-3">
                <button
                  onClick={fetchActiveSessions}
                    className="px-4 py-2 bg-[#1A1B1F] hover:bg-[#1A1B1F]/80 text-[#FFF6E0]/90 rounded-lg transition-colors flex items-center gap-2"
                    disabled={loading}
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
                  
                <button
                  onClick={forceLogoutAllUsers}
                    className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-[#FFF6E0] rounded-lg transition-colors flex items-center gap-2"
                    disabled={loading}
                >
                    <UserX className="h-4 w-4" />
                    <span>Force Logout ALL</span>
                </button>
                </div>
              </div>
            </div>
            
            {/* Active Sessions */}
            {loading ? (
              <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-12 rounded-xl border border-red-900/20 shadow-lg flex justify-center">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-12 w-12 text-red-400 animate-spin mb-4" />
                  <p className="text-[#FFF6E0]/70">Loading active sessions...</p>
                </div>
              </div>
            ) : activeSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeSessions.map(user => (
                  <div key={user._id} className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-6 rounded-xl border border-red-900/20 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gradient-to-br from-red-700 to-red-900 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                          <User className="h-6 w-6 text-[#FFF6E0]" />
                        </div>
                      <div>
                          <h3 className="text-lg font-semibold text-[#FFF6E0]">
                            {user.fullName || "Unnamed User"}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-[#FFF6E0]/70">
                            <span>{user.email}</span>
                            <span className="hidden sm:inline text-[#FFF6E0]/30">•</span>
                            <span>{user.uniqueTag}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => forceLogoutUser(user._id)}
                        className="px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg transition-colors flex items-center gap-1.5 text-sm"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout User</span>
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-[#FFF6E0]/90 flex items-center">
                          <Activity className="h-4 w-4 mr-2 text-red-400" />
                          <span>Active Sessions ({user.activeSessions.length})</span>
                        </h4>
                        <span className="text-xs px-2 py-1 bg-[#1A1B1F] rounded-full text-[#FFF6E0]/60">
                          {user.userRole || "user"}
                        </span>
                      </div>
                      
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {user.activeSessions.map(session => (
                          <div key={session._id} className="bg-[#1A1B1F] p-3 rounded-lg border border-red-900/10">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                  <p className="text-sm font-medium">{session.deviceInfo || "Unknown Device"}</p>
                                </div>
                                <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-[#FFF6E0]/60">
                                  <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    IP: {session.ip || "Unknown"}
                                  </span>
                                  <span className="hidden sm:inline text-[#FFF6E0]/30">•</span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                  Last active: {new Date(session.lastActive).toLocaleString()}
                                  </span>
                              </div>
                              </div>
                              
                              
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#272829]/90 to-[#31333A]/90 backdrop-blur-md p-12 rounded-xl border border-red-900/20 shadow-lg flex flex-col items-center text-center">
                <div className="p-8 mb-4 rounded-full bg-[#1A1B1F] flex items-center justify-center">
                  <Shield className="h-16 w-16 text-[#FFF6E0]/10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Active Sessions</h3>
                <p className="text-[#FFF6E0]/70 max-w-md">
                  There are currently no active user sessions in the system. Users will appear here when they log in.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverlordPage;