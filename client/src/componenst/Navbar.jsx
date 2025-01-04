import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore.js'; // Zustand store
import { axiosInstance } from '../lib/axios'; // axios instance for API calls
import { User, Settings, LogOut } from 'lucide-react'; // Lucide icons
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { authUser, getUserDetails, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details on component mount
    getUserDetails();

    // Log the fetched user data to the console
    console.log("Fetched User Details from frontend: ", authUser);
  }, [getUserDetails]);

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
    <div className="navbar bg-base-100 shadow-md">
      {/* Left side: Logo */}
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Radial Whisper</a>
      </div>

      {/* Right side: Profile dropdown */}
      <div className="flex-none">
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
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="#">
                <User className="w-5 h-5" /> Profile
              </a>
            </li>
            <li>
              <a href="#">
                <Settings className="w-5 h-5" /> Settings
              </a>
            </li>
            <li>
              <button onClick={handleLogout}>
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
