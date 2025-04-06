import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js'; // Zustand store
import { axiosInstance } from '../../lib/axios.js'; // axios instance for API calls
import { 
  User, Settings, LogOut, Skull, Scale, Crown, AlertTriangle, Menu as MenuIcon, 
  X, Home, MessageSquare, Sparkles, Info, Star, HelpCircle, MessageCircle, Heart 
} from 'lucide-react';
import toast from 'react-hot-toast';

const LandingNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { authUser, getUserDetails, logout } = useAuthStore();
  const navigate = useNavigate();
  const [adminOption, setAdminOption] = useState(false);
  const [moderatorOption, setModeratorOption] = useState(false);
  const [kingOption, setKingOption] = useState(false);
  
  // Check if user is banned
  const isUserBanned = authUser?.data?.user?.banned?.current?.status === true;
  
  useEffect(() => {
    // Fetch user details on component mount
    getUserDetails();
    
    // Only set role options if user is not banned
    if (!isUserBanned) {
      if (authUser?.data?.user?.userRole === 'king') {
        setKingOption(true);
      }
      else if (authUser?.data?.user?.userRole === 'admin') {
        setAdminOption(true);
      }
      else if (authUser?.data?.user?.userRole === 'moderator') {
        setModeratorOption(true);
      } else {
        setKingOption(false);
        setAdminOption(false);
        setModeratorOption(false);
      }
    } else {
      // Reset all roles if user is banned
      setKingOption(false);
      setAdminOption(false);
      setModeratorOption(false);
    }
  }, [getUserDetails, authUser?.data?.user?.userRole, isUserBanned]);

  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setIsSidebarOpen(false);
  };
  
  const goToBannedPage = () => {
    navigate("/banned");
    setIsSidebarOpen(false);
  };

  const handleMenuItemClick = () => {
    setIsSidebarOpen(false);
  };

  // Active link style for NavLink
  const activeClass = "text-[#FFF6E0] border-b-2 border-[#FFF6E0]";
  const inactiveClass = "text-[#D8D9DA] hover:text-[#FFF6E0]";
  
  // Navigation menu items - Replaced Premium with Reviews
  const mainNavItems = [
    { to: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { to: "/chat", label: "Chat", icon: <MessageSquare className="w-5 h-5" /> },
    { to: "/reviews", label: "Reviews", icon: <Star className="w-5 h-5" /> }
  ];
  
  const sideNavItems = [
    { to: "/how-it-works", label: "How It Works", icon: <HelpCircle className="w-5 h-5" /> },
    { to: "/features", label: "Features", icon: <Star className="w-5 h-5" /> },
    { to: "/premium", label: "Premium", icon: <Sparkles className="w-5 h-5" /> },
    { to: "/about", label: "About", icon: <Info className="w-5 h-5" /> },
    { to: "/suggestion", label: "Suggestion", icon: <Sparkles className="w-5 h-5" /> },
    { to: "/contact", label: "Contact", icon: <MessageCircle className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-[#272829] text-[#FFF6E0] shadow-lg w-full sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="font-bold text-xl">RadialWhisper</span>
              </Link>
            </div>
            
            {/* Main navigation - only most important links */}
            <div className="hidden md:flex items-center space-x-2">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => 
                    `px-3 py-2 flex items-center space-x-1 font-medium ${isActive ? activeClass : inactiveClass}`
                  }
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            
            {/* Right side with auth buttons and hamburger menu */}
            <div className="flex items-center space-x-2">
              {/* Auth buttons or profile */}
              {authUser ? (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={authUser?.data?.user?.profileImageURL || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-compact dropdown-content mt-3 p-2 z-50 shadow bg-[#31333A] rounded-box w-52 text-[#FFF6E0]"
                  >
                    {isUserBanned ? (
                      <li>
                        <button onClick={goToBannedPage} className="text-red-400 font-medium">
                          <AlertTriangle className="w-5 h-5 text-red-400" />Account Suspended
                        </button>
                      </li>
                    ) : (
                      <>
                        {kingOption && (
                          <li>
                            <Link to="/op/dashboard" onClick={handleMenuItemClick}>
                              <Crown className="w-5 h-5" />KingPanal
                            </Link>
                          </li>
                        )}
                        {adminOption && (
                          <li>
                            <Link to="/op/dashboard" onClick={handleMenuItemClick}>
                              <Skull className="w-5 h-5" />AdminPanal
                            </Link>
                          </li>
                        )}
                        {moderatorOption && (
                          <li>
                            <Link to="/op/dashboard" onClick={handleMenuItemClick}>
                              <Scale className="w-5 h-5"/>Moderate
                            </Link>
                          </li>
                        )}
                        <li>
                          <Link to="/chat/profile" onClick={handleMenuItemClick}>
                            <User className="w-5 h-5" /> Profile
                          </Link>
                        </li>
                        <li>
                          <Link to="/chat/settings" onClick={handleMenuItemClick}>
                            <Settings className="w-5 h-5" /> Settings
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <button onClick={handleLogout}>
                        <LogOut className="w-5 h-5" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link 
                    to="/login"
                    className="px-3 py-1.5 rounded-md text-sm bg-[#61677A] hover:bg-[#D8D9DA] hover:text-[#272829] font-medium transition duration-300"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-3 py-1.5 rounded-md text-sm bg-[#FFF6E0] text-[#272829] hover:bg-[#D8D9DA] font-medium transition duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              {/* Hamburger menu button moved to right side */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-[#FFF6E0] hover:bg-[#61677A]/30"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile-specific navigation bar */}
        <div className="md:hidden border-t border-[#61677A]/20">
          <div className="flex justify-around">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => 
                  `px-3 py-2 flex flex-col items-center justify-center space-y-1 ${isActive ? "text-[#FFF6E0]" : "text-[#D8D9DA]"}`
                }
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar menu - slides in from the right instead of left */}
      <div className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-[#31333A] transform transition-transform duration-300 ease-in-out z-50 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b border-[#61677A]/30">
          <span className="font-bold text-xl text-[#FFF6E0]">Menu</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-[#61677A]/20 text-[#FFF6E0]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="py-4 h-full overflow-y-auto">
          {/* All navigation links */}
          <div className="px-2 space-y-1">
            {sideNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-lg ${isActive ? 'bg-[#61677A]/40 text-[#FFF6E0]' : 'text-[#D8D9DA] hover:bg-[#61677A]/20 hover:text-[#FFF6E0]'}`
                }
                onClick={handleMenuItemClick}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
          
          {/* Login/Signup for mobile */}
          {!authUser && (
            <div className="px-4 py-6 mt-6 border-t border-[#61677A]/30">
              <div className="space-y-2">
                <Link 
                  to="/login" 
                  onClick={handleMenuItemClick}
                  className="block w-full px-4 py-2 rounded-md bg-[#61677A] text-center hover:bg-[#D8D9DA] hover:text-[#272829] font-medium transition duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={handleMenuItemClick}
                  className="block w-full px-4 py-2 rounded-md bg-[#FFF6E0] text-center text-[#272829] hover:bg-[#D8D9DA] font-medium transition duration-300"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
          
          {/* App info section */}
          <div className="px-4 pt-6 mt-6 border-t border-[#61677A]/30">
            <div className="flex items-center mb-4">
              <span className="text-[#FFF6E0] font-medium">RadialWhisper</span>
              <span className="ml-2 text-xs bg-[#FFF6E0]/10 px-2 py-0.5 rounded-full text-[#D8D9DA]">
                v1.0
              </span>
            </div>
            <p className="text-sm text-[#D8D9DA]">
              Connect with people nearby. Chat anonymously with those within your radius.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingNavbar;