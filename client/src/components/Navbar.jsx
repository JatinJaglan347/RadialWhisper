import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { axiosInstance } from "../lib/axios.js";
import {
  User,
  Settings,
  LogOut,
  Skull,
  Scale,
  Crown,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { authUser, getUserDetails } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [adminOptin, setAdminOptin] = useState(false);
  const [moderatorOptin, setModeratorOptin] = useState(false);
  const [kingOptin, setKingOptin] = useState(false);
  const [showChatOption, setShowChatOption] = useState(false);

  useEffect(() => {
    // Check if we're not on the chat route
    setShowChatOption(location.pathname !== "/chat");
  }, [location.pathname]);

  useEffect(() => {
    // Fetch user details on component mount
    getUserDetails();
    if (authUser?.data?.user?.userRole === "king") {
      setKingOptin(true);
      setAdminOptin(true);
      setModeratorOptin(true);
    } else if (authUser?.data?.user?.userRole === "admin") {
      setKingOptin(false);
      setAdminOptin(true);
      setModeratorOptin(true);
    } else if (authUser?.data?.user?.userRole === "moderator") {
      setKingOptin(false);
      setModeratorOptin(true);
      setAdminOptin(false);
    } else {
      setKingOptin(false);
      setAdminOptin(false);
      setModeratorOptin(false);
    }
  }, [getUserDetails, authUser?.data?.user?.userRole]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/v1/user/logout");
      toast.success("Logged out successfully");
      useAuthStore.setState({ authUser: null });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <div className="relative z-20 flex flex-wrap w-full ">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-[#272829]/80 backdrop-blur-md z-0"></div>

      {/* Animated subtle gradient line at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#FFF6E0]/5 via-[#FFF6E0]/20 to-[#FFF6E0]/5"></div>

      {/* Navbar content */}
      <div className="px-4 md:px-8 py-3 relative z-10 flex flex-wrap items-center justify-between w-full">
        {/* Left side: Logo with subtle animation */}
        <div className="flex items-center">
          <Link to="/" className="group flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text transition-all duration-300">
              Radial Whisper
            </span>
          </Link>
        </div>

        {/* Center: Chat option when not on chat route */}
        {showChatOption && (
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
            <Link
              to="/chat"
              className="flex items-center px-4 py-2 text-[#FFF6E0] hover:bg-[#FFF6E0]/10 transition-colors rounded-full border border-[#61677A]/30"
            >
              <MessageCircle size={18} className="mr-2 text-[#FFF6E0]/70" />
              <span>Chat</span>
            </Link>
          </div>
        )}

        {/* Mobile menu button */}
        <div className="md:hidden">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#61677A]/30">
                <img
                  src={
                    authUser?.data?.user?.profileImageURL ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 p-2 z-50 shadow bg-gradient-to-b from-[#31333A]/90 to-[#272829]/90 backdrop-blur-md rounded-xl border border-[#61677A]/30 w-52"
            >
              {showChatOption && (
                <li>
                  <Link
                    to="/chat"
                    className="flex items-center text-[#FFF6E0] hover:bg-[#FFF6E0]/10"
                  >
                    <MessageCircle size={16} className="text-[#FFF6E0]/70" />
                    <span>Chat</span>
                  </Link>
                </li>
              )}
              {kingOptin && (
                <li>
                  <Link
                    to="/king"
                    className="flex items-center text-[#FFF6E0] hover:bg-[#FFF6E0]/10"
                  >
                    <Crown size={16} className="text-[#FFF6E0]/70" />
                    <span>King Panel</span>
                  </Link>
                </li>
              )}
              {adminOptin && (
                <li>
                  <Link
                    to="/op/dashboard"
                    className="flex items-center text-[#FFF6E0] hover:bg-[#FFF6E0]/10"
                  >
                    <Skull size={16} className="text-[#FFF6E0]/70" />
                    <span>Admin Panel</span>
                  </Link>
                </li>
              )}
              {moderatorOptin && (
                <li>
                  <Link
                    to="/moderator"
                    className="flex items-center text-[#FFF6E0] hover:bg-[#FFF6E0]/10"
                  >
                    <Scale size={16} className="text-[#FFF6E0]/70" />
                    <span>Moderate</span>
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/chat/profile"
                  className="flex items-center text-[#FFF6E0] hover:bg-[#FFF6E0]/10"
                >
                  <User size={16} className="text-[#FFF6E0]/70" />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/chat/settings"
                  className="flex items-center text-[#FFF6E0] hover:bg-[#FFF6E0]/10"
                >
                  <Settings size={16} className="text-[#FFF6E0]/70" />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-[#FFF6E0] hover:bg-[#FFF6E0]/10"
                >
                  <LogOut size={16} className="text-[#FFF6E0]/70" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Navigation links if needed */}
        </div>

        {/* Right side: Profile dropdown */}
        <div className="hidden md:block">
          <div className="relative group">
            <button className="flex items-center space-x-2 group">
              <div className="flex flex-col items-end">
                <span className="text-sm text-[#FFF6E0] font-medium">
                  {authUser?.data?.user?.fullName || "User"}
                </span>
                {authUser?.data?.user?.userRole &&
                  authUser?.data?.user?.userRole !== "normalUser" && (
                    <span className="text-xs text-[#D8D9DA]/60 font-semibold">
                      {authUser?.data?.user?.userRole.toUpperCase()}
                    </span>
                  )}
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#61677A]/30 group-hover:border-[#FFF6E0]/30 transition-all duration-300">
                  <img
                    src={
                      authUser?.data?.user?.profileImageURL ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
                <div className="absolute inset-0 rounded-full border border-[#FFF6E0]/10 group-hover:border-[#FFF6E0]/20 transition-all duration-300"></div>
                {authUser?.data?.user?.userRole === "king" && (
                  <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-gradient-to-br from-[#FFF6E0] to-[#D8D9DA] rounded-full flex items-center justify-center">
                    <Crown size={10} className="text-[#272829]" />
                  </div>
                )}
              </div>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-52 py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-b from-[#31333A]/90 to-[#272829]/90 backdrop-blur-md rounded-xl border border-[#61677A]/30 shadow-2xl">
              {showChatOption && (
                <>
                  <Link
                    to="/chat"
                    className="flex items-center px-4 py-2 text-[#FFF6E0] hover:bg-[#FFF6E0]/10 transition-colors"
                  >
                    <MessageCircle size={16} className="mr-2 text-[#FFF6E0]/70" />
                    <span>Chat</span>
                  </Link>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#61677A]/30 to-transparent my-1"></div>
                </>
              )}
              {kingOptin && (
                <Link
                  to="/king"
                  className="flex items-center px-4 py-2 text-[#FFF6E0] hover:bg-[#FFF6E0]/10 transition-colors"
                >
                  <Crown size={16} className="mr-2 text-[#FFF6E0]/70" />
                  <span>King Panel</span>
                </Link>
              )}
              {adminOptin && (
                <Link
                  to="/op/dashboard"
                  className="flex items-center px-4 py-2 text-[#FFF6E0] hover:bg-[#FFF6E0]/10 transition-colors"
                >
                  <Skull size={16} className="mr-2 text-[#FFF6E0]/70" />
                  <span>Admin Panel</span>
                </Link>
              )}
              {moderatorOptin && (
                <Link
                  to="/moderator"
                  className="flex items-center px-4 py-2 text-[#FFF6E0] hover:bg-[#FFF6E0]/10 transition-colors"
                >
                  <Scale size={16} className="mr-2 text-[#FFF6E0]/70" />
                  <span>Moderate</span>
                </Link>
              )}

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#61677A]/30 to-transparent my-1"></div>

              <Link
                to="/chat/profile"
                className="flex items-center px-4 py-2 text-[#FFF6E0] hover:bg-[#FFF6E0]/10 transition-colors"
              >
                <User size={16} className="mr-2 text-[#FFF6E0]/70" />
                <span>Profile</span>
              </Link>
              <Link
                to="/chat/settings"
                className="flex items-center px-4 py-2 text-[#FFF6E0] hover:bg-[#FFF6E0]/10 transition-colors"
              >
                <Settings size={16} className="mr-2 text-[#FFF6E0]/70" />
                <span>Settings</span>
              </Link>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#61677A]/30 to-transparent my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-4 py-2 text-[#FFF6E0] hover:bg-[#FFF6E0]/10 transition-colors"
              >
                <LogOut size={16} className="mr-2 text-[#FFF6E0]/70" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;