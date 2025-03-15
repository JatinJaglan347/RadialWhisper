import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { 
  Users, Filter, Search, Shield, X, UserX, RefreshCw, ChevronLeft, ChevronRight, Eye
} from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";

const ManageUsersPage = () => {
  const { getUsers, usersData, totalPages, currentPage, isFetchingUsers } = useAuthStore();
  const [filters, setFilters] = useState({
    gender: '',
    bannedStatus: '',
    role: '',
    registeredAfter: '',
    registeredBefore: '',
    minAge: '',
    maxAge: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    getUsers({}, 1);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'registeredAfter' && filters.registeredBefore && value > filters.registeredBefore) {
      setFilters(prev => ({
        ...prev,
        [name]: value,
        registeredBefore: value
      }));
    } else if (name === 'registeredBefore' && filters.registeredAfter && value < filters.registeredAfter) {
      return;
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    getUsers(filters, 1);
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      gender: '',
      bannedStatus: '',
      role: '',
      registeredAfter: '',
      registeredBefore: '',
      minAge: '',
      maxAge: ''
    });
    getUsers({}, 1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      getUsers(filters, page);
    }
  };
  
  // Updated to only pass email to the modrateUser route
  const handleViewClick = (userEmail) => {
    navigate(`${location.pathname}/modrateUser`, { state: { userEmail } });
  };
  
  

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
            Manage Users
          </h1>
        </div>
        
        {/* Toggle Filter Button (Mobile) */}
        <button 
          className="md:hidden bg-[#31333A] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? <X size={18} /> : <Filter size={18} />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filter Panel */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5 bg-[#31333A]/70 rounded-lg border border-[#61677A]/30 p-3 h-fit sticky top-4`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center">
              <Filter size={16} className="mr-2" />
              Filters
            </h2>
            <button 
              onClick={resetFilters}
              className="text-xs text-[#FFF6E0]/70 hover:text-[#FFF6E0] flex items-center"
            >
              <RefreshCw size={12} className="mr-1" />
              Reset
            </button>
          </div>
          
          <form onSubmit={handleFilterSubmit} className="space-y-3">
            {/* Gender Filter */}
            <div>
              <label className="block text-xs font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm"
              >
                <option value="">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Ban Status Filter */}
            <div>
              <label className="block text-xs font-medium mb-1">Ban Status</label>
              <select
                name="bannedStatus"
                value={filters.bannedStatus}
                onChange={handleFilterChange}
                className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm"
              >
                <option value="">All</option>
                <option value="true">Banned</option>
                <option value="false">Not Banned</option>
              </select>
            </div>
            
            {/* Role Filter */}
            <div>
              <label className="block text-xs font-medium mb-1">Role</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm"
              >
                <option value="">All</option>
                <option value="normalUser">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="king">King</option>
              </select>
            </div>
            
            {/* Date & Age Filters */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Min Age</label>
                <input
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  min="0"
                  className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Max Age</label>
                <input
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  min="0"
                  className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">Registered After</label>
              <input
                type="date"
                name="registeredAfter"
                value={filters.registeredAfter}
                onChange={handleFilterChange}
                className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">Registered Before</label>
              <input
                type="date"
                name="registeredBefore"
                value={filters.registeredBefore}
                onChange={handleFilterChange}
                min={filters.registeredAfter}
                className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#FFF6E0] text-[#272829] py-2 px-4 rounded-lg font-medium hover:bg-[#D8D9DA] transition-colors text-sm"
              disabled={isFetchingUsers}
            >
              {isFetchingUsers ? (
                <span className="flex items-center justify-center">
                  <RefreshCw size={14} className="animate-spin mr-2" />
                  Fetching...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Search size={14} className="mr-2" />
                  Apply Filters
                </span>
              )}
            </button>
          </form>
        </div>
        
        {/* Users Table */}
        <div className="flex-1">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
            <StatCard icon={<Users size={20} />} label="Total Fetched" value={usersData?.length || 0} />
            <StatCard icon={<Shield size={20} />} label="Page" value={currentPage} />
            <StatCard icon={<UserX size={20} />} label="Total Pages" value={totalPages} />
          </div>
          
          {/* Users Table */}
          <div className="bg-[#31333A]/70 rounded-lg border border-[#61677A]/30 overflow-hidden">
            {isFetchingUsers && currentPage === 1 ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw size={24} className="animate-spin text-[#FFF6E0]/70" />
              </div>
            ) : usersData?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#272829]/50 text-left">
                      <th className="p-3 font-medium text-sm">Name</th>
                      <th className="p-3 font-medium text-sm">Email</th>
                      <th className="p-3 font-medium text-sm">Role</th>
                      <th className="p-3 font-medium text-sm">Status</th>
                      <th className="p-3 font-medium text-sm">Joined</th>
                      <th className="p-3 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.map((user) => (
                      <tr key={user._id} className="border-t border-[#61677A]/20 hover:bg-[#272829]/30">
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
                          <RoleBadge role={user.userRole} />
                        </td>
                        <td className="p-3">
                          <StatusBadge isBanned={user.banned?.current?.status} />
                        </td>
                        <td className="p-3 text-[#FFF6E0]/80 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <button 
                            onClick={() => handleViewClick(user.email)}
                            className="p-1.5 bg-[#FFF6E0]/10 rounded-lg hover:bg-[#FFF6E0]/20 flex items-center"
                            title="Moderate User"
                          >
                            <Eye size={12} className="mr-1" />
                            <span className="text-xs">Moderate</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-[#FFF6E0]/70">
                <Users size={32} className="mb-3 opacity-50" />
                <p className="text-base">No users found</p>
                <p className="text-xs">Try adjusting your filters</p>
              </div>
            )}
            
            {/* Pagination Controls */}
            {usersData?.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center border-t border-[#61677A]/20 p-3 gap-2">
                <div className="text-xs text-[#FFF6E0]/70">
                  {usersData.length} users
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
                  }`}
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
        </div>
      </div>
    </div>
  );
};

// Role Badge Component
const RoleBadge = ({ role }) => {
  const roleStyles = {
    admin: "bg-[#FFB74D]/20 text-[#FFB74D] border-[#FFB74D]/30",
    moderator: "bg-[#4FC3F7]/20 text-[#4FC3F7] border-[#4FC3F7]/30",
    king: "bg-[#E040FB]/20 text-[#E040FB] border-[#E040FB]/30",
    user: "bg-[#D8D9DA]/20 text-[#D8D9DA] border-[#D8D9DA]/30"
  };
  
  const roleMap = {
    normalUser: "user",
    admin: "admin",
    moderator: "moderator",
    king: "king"
  };
  
  const mappedRole = roleMap[role] || "user";
  
  return (
    <span className={`px-1.5 py-0.5 rounded text-xs border ${roleStyles[mappedRole] || roleStyles.user}`}>
      {mappedRole || "user"}
    </span>
  );
};

// Status Badge Component
const StatusBadge = ({ isBanned }) => {
  return isBanned ? (
    <span className="px-1.5 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">
      Banned
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

export default ManageUsersPage;