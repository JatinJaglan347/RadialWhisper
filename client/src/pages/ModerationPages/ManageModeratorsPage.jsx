import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { 
  Shield, Search, RefreshCw, ChevronLeft, ChevronRight, 
  UserMinus, UserPlus, Users, BadgeCheck, BadgeMinus, X, Eye
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const ManageModeratorsPage = () => {
  const { 
    getUsers, 
    usersData, 
    totalPages, 
    currentPage, 
    isFetchingUsers, 
    adminSearchUser, 
    searchedUser, 
    isSearchingUser,
    promoteDemoteUser,
    isUpdatingRole
  } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('email');
  const [showPromoteConfirm, setShowPromoteConfirm] = useState(false);
  const [showDemoteConfirm, setShowDemoteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  const navigate = useNavigate();
  
  // Fixed filters to only show moderators or users we can promote
  const [activeTab, setActiveTab] = useState('moderators'); // 'moderators' or 'potential'
  
  useEffect(() => {
    // When tab changes, update the filters and fetch users
    const roleFilter = activeTab === 'moderators' ? 'moderator' : 'normalUser';
    const bannedStatus = statusFilter !== 'all' ? statusFilter === 'active' ? 'false' : 'true' : '';
    
    getUsers({ role: roleFilter, bannedStatus }, 1);
  }, [activeTab, statusFilter]);
  
  useEffect(() => {
    // Initial data fetch
    getUsers({ role: 'moderator' }, 1);
  }, []);
  
  const [moderatorStats, setModeratorStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  
  useEffect(() => {
    // Calculate stats from usersData
    if (usersData) {
      const active = usersData.filter(user => !user.banned?.current?.status).length;
      setModeratorStats({
        total: usersData.length,
        active: active,
        inactive: usersData.length - active
      });
    }
  }, [usersData]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      const roleFilter = activeTab === 'moderators' ? 'moderator' : 'normalUser';
      const bannedStatus = statusFilter !== 'all' ? statusFilter === 'active' ? 'false' : 'true' : '';
      getUsers({ role: roleFilter, bannedStatus }, page);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    const searchParams = {};
    searchParams[searchType] = searchQuery.trim();
    
    // Add role filter to search to maintain context
    if (activeTab === 'moderators') {
      searchParams.role = 'moderator';
    } else if (activeTab === 'potential') {
      searchParams.role = 'normalUser';
    }
    
    adminSearchUser(searchParams);
  };
  
  const initiatePromote = (user) => {
    setSelectedUser(user);
    setShowPromoteConfirm(true);
  };
  
  const initiateDemote = (user) => {
    setSelectedUser(user);
    setShowDemoteConfirm(true);
  };
  
  const handlePromote = async () => {
    if (!selectedUser) return;
    
    try {
      await promoteDemoteUser({
        input: selectedUser.email,
        promote: true,
        actionBy: { reason: "Promoted to moderator" }
      });
      
      // Refresh the list
      const roleFilter = activeTab === 'moderators' ? 'moderator' : 'normalUser';
      const bannedStatus = statusFilter !== 'all' ? statusFilter === 'active' ? 'false' : 'true' : '';
      getUsers({ role: roleFilter, bannedStatus }, currentPage);
      setShowPromoteConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error during promotion', error);
    }
  };
  
  const handleDemote = async () => {
    if (!selectedUser) return;
    
    try {
      await promoteDemoteUser({
        input: selectedUser.email,
        promote: false,
        actionBy: { reason: "Demoted from moderator" }
      });
      
      // Refresh the list
      const roleFilter = activeTab === 'moderators' ? 'moderator' : 'normalUser';
      const bannedStatus = statusFilter !== 'all' ? statusFilter === 'active' ? 'false' : 'true' : '';
      getUsers({ role: roleFilter, bannedStatus }, currentPage);
      setShowDemoteConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error during demotion', error);
    }
  };
  
  // Display combined data: searched user + paginated users
  const displayData = searchedUser ? [searchedUser] : usersData;

  return (
    <div className="bg-[#272829] text-[#FFF6E0] p-4 md:p-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-2">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-3 py-1 rounded-full text-xs md:text-sm font-medium">
              Admin Panel
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
            Manage Moderators
          </h1>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex mb-4 border-b border-[#61677A]/30">
        <button 
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'moderators' 
            ? 'border-b-2 border-[#FFF6E0] text-[#FFF6E0]' 
            : 'text-[#FFF6E0]/60 hover:text-[#FFF6E0]/80 transition-colors'}`}
          onClick={() => setActiveTab('moderators')}
        >
          <span className="flex items-center">
            <Shield size={16} className="mr-2" />
            Current Moderators
          </span>
        </button>
        
        <button 
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'potential' 
            ? 'border-b-2 border-[#FFF6E0] text-[#FFF6E0]' 
            : 'text-[#FFF6E0]/60 hover:text-[#FFF6E0]/80 transition-colors'}`}
          onClick={() => setActiveTab('potential')}
        >
          <span className="flex items-center">
            <UserPlus size={16} className="mr-2" />
            Potential Moderators
          </span>
        </button>
      </div>

      {/* Search Bar and Status Filter */}
      <div className="flex gap-4 mb-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2 bg-[#31333A]/70 rounded-lg border border-[#61677A]/30 p-3">
          <div className="w-32">
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm"
            >
              <option value="email">Email</option>
              <option value="uniqueTag">Unique Tag</option>
            </select>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'moderators' ? 'moderators' : 'potential moderators'} by ${searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-[#FFF6E0] text-[#272829] py-2 px-4 rounded-lg font-medium hover:bg-[#D8D9DA] transition-colors text-sm flex items-center justify-center"
            disabled={isSearchingUser || !searchQuery.trim()}
          >
            {isSearchingUser ? (
              <span className="flex items-center justify-center">
                <RefreshCw size={14} className="animate-spin mr-2" />
                Searching...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Search size={14} className="mr-2" />
                Search
              </span>
            )}
          </button>
          {searchedUser && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                useAuthStore.setState({ searchedUser: null });
              }}
              className="bg-[#272829] text-[#FFF6E0] py-2 px-4 rounded-lg hover:bg-[#272829]/70 transition-colors text-sm flex items-center justify-center"
            >
              <X size={14} className="mr-2" />
              Clear
            </button>
          )}
        </form>
        
        {/* Status Filter */}
        <div className="bg-[#31333A]/70 rounded-lg border border-[#61677A]/30 p-3 flex items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {activeTab === 'moderators' ? (
          <>
            <StatCard icon={<Shield size={20} />} label="Total Moderators" value={moderatorStats.total} />
            <StatCard icon={<BadgeCheck size={20} />} label="Active" value={moderatorStats.active} />
            <StatCard icon={<BadgeMinus size={20} />} label="Inactive" value={moderatorStats.inactive} />
          </>
        ) : (
          <>
            <StatCard icon={<Users size={20} />} label="Potential Moderators" value={displayData?.length || 0} />
            <StatCard icon={<BadgeCheck size={20} />} label="Page" value={searchedUser ? 1 : currentPage} />
            <StatCard icon={<BadgeMinus size={20} />} label="Total Pages" value={searchedUser ? 1 : totalPages} />
          </>
        )}
      </div>
      
      {/* Moderators Table */}
      <div className="bg-[#31333A]/70 rounded-lg border border-[#61677A]/30 overflow-hidden">
        {(isFetchingUsers && currentPage === 1) || isSearchingUser ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw size={24} className="animate-spin text-[#FFF6E0]/70" />
          </div>
        ) : displayData?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#272829]/50 text-left">
                  <th className="p-3 font-medium text-sm">Name</th>
                  <th className="p-3 font-medium text-sm">Email</th>
                  <th className="p-3 font-medium text-sm">Status</th>
                  <th className="p-3 font-medium text-sm">Joined</th>
                  <th className="p-3 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((user) => (
                  <tr key={user._id} className={`border-t border-[#61677A]/20 hover:bg-[#272829]/30 ${searchedUser && user._id === searchedUser._id ? 'bg-[#FFF6E0]/5' : ''}`}>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-[#FFF6E0]/10 flex items-center justify-center mr-2 text-sm">
                          {user.fullName?.charAt(0) || "U"}
                        </div>
                        <span className="text-sm">{user.fullName || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="p-3 text-[#FFF6E0]/80 text-sm">{user.email}</td>
                    <td className="p-3">
                      <StatusBadge isBanned={user.banned?.current?.status} />
                    </td>
                    <td className="p-3 text-[#FFF6E0]/80 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {activeTab === 'moderators' ? (
                        <button 
                          onClick={() => initiateDemote(user)}
                          className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 flex items-center"
                          disabled={isUpdatingRole}
                          title="Demote to User"
                        >
                          <UserMinus size={12} className="mr-1" />
                          <span className="text-xs">Demote</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => initiatePromote(user)}
                          className="p-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 flex items-center"
                          disabled={isUpdatingRole}
                          title="Promote to Moderator"
                        >
                          <UserPlus size={12} className="mr-1" />
                          <span className="text-xs">Promote</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-[#FFF6E0]/70">
            <Shield size={32} className="mb-3 opacity-50" />
            <p className="text-base">No {activeTab === 'moderators' ? 'moderators' : 'potential moderators'} found</p>
            <p className="text-xs">Try adjusting your search</p>
          </div>
        )}
        
        {/* Pagination Controls - Only show when not in search mode */}
        {!searchedUser && usersData?.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-[#61677A]/20 p-3 gap-2">
            <div className="text-xs text-[#FFF6E0]/70">
              {usersData.length} {activeTab === 'moderators' ? 'moderators' : 'users'}
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isFetchingUsers}
                className={`p-1.5 rounded-lg ${
                  currentPage <= 1 ? 'text-[#FFF6E0]/30 bg-[#272829]/30' : 'bg-[#272829] text-[#FFF6E0] hover:bg-[#272829]/70'
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="bg-[#272829] rounded-lg">
                <span className="px-3 py-1.5 text-xs inline-block">
                  Page {currentPage} / {totalPages}
                </span>
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isFetchingUsers}
                className={`p-1.5 rounded-lg ${
                  currentPage >= totalPages ? 'text-[#FFF6E0]/30 bg-[#272829]/30' : 'bg-[#272829] text-[#FFF6E0] hover:bg-[#272829]/70'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isFetchingUsers}
              className={`px-3 py-1.5 rounded-lg text-xs ${
                currentPage >= totalPages ? 'bg-[#FFF6E0]/30 text-[#272829]/50' : 'bg-[#FFF6E0] text-[#272829] hover:bg-[#D8D9DA]'
              } transition-colors`}
            >
              {isFetchingUsers ? (
                <span className="flex items-center">
                  <RefreshCw size={12} className="animate-spin mr-1" />
                  Loading...
                </span>
              ) : (
                "Next Page"
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Promote Modal - Simplified without reason field */}
      {showPromoteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#31333A] rounded-lg p-4 md:p-6 max-w-md w-full mx-4 md:mx-0">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <UserPlus size={20} className="mr-2 text-green-400" />
              Promote to Moderator
            </h3>
            
            <div className="bg-[#272829] p-3 rounded-lg mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#FFF6E0]/10 flex items-center justify-center mr-2">
                  {selectedUser?.fullName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium">{selectedUser?.fullName || "Unknown"}</p>
                  <p className="text-xs text-[#FFF6E0]/70">{selectedUser?.email}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-[#FFF6E0]/70 mb-4">
              Are you sure you want to promote this user to moderator? They will have access to moderation tools and features.
            </p>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowPromoteConfirm(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 bg-[#272829] text-[#FFF6E0] rounded-lg hover:bg-[#272829]/70 transition-colors text-sm"
                disabled={isUpdatingRole}
              >
                Cancel
              </button>
              <button
                onClick={handlePromote}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center"
                disabled={isUpdatingRole}
              >
                {isUpdatingRole ? (
                  <span className="flex items-center">
                    <RefreshCw size={14} className="animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserPlus size={14} className="mr-2" />
                    Confirm Promotion
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Demote Modal - Simplified without reason field */}
      {showDemoteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#31333A] rounded-lg p-4 md:p-6 max-w-md w-full mx-4 md:mx-0">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <UserMinus size={20} className="mr-2 text-red-400" />
              Demote Moderator
            </h3>
            
            <div className="bg-[#272829] p-3 rounded-lg mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#FFF6E0]/10 flex items-center justify-center mr-2">
                  {selectedUser?.fullName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium">{selectedUser?.fullName || "Unknown"}</p>
                  <p className="text-xs text-[#FFF6E0]/70">{selectedUser?.email}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-[#FFF6E0]/70 mb-4">
              This action will remove all moderator privileges from this user. They will become a normal user.
            </p>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowDemoteConfirm(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 bg-[#272829] text-[#FFF6E0] rounded-lg hover:bg-[#272829]/70 transition-colors text-sm"
                disabled={isUpdatingRole}
              >
                Cancel
              </button>
              <button
                onClick={handleDemote}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center"
                disabled={isUpdatingRole}
              >
                {isUpdatingRole ? (
                  <span className="flex items-center">
                    <RefreshCw size={14} className="animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserMinus size={14} className="mr-2" />
                    Confirm Demotion
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ isBanned }) => {
  return isBanned ? (
    <span className="px-1.5 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">
      Inactive
    </span>
  ) : (
    <span className="px-1.5 py-0.5 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
      Active
    </span>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, label, value }) => (
  <div className="p-2 md:p-3 bg-[#31333A]/70 rounded-lg border border-[#61677A]/30">
    <div className="flex items-center">
      <div className="p-1.5 bg-[#FFF6E0]/10 rounded-lg mr-2 text-[#FFF6E0]">
        {icon}
      </div>
      <div>
        <h3 className="text-xs text-[#FFF6E0]/70">{label}</h3>
        <p className="text-sm md:text-base font-bold">{value.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

export default ManageModeratorsPage;