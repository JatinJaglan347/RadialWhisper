import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Shield, ArrowLeft, UserX, UserCheck, AlertTriangle, RotateCcw, Clock, UserPlus, UserMinus } from 'lucide-react';
import { format } from 'date-fns';

const ModerateUser = () => {
  const location = useLocation();
  const userEmail = location.state?.userEmail;
  const { 
    adminSearchUser, 
    searchedUser, 
    isSearchingUser,
    banUnbanUser,
    isUpdatingBanStatus,
    promoteDemoteUser,
    isUpdatingRole
  } = useAuthStore();
  const navigate = useNavigate();
  const [banReason, setBanReason] = useState('');
  const [showBanForm, setShowBanForm] = useState(false);
  const [showBanHistory, setShowBanHistory] = useState(false);
  const [showRoleConfirmation, setShowRoleConfirmation] = useState(false);
  const [roleAction, setRoleAction] = useState(null); // 'promote' or 'demote'

  useEffect(() => {
    if (userEmail) {
      adminSearchUser({ email: userEmail });
    }
  }, [userEmail, adminSearchUser]);

  const goBack = () => {
    navigate(-1);
  };

  const handleBanUnban = async (status) => {
    if (status && !banReason.trim()) {
      // If trying to ban but no reason provided
      alert('Please provide a reason for banning the user');
      return;
    }
    
    try {
      const data = {
        input: searchedUser.email,
        banStatus: status,
        banReason: status ? banReason : 'Unbanned',
        banActionBy: localStorage.getItem('userId') || '65b9e2b0c5d4b6a1f2e8a3d8' // Default to a placeholder if not available
      };
      
      await banUnbanUser(data);
      
      // Refresh user data after ban/unban
      adminSearchUser({ email: searchedUser.email });
      
      // Reset form state
      setBanReason('');
      setShowBanForm(false);
    } catch (error) {
      console.error('Error while updating ban status:', error);
    }
  };

  const showPromoteConfirmation = () => {
    setRoleAction('promote');
    setShowRoleConfirmation(true);
  };

  const showDemoteConfirmation = () => {
    setRoleAction('demote');
    setShowRoleConfirmation(true);
  };
  
  const handlePromoteDemote = async () => {
    try {
      const data = {
        input: searchedUser.email,
        promote: roleAction === 'promote',
        actionBy: localStorage.getItem('userId') || '65b9e2b0c5d4b6a1f2e8a3d8'
      };
      
      await promoteDemoteUser(data);
      
      // Refresh user data after role change
      adminSearchUser({ email: searchedUser.email });
      
      // Reset form state
      setShowRoleConfirmation(false);
      setRoleAction(null);
    } catch (error) {
      console.error('Error while updating user role:', error);
    }
  };
  
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'PPP p');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderUserDetails = () => {
    if (!searchedUser) return null;
    
    const {
      fullName,
      email,
      _id,
      userRole,
      uniqueTag,
      gender,
      dateOfBirth,
      createdAt,
      banned,
      bio,
      profileImageURL
    } = searchedUser;
    
    const isModerator = userRole === 'moderator';
    
    return (
      <div className="grid grid-cols-1 gap-6">
        {/* User Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-[#31333A] rounded-lg border border-[#61677A]/30">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-[#FFF6E0]/10 flex items-center justify-center">
            {profileImageURL ? (
              <img src={profileImageURL} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <Shield size={32} className="text-[#FFF6E0]/70" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h2 className="text-xl md:text-2xl font-bold">{fullName || "Unnamed User"}</h2>
              <span className="text-xs md:text-sm px-2 py-0.5 rounded-full bg-[#FFF6E0]/10 text-[#FFF6E0]/80 w-fit capitalize">
                {userRole || "user"}
              </span>
              {banned?.current?.status && (
                <span className="text-xs md:text-sm px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 w-fit">
                  Banned
                </span>
              )}
            </div>
            
            <div className="mt-1 flex flex-col md:flex-row gap-1 md:gap-3 text-sm text-[#FFF6E0]/70">
              <span>{email || "No email"}</span>
              <span className="hidden md:inline">•</span>
              <span>Tag: {uniqueTag || "N/A"}</span>
            </div>
            
            {bio && bio.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {bio.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-0.5 rounded-full bg-[#FFF6E0]/5 text-[#FFF6E0]/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="md:ml-auto mt-4 md:mt-0 flex flex-wrap items-center gap-2 self-start md:self-center">
             {/* Ban/Unban Buttons - Hide for 'king' role */}
            {userRole !== 'king' ? (
                banned?.current?.status ? (
                <button 
                    onClick={() => handleBanUnban(false)} 
                    disabled={isUpdatingBanStatus}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 text-sm font-medium transition-colors"
                >
                    <UserCheck size={16} />
                    <span>Unban User</span>
                </button>
                ) : (
                <button 
                    onClick={() => setShowBanForm(true)} 
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 text-sm font-medium transition-colors"
                >
                    <UserX size={16} />
                    <span>Ban User</span>
                </button>
                )
            ) : (
                <span className="text-xs px-3 py-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg">
                King users cannot be banned
                </span>
            )}
  
            
            {/* Role Management Buttons */}
            {userRole === 'normalUser' && (
            <button 
                onClick={showPromoteConfirmation}
                disabled={isUpdatingRole || banned?.current?.status}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <UserPlus size={16} />
                <span>Promote to Moderator</span>
            </button>
            )}
            {userRole === 'moderator' && (
            <button 
                onClick={showDemoteConfirmation}
                disabled={isUpdatingRole || banned?.current?.status}
                className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <UserMinus size={16} />
                <span>Demote to User</span>
            </button>
            )}
          </div>
        </div>
        
        {/* Ban Form */}
        {showBanForm && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-red-400">Ban User</h3>
            <div className="mb-3">
              <label className="block text-sm text-[#FFF6E0]/70 mb-1">Reason for Ban</label>
              <textarea 
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Provide a detailed reason for banning this user"
                className="w-full p-2 bg-[#272829] border border-[#61677A]/50 rounded-md text-[#FFF6E0] focus:outline-none focus:border-red-400/50"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setShowBanForm(false)}
                className="px-3 py-1.5 bg-[#31333A] text-[#FFF6E0]/70 rounded-md hover:bg-[#31333A]/80 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleBanUnban(true)}
                disabled={isUpdatingBanStatus || !banReason.trim()}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-md hover:bg-red-500/30 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingBanStatus ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <UserX size={16} />
                    <span>Confirm Ban</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Role Confirmation Dialog */}
        {showRoleConfirmation && (
          <div className={`p-4 ${roleAction === 'promote' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-yellow-500/10 border-yellow-500/30'} border rounded-lg`}>
            <h3 className={`text-lg font-medium mb-3 ${roleAction === 'promote' ? 'text-blue-400' : 'text-yellow-400'}`}>
              {roleAction === 'promote' ? 'Promote User to Moderator' : 'Demote Moderator to User'}
            </h3>
            <p className="mb-3 text-[#FFF6E0]/80">
              {roleAction === 'promote' 
                ? 'This will give the user moderator privileges including the ability to review reports and moderate other users. Are you sure you want to continue?'
                : 'This will remove moderator privileges from this user. They will no longer be able to perform moderation actions. Are you sure you want to continue?'
              }
            </p>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setShowRoleConfirmation(false)}
                className="px-3 py-1.5 bg-[#31333A] text-[#FFF6E0]/70 rounded-md hover:bg-[#31333A]/80 text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handlePromoteDemote}
                disabled={isUpdatingRole}
                className={`flex items-center gap-1 px-3 py-1.5 ${
                  roleAction === 'promote' 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'
                } border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isUpdatingRole ? (
                  <>
                    <div className={`animate-spin h-4 w-4 border-2 ${roleAction === 'promote' ? 'border-blue-400' : 'border-yellow-400'} border-t-transparent rounded-full`}></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {roleAction === 'promote' ? <UserPlus size={16} /> : <UserMinus size={16} />}
                    <span>Confirm {roleAction === 'promote' ? 'Promotion' : 'Demotion'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#31333A] rounded-lg border border-[#61677A]/30 p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Shield size={18} />
              <span>Account Information</span>
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-[#FFF6E0]/70 text-sm mb-1">User ID</p>
                <p className="text-[#FFF6E0] break-all text-sm">{_id || "N/A"}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[#FFF6E0]/70 text-sm mb-1">Email</p>
                  <p className="text-[#FFF6E0]">{email || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-[#FFF6E0]/70 text-sm mb-1">Unique Tag</p>
                    <p className="text-[#FFF6E0]">{uniqueTag || "N/A"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#FFF6E0]/70 text-sm mb-1">Gender</p>
                    <p className="text-[#FFF6E0]">{gender || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-[#FFF6E0]/70 text-sm mb-1">Date of Birth</p>
                    <p className="text-[#FFF6E0]">{dateOfBirth ? formatDate(dateOfBirth) : "N/A"}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-[#FFF6E0]/70 text-sm mb-1">Account Created</p>
                  <p className="text-[#FFF6E0]">{formatDate(createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#31333A] rounded-lg border border-[#61677A]/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <AlertTriangle size={18} />
                  <span>Ban Status</span>
                </h3>
                <button 
                  onClick={() => setShowBanHistory(!showBanHistory)}
                  className="text-xs text-[#FFF6E0]/70 flex items-center gap-1 hover:text-[#FFF6E0]"
                >
                  <Clock size={14} />
                  <span>{showBanHistory ? "Hide History" : "Show History"}</span>
                </button>
              </div>
              
              <div className="p-3 rounded-md bg-[#272829]">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${banned?.current?.status ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="font-medium">{banned?.current?.status ? 'Currently Banned' : 'Not Banned'}</span>
                </div>
                
                {banned?.current?.status && (
                  <>
                    <p className="text-[#FFF6E0]/70 text-sm mb-1 mt-3">Reason</p>
                    <p className="text-[#FFF6E0] text-sm p-2 bg-[#31333A]/50 rounded-md">
                      {banned.current.reason || "No reason provided"}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-[#FFF6E0]/70 text-sm mb-1">Ban Date</p>
                        <p className="text-[#FFF6E0] text-sm">{formatDate(banned.current.date)}</p>
                      </div>
                      
                      <div>
                        <p className="text-[#FFF6E0]/70 text-sm mb-1">Action By</p>
                        <p className="text-[#FFF6E0] text-sm">Admin ID: {banned.current.actionBy}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Ban History */}
              {showBanHistory && banned?.history && banned.history.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-medium mb-2 text-[#FFF6E0]/90">Ban History</h4>
                  <div className="max-h-60 overflow-y-auto pr-1">
                    {banned.history.map((entry, index) => (
                      <div 
                        key={index} 
                        className="p-3 rounded-md bg-[#272829] mb-2 border-l-2 border-l-[#FFF6E0]/20"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${entry.status ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          <span className="font-medium text-sm">{entry.status ? 'Banned' : 'Unbanned'}</span>
                          <span className="text-xs text-[#FFF6E0]/60 ml-auto">{formatDate(entry.date)}</span>
                        </div>
                        <p className="text-[#FFF6E0]/80 text-sm mt-1">{entry.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          
        </div>
      );
    };
  
    return (
      <div className="bg-[#272829] text-[#FFF6E0] p-4 md:p-6 min-h-screen">
        {/* Header */}
        <div className="flex flex-col mb-6">
          <button 
            onClick={goBack} 
            className="flex items-center text-[#FFF6E0]/70 hover:text-[#FFF6E0] mb-2 w-fit"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span className="text-sm">Back to Users</span>
          </button>
          
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 inline-block rounded-full mb-2">
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                Admin Panel
              </span>
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
            Moderate User
          </h1>
        </div>
        
        {/* User Display */}
        <div className="bg-[#31333A]/70 rounded-lg border border-[#61677A]/30 p-4">
          {isSearchingUser ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin mr-2 h-6 w-6 border-2 border-[#FFF6E0]/70 border-t-transparent rounded-full"></div>
              <span className="text-[#FFF6E0]/70">Fetching user information...</span>
            </div>
          ) : searchedUser ? (
            renderUserDetails()
          ) : (
            <div className="text-center p-8 text-[#FFF6E0]/70">
              <p>No user found with email: {userEmail}</p>
              <button 
                onClick={goBack}
                className="mt-4 px-4 py-2 bg-[#FFF6E0]/10 hover:bg-[#FFF6E0]/20 rounded-lg text-sm"
              >
                Go back to search for another user
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ModerateUser;