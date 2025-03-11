import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js'; // Zustand store
import { axiosInstance } from '../lib/axios.js'; // axios instance for API calls
import { User, Settings, LogOut , Skull , Scale , Crown} from 'lucide-react'; // Lucide icons
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { authUser, getUserDetails, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const [adminOptin , setAdminOptin] = useState(false);
  const [moderatorOptin , setModeratorOptin] = useState(false);
  const [kingOptin , setKingOptin] = useState(false);

  useEffect(() => {
    // Fetch user details on component mount
    getUserDetails();
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
    }else{
      setKingOptin(false);
      setAdminOptin(false);
      setModeratorOptin(false);
    }
    // Fetch user details on component mount
    // Log the fetched user data to the console
    // console.log("Fetched User Details from frontend: ", authUser);
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
        <Link to="/" className="btn btn-ghost normal-case text-xl">Radial Whisper</Link>
        
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
            className="menu menu-compact dropdown-content mt-3 p-2 z-50 shadow bg-base-100 rounded-box w-52"
          >
            {kingOptin &&
            <li>
               <Link to="/king">
                  <Crown className="w-5 h-5" />KingPanal
                </Link>
            </li>
            }
            {adminOptin &&
            <li>
               <Link to="/admin">
                  <Skull className="w-5 h-5" />AdminPanal
               </Link>
            </li>
            }

            {moderatorOptin &&
            <li>
               <Link to="/moderator">
                  <Scale  className="w-5 h-5"/>Moderate
               </Link>
            </li>
            }

            <li>
              <Link to="/profile">
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
      </div>
    </div>
  );
};

export default Navbar;
