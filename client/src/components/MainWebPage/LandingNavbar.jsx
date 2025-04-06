import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js'; // Zustand store
import { axiosInstance } from '../../lib/axios.js'; // axios instance for API calls
import { User, Settings, LogOut, Skull, Scale, Crown, AlertTriangle } from 'lucide-react'; // Added AlertTriangle icon
import toast from 'react-hot-toast';

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setIsMenuOpen(false); // Close menu after logout
  };
  
  const goToBannedPage = () => {
    navigate("/banned");
    setIsMenuOpen(false); // Close menu after navigation
  };

  // Add this new function to handle menu item clicks
  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-[#272829] text-[#FFF6E0] shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">RadialWhisper</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Home</Link>
            <Link to="/how-it-works" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">How It Works</Link>
            <Link to="/features" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Features</Link>
            <Link to="/premium" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Premium</Link>
            <Link to="/chat" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Chat</Link>
            <Link to="/about" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">About</Link>
            <Link to="/reviews" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Reviews</Link>
            <Link to="/suggestion" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Suggestion</Link>
            <Link to="/contact" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Contact</Link>
            
            {/* Conditional rendering based on auth status */}
            {authUser ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={authUser?.data?.user?.profileImageURL || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = 'https://via.placeholder.com/150'; // Fallback image
                      }}
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-compact dropdown-content mt-3 p-2 z-50 shadow bg-base-100 rounded-box w-52 text-[#FFF6E0]"
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
                          <Link to="/op/dashboard">
                            <Crown className="w-5 h-5" />KingPanal
                          </Link>
                        </li>
                      )}
                      {adminOption && (
                        <li>
                          <Link to="/op/dashboard">
                            <Skull className="w-5 h-5" />AdminPanal
                          </Link>
                        </li>
                      )}
                      {moderatorOption && (
                        <li>
                          <Link to="/op/dashboard">
                            <Scale className="w-5 h-5"/>Moderate
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link to="/chat/profile">
                          <User className="w-5 h-5" /> Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/chat/settings">
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
              <>
                <Link to="/login" className="px-4 py-2 rounded-md bg-[#61677A] hover:bg-[#D8D9DA] hover:text-[#272829] font-medium transition duration-300">Login</Link>
                <Link to="/signup" className="px-4 py-2 rounded-md bg-[#FFF6E0] text-[#272829] hover:bg-[#D8D9DA] font-medium transition duration-300">Sign Up</Link>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#FFF6E0] hover:bg-[#61677A]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Home</Link>
            <Link to="/how-it-works" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">How It Works</Link>
            <Link to="/features" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Features</Link>
            <Link to="/premium" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Premium</Link>
            <Link to="/chat" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Chat</Link>
            <Link to="/about" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">About</Link>
            <Link to="/reviews" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Reviews</Link>
            <Link to="/suggestion" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Suggestion</Link>
            <Link to="/contact" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Contact</Link>
            
            {/* Conditional rendering for mobile menu */}
            {authUser ? (
              <>
                {isUserBanned ? (
                  <button 
                    onClick={goToBannedPage} 
                    className=" w-full text-left px-3 py-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium flex items-center"
                  >
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Account Suspended
                  </button>
                ) : (
                  <>
                    {kingOption && (
                      <Link to="/op/dashboard" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">King Panel</Link>
                    )}
                    {adminOption && (
                      <Link to="/op/dashboard" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Admin Panel</Link>
                    )}
                    {moderatorOption && (
                      <Link to="/op/dashboard" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Moderate</Link>
                    )}
                    <Link to="/chat/profile" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Profile</Link>
                    <Link to="/chat/settings" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Settings</Link>
                  </>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-[#61677A] font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md bg-[#61677A] text-center hover:bg-[#D8D9DA] hover:text-[#272829] font-medium">Login</Link>
                <Link to="/signup" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md bg-[#FFF6E0] text-center text-[#272829] hover:bg-[#D8D9DA] font-medium mt-2">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;