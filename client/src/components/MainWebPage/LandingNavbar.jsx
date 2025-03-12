import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js'; // Zustand store
import { axiosInstance } from '../../lib/axios.js'; // axios instance for API calls
import { User, Settings, LogOut, Skull, Scale, Crown } from 'lucide-react'; // Lucide icons
import toast from 'react-hot-toast';

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authUser, getUserDetails } = useAuthStore();
  const navigate = useNavigate();
  const [adminOptin, setAdminOptin] = useState(false);
  const [moderatorOptin, setModeratorOptin] = useState(false);
  const [kingOptin, setKingOptin] = useState(false);
  
  useEffect(() => {
    // Fetch user details on component mount
    getUserDetails();
    
    // Set user role options based on the user role
    if (authUser?.data?.user?.userRole === 'king') {
      setKingOptin(true);
      setAdminOptin(true);
      setModeratorOptin(true);
    }
    else if (authUser?.data?.user?.userRole === 'admin') {
      setKingOptin(false);
      setAdminOptin(true);
      setModeratorOptin(true);
    }
    else if (authUser?.data?.user?.userRole === 'moderator') {
      setKingOptin(false);
      setModeratorOptin(true);
      setAdminOptin(false);
    } else {
      setKingOptin(false);
      setAdminOptin(false);
      setModeratorOptin(false);
    }
  }, [getUserDetails, authUser]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/v1/user/logout');
      toast.success('Logged out successfully');
      useAuthStore.setState({ authUser: null });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <nav className="bg-[#272829] text-[#FFF6E0] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">RadialWhisper</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Home</Link>
            <Link to="/chat" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Chat</Link>
            <Link to="/about" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">About</Link>
            <Link to="/features" className="px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Features</Link>
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
                  {kingOptin && (
                    <li>
                      <Link to="/king">
                        <Crown className="w-5 h-5" />KingPanal
                      </Link>
                    </li>
                  )}
                  {adminOptin && (
                    <li>
                      <Link to="/op/admin">
                        <Skull className="w-5 h-5" />AdminPanal
                      </Link>
                    </li>
                  )}
                  {moderatorOptin && (
                    <li>
                      <Link to="/moderator">
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
                    <Link to="#">
                      <Settings className="w-5 h-5" /> Settings
                    </Link>
                  </li>
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
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Home</Link>
            <Link to="/chat" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Chat</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">About</Link>
            <Link to="/features" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Features</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Contact</Link>
            
            {/* Conditional rendering for mobile menu */}
            {authUser ? (
              <>
                {kingOptin && (
                  <Link to="/king" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">King Panel</Link>
                )}
                {adminOptin && (
                  <Link to="/admin" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Admin Panel</Link>
                )}
                {moderatorOptin && (
                  <Link to="/moderator" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Moderate</Link>
                )}
                <Link to="/profile" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Profile</Link>
                <Link to="#" className="block px-3 py-2 rounded-md hover:bg-[#61677A] font-medium">Settings</Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-[#61677A] font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md bg-[#61677A] text-center hover:bg-[#D8D9DA] hover:text-[#272829] font-medium">Login</Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md bg-[#FFF6E0] text-center text-[#272829] hover:bg-[#D8D9DA] font-medium mt-2">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;