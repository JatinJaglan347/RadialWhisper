import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore.js";
import {
  Shield,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Users,
  BadgeCheck,
  BadgeMinus,
  X,
  AlertCircle,
  History,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ManageBansPage = () => {
  const {
    authUser,
    getUsers,
    usersData,
    totalPages,
    currentPage,
    isFetchingUsers,
    adminSearchUser,
    searchedUser,
    isSearchingUser,
    banUnbanUser,
    isUpdatingBanStatus,
  } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("email");
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [showUnbanConfirm, setShowUnbanConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [unbanReason, setUnbanReason] = useState("Unbanned");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBanHistory, setShowBanHistory] = useState(false);

  const navigate = useNavigate();

  // Fixed filters to show banned or active users
  const [activeTab, setActiveTab] = useState("banned"); // 'banned' or 'active'

  useEffect(() => {
    // When tab changes, update the filters and fetch users
    const bannedStatus = activeTab === "banned" ? "true" : "false";

    getUsers({ bannedStatus }, 1);
  }, [activeTab]);

  useEffect(() => {
    // Initial data fetch - start with banned users
    getUsers({ bannedStatus: "true" }, 1);
  }, []);

  const [userStats, setUserStats] = useState({
    total: 0,
    banned: 0,
    active: 0,
  });

  useEffect(() => {
    // Calculate stats from usersData
    if (usersData) {
      const banned = usersData.filter(
        (user) => user.banned?.current?.status
      ).length;
      setUserStats({
        total: usersData.length,
        banned: banned,
        active: usersData.length - banned,
      });
    }
  }, [usersData]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      const bannedStatus = activeTab === "banned" ? "true" : "false";
      getUsers({ bannedStatus }, page);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    const searchParams = {};
    searchParams[searchType] = searchQuery.trim();

    // Add ban status filter to search to maintain context
    if (activeTab === "banned") {
      searchParams.bannedStatus = "true";
    } else if (activeTab === "active") {
      searchParams.bannedStatus = "false";
    }

    adminSearchUser(searchParams);
  };

  // Update the initiateBan function to add these constraints
  const initiateBan = (user) => {
    // Check if user has "king" role
    if (user.userRole === "king") {
      toast.error("This user cannot be banned");
      return;
    }
    // Check if user is an admin and current user is a moderator
    if (
      user.userRole === "admin" &&
      authUser?.data?.user?.userRole === "moderator"
    ) {
      toast.error("Moderators cannot ban admins");
      return;
    }

    // Check if user is trying to ban themselves
    const currentUserId = authUser?.data?.user?._id?.toString("userId");
    if (user._id === currentUserId) {
      toast.error("You cannot ban yourself");
      return;
    }

    setSelectedUser(user);
    setShowBanConfirm(true);
  };

  const initiateUnban = (user) => {
    setSelectedUser(user);
    setShowUnbanConfirm(true);
  };

  const viewBanHistory = (user) => {
    setSelectedUser(user);
    setShowBanHistory(true);
  };

  const handleBan = async () => {
    if (!selectedUser || !banReason.trim()) return;

    // Double-check to ensure king users can't be banned
    if (selectedUser.userRole === "king") {
      toast.error("This user cannot be banned");
      setShowBanConfirm(false);
      setSelectedUser(null);
      setBanReason("");
      return;
    }
    // Double-check to ensure moderators can't ban admins
    if (
      selectedUser.userRole === "admin" &&
      authUser?.data?.user?.userRole === "moderator"
    ) {
      toast.error("Moderators cannot ban admins");
      setShowBanConfirm(false);
      setSelectedUser(null);
      setBanReason("");
      return;
    }

    // Double-check to ensure users can't ban themselves
    const currentUserId = authUser?.data?.user?._id?.toString("userId");
    if (selectedUser._id === currentUserId) {
      toast.error("You cannot ban yourself");
      setShowBanConfirm(false);
      setSelectedUser(null);
      setBanReason("");
      return;
    }

    try {
      await banUnbanUser({
        input: selectedUser.email,
        banStatus: true,
        banReason: banReason,
        banActionBy: localStorage.getItem("userId"),
      });

      // Refresh the list
      const bannedStatus = activeTab === "banned" ? "true" : "false";
      getUsers({ bannedStatus }, currentPage);
      setShowBanConfirm(false);
      setSelectedUser(null);
      setBanReason("");
      toast.success(`${selectedUser.fullName || "User"} has been banned`);
    } catch (error) {
      console.error("Error during ban", error);
      toast.error("Failed to ban user");
    }
  };

  const handleUnban = async () => {
    if (!selectedUser) return;

    try {
      await banUnbanUser({
        input: selectedUser.email,
        banStatus: false, // This should be banStatus, not status
        banReason: unbanReason, // This should be banReason, not reason
        banActionBy: localStorage.getItem("userId"), // Add this field
      });

      // Refresh the list
      const bannedStatus = activeTab === "banned" ? "true" : "false";
      getUsers({ bannedStatus }, currentPage);
      setShowUnbanConfirm(false);
      setSelectedUser(null);
      setUnbanReason("Unbanned");
    } catch (error) {
      console.error("Error during unban", error);
    }
  };

  // Display combined data: searched user + paginated users
  const displayData = searchedUser ? [searchedUser] : usersData;

  return (
    <div className="bg-[#272829] text-[#FFF6E0] p-4 md:p-6  min-h-screen ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-2">
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-3 py-1 rounded-full text-xs md:text-sm font-medium">
              Admin Panel
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
            Manage User Bans
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-4 border-b border-[#61677A]/30">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "banned"
              ? "border-b-2 border-[#FFF6E0] text-[#FFF6E0]"
              : "text-[#FFF6E0]/60 hover:text-[#FFF6E0]/80 transition-colors"
          }`}
          onClick={() => setActiveTab("banned")}
        >
          <span className="flex items-center">
            <UserX size={16} className="mr-2" />
            Banned Users
          </span>
        </button>

        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "active"
              ? "border-b-2 border-[#FFF6E0] text-[#FFF6E0]"
              : "text-[#FFF6E0]/60 hover:text-[#FFF6E0]/80 transition-colors"
          }`}
          onClick={() => setActiveTab("active")}
        >
          <span className="flex items-center">
            <UserCheck size={16} className="mr-2" />
            Active Users
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 mb-4">
        <form
          onSubmit={handleSearch}
          className="flex-1 flex gap-2 bg-[#31333A]/70 rounded-lg border border-[#61677A]/30 p-3"
        >
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
              placeholder={`Search ${
                activeTab === "banned" ? "banned" : "active"
              } users by ${searchType}...`}
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
                setSearchQuery("");
                useAuthStore.setState({ searchedUser: null });
              }}
              className="bg-[#272829] text-[#FFF6E0] py-2 px-4 rounded-lg hover:bg-[#272829]/70 transition-colors text-sm flex items-center justify-center"
            >
              <X size={14} className="mr-2" />
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard
          icon={<Users size={20} />}
          label="Total Users"
          value={displayData?.length || 0}
        />
        <StatCard
          icon={<UserX size={20} />}
          label={`${activeTab === "banned" ? "Current" : "Banned"}`}
          value={userStats.banned}
        />
        <StatCard
          icon={<UserCheck size={20} />}
          label={`${activeTab === "active" ? "Current" : "Active"}`}
          value={userStats.active}
        />
      </div>

      {/* Users Table */}
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
                  <th className="p-3 font-medium text-sm">Reason</th>
                  <th className="p-3 font-medium text-sm">Date</th>
                  <th className="p-3 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((user) => (
                  <tr
                    key={user._id}
                    className={`border-t border-[#61677A]/20 hover:bg-[#272829]/30 ${
                      searchedUser && user._id === searchedUser._id
                        ? "bg-[#FFF6E0]/5"
                        : ""
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-[#FFF6E0]/10 flex items-center justify-center mr-2 text-sm">
                          {user.fullName?.charAt(0) || "U"}
                        </div>
                        <span className="text-sm">
                          {user.fullName || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-[#FFF6E0]/80 text-sm">
                      {user.email}
                    </td>
                    <td className="p-3">
                      <StatusBadge
                        isBanned={user.banned?.current?.status}
                        role={user.userRole}
                      />
                    </td>
                    <td className="p-3 text-[#FFF6E0]/80 text-sm">
                      {user.banned?.current?.reason || "N/A"}
                    </td>
                    <td className="p-3 text-[#FFF6E0]/80 text-sm">
                      {user.banned?.current?.date
                        ? new Date(
                            user.banned.current.date
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3 flex gap-1">
                      {!user.banned?.current?.status ? (
                        user.userRole === "king" ? (
                          <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg flex items-center opacity-50">
                            <Shield size={12} className="mr-1" />
                            <span className="text-xs">Protected</span>
                          </div>
                        ) : user.userRole === "admin" &&
                          authUser?.data?.user?.userRole === "moderator" ? (
                          <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg flex items-center opacity-50">
                            <Shield size={12} className="mr-1" />
                            <span className="text-xs">Protected</span>
                          </div>
                        ) : user._id ===
                          authUser?.data?.user?._id?.toString("userId") ? (
                          <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg flex items-center opacity-50">
                            <UserCheck size={12} className="mr-1" />
                            <span className="text-xs">Self</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => initiateBan(user)}
                            className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 flex items-center"
                            disabled={isUpdatingBanStatus}
                            title="Ban User"
                          >
                            <UserX size={12} className="mr-1" />
                            <span className="text-xs">Ban</span>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => initiateUnban(user)}
                          className="p-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 flex items-center"
                          disabled={isUpdatingBanStatus}
                          title="Unban User"
                        >
                          <UserCheck size={12} className="mr-1" />
                          <span className="text-xs">Unban</span>
                        </button>
                      )}

                      {user.banned?.history?.length > 0 && (
                        <button
                          onClick={() => viewBanHistory(user)}
                          className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 flex items-center"
                          title="View Ban History"
                        >
                          <History size={12} className="mr-1" />
                          <span className="text-xs">History</span>
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
            <UserX size={32} className="mb-3 opacity-50" />
            <p className="text-base">
              No {activeTab === "banned" ? "banned" : "active"} users found
            </p>
            <p className="text-xs">Try adjusting your search</p>
          </div>
        )}

        {/* Pagination Controls - Only show when not in search mode */}
        {!searchedUser && usersData?.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-[#61677A]/20 p-3 gap-2">
            <div className="text-xs text-[#FFF6E0]/70">
              {usersData.length} {activeTab === "banned" ? "banned" : "active"}{" "}
              users
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isFetchingUsers}
                className={`p-1.5 rounded-lg ${
                  currentPage <= 1
                    ? "text-[#FFF6E0]/30 bg-[#272829]/30"
                    : "bg-[#272829] text-[#FFF6E0] hover:bg-[#272829]/70"
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
                  currentPage >= totalPages
                    ? "text-[#FFF6E0]/30 bg-[#272829]/30"
                    : "bg-[#272829] text-[#FFF6E0] hover:bg-[#272829]/70"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isFetchingUsers}
              className={`px-3 py-1.5 rounded-lg text-xs ${
                currentPage >= totalPages
                  ? "bg-[#FFF6E0]/30 text-[#272829]/50"
                  : "bg-[#FFF6E0] text-[#272829] hover:bg-[#D8D9DA]"
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

      {/* Ban User Modal */}
      {showBanConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#31333A] rounded-lg p-4 md:p-6 max-w-md w-full mx-4 md:mx-0">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <UserX size={20} className="mr-2 text-red-400" />
              Ban User
            </h3>

            <div className="bg-[#272829] p-3 rounded-lg mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#FFF6E0]/10 flex items-center justify-center mr-2">
                  {selectedUser?.fullName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium">
                    {selectedUser?.fullName || "Unknown"}
                  </p>
                  <p className="text-xs text-[#FFF6E0]/70">
                    {selectedUser?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Reason for Ban
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm min-h-24"
                placeholder="Enter reason for banning this user..."
              />
              {!banReason.trim() && (
                <p className="text-xs text-red-400 mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />A reason is required
                  for banning a user
                </p>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowBanConfirm(false);
                  setSelectedUser(null);
                  setBanReason("");
                }}
                className="px-4 py-2 bg-[#272829] text-[#FFF6E0] rounded-lg hover:bg-[#272829]/70 transition-colors text-sm"
                disabled={isUpdatingBanStatus}
              >
                Cancel
              </button>
              <button
                onClick={handleBan}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center"
                disabled={isUpdatingBanStatus || !banReason.trim()}
              >
                {isUpdatingBanStatus ? (
                  <span className="flex items-center">
                    <RefreshCw size={14} className="animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserX size={14} className="mr-2" />
                    Confirm Ban
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unban User Modal */}
      {showUnbanConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#31333A] rounded-lg p-4 md:p-6 max-w-md w-full mx-4 md:mx-0">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <UserCheck size={20} className="mr-2 text-green-400" />
              Unban User
            </h3>

            <div className="bg-[#272829] p-3 rounded-lg mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#FFF6E0]/10 flex items-center justify-center mr-2">
                  {selectedUser?.fullName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium">
                    {selectedUser?.fullName || "Unknown"}
                  </p>
                  <p className="text-xs text-[#FFF6E0]/70">
                    {selectedUser?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Reason for Unban (Optional)
              </label>
              <input
                type="text"
                value={unbanReason}
                onChange={(e) => setUnbanReason(e.target.value)}
                className="w-full bg-[#272829] text-[#FFF6E0] p-2 rounded-lg border border-[#61677A]/30 text-sm"
                placeholder="Enter reason for unbanning..."
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowUnbanConfirm(false);
                  setSelectedUser(null);
                  setUnbanReason("Unbanned");
                }}
                className="px-4 py-2 bg-[#272829] text-[#FFF6E0] rounded-lg hover:bg-[#272829]/70 transition-colors text-sm"
                disabled={isUpdatingBanStatus}
              >
                Cancel
              </button>
              <button
                onClick={handleUnban}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center"
                disabled={isUpdatingBanStatus}
              >
                {isUpdatingBanStatus ? (
                  <span className="flex items-center">
                    <RefreshCw size={14} className="animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserCheck size={14} className="mr-2" />
                    Confirm Unban
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban History Modal */}
      {showBanHistory && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#31333A] rounded-lg p-4 md:p-6 max-w-2xl w-full mx-4 md:mx-0">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <History size={20} className="mr-2 text-blue-400" />
              Ban History
            </h3>

            <div className="bg-[#272829] p-3 rounded-lg mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#FFF6E0]/10 flex items-center justify-center mr-2">
                  {selectedUser?.fullName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium">
                    {selectedUser?.fullName || "Unknown"}
                  </p>
                  <p className="text-xs text-[#FFF6E0]/70">
                    {selectedUser?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#272829] rounded-lg p-3 mb-4 max-h-64 overflow-y-auto">
              {selectedUser?.banned?.history?.length > 0 ? (
                <div className="space-y-4">
                  {selectedUser.banned.history.map((entry, index) => (
                    <div
                      key={index}
                      className="border-b border-[#61677A]/20 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            entry.status
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {entry.status ? "Banned" : "Unbanned"}
                        </span>
                        <span className="text-xs text-[#FFF6E0]/70">
                          {new Date(entry.date).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Reason:</p>
                        <p className="text-xs text-[#FFF6E0]/80">
                          {entry.reason || "No reason provided"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-[#FFF6E0]/60">
                  <p>No history available</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowBanHistory(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 bg-[#FFF6E0] text-[#272829] rounded-lg hover:bg-[#D8D9DA] transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ isBanned, role }) => {
  if (isBanned) {
    return (
      <span className="px-1.5 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">
        Banned
      </span>
    );
  } else if (role === "moderator") {
    return (
      <span className="px-1.5 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
        Moderator
      </span>
    );
  } else if (role === "admin") {
    return (
      <span className="px-1.5 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
        Admin
      </span>
    );
  } else if (role === "king") {
    return (
      <span className="px-1.5 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
        King
      </span>
    );
  } else {
    return (
      <span className="px-1.5 py-0.5 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
        Active
      </span>
    );
  }
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
        <p className="text-sm md:text-base font-bold">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  </div>
);

export default ManageBansPage;
