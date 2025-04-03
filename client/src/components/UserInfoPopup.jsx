import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { 
  User, 
  Shield, 
  Info, 
  Calendar, 
  MapPin, 
  Bell,
  BellOff,
  Lock,
  Unlock,
  MessageCircle,
  X,
  AlertTriangle,
  Cake,
  Copy,
  UserPlus,
  UserMinus,
  Users,
  MessageSquare,
  ArrowRight,
  Clock,
  Menu
} from 'lucide-react';

const UserInfoPopup = ({ 
  user, 
  onClose, 
  isUserFriend, 
  friendCount, 
  onAddFriend, 
  onRemoveFriend, 
  sentFriendRequests = [],
  hasReceivedFriendRequest = false,
  onViewFriendRequest = null
}) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isNotificationsMuted, setIsNotificationsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [friendRequestError, setFriendRequestError] = useState("");
  const [showPolicyPopup, setShowPolicyPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Function to check if a friend request has already been sent to this user
  const hasSentRequest = () => {
    return sentFriendRequests.some(request => 
      (request.receiverId?._id === user._id || request.receiverId === user._id) && 
      request.status === "pending"
    );
  };

  // Extract message counts from error message if available
  const extractMessageCounts = () => {
    if (!friendRequestError) return { user1Count: 0, user2Count: 0, requiredCount: 5 };
    
    const requiredMatch = friendRequestError.match(/at least (\d+) messages/);
    const requiredCount = requiredMatch ? parseInt(requiredMatch[1]) : 5;
    
    const countsMatch = friendRequestError.match(/You sent (\d+) messages, they sent (\d+) messages/);
    const user1Count = countsMatch ? parseInt(countsMatch[1]) : 0;
    const user2Count = countsMatch ? parseInt(countsMatch[2]) : 0;
    
    return { user1Count, user2Count, requiredCount };
  };

  // Gender Icon Logic
  const getGenderIcon = (gender) => {
    if (gender === "Male") {
      return "🚹";
    } else if (gender === "Female") {
      return "🚺";
    } else if (gender === "Transgender") {
      return "🏳️‍⚧️";
    } else {
      return "🏳️‍🌈";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Copy Unique Tag to Clipboard
  const copyUniqueTag = () => {
    navigator.clipboard.writeText(user.uniqueTag)
      .then(() => {
        toast.success('Unique Tag Copied!', {
          style: {
            background: '#61677A',
            color: '#FFF6E0',
            border: '1px solid #FFF6E0'
          },
          iconTheme: {
            primary: '#FFF6E0',
            secondary: '#61677A'
          }
        });
      })
      .catch(err => {
        toast.error('Failed to copy', {
          style: {
            background: '#FF6B6B',
            color: '#FFF6E0'
          }
        });
      });
  };

  // Handle Add Friend with policy check
  const handleAddFriend = async () => {
    // If a request has already been sent, show info message
    if (hasSentRequest()) {
      toast.info("Friend request already sent");
      return;
    }
    
    setIsSendingRequest(true);
    setFriendRequestError("");
    setShowPolicyPopup(false);
    
    try {
      await onAddFriend();
      // If successful, the popup will close or update based on parent component
    } catch (error) {
      console.error("Friend request error:", error);
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        // Check if the error is related to message count policy
        if (errorMessage.includes("messages with this user before sending")) {
          setFriendRequestError(errorMessage);
          setShowPolicyPopup(true);
          // Don't show toast for this specific error - we'll show the custom UI
        } else {
          setFriendRequestError(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        setFriendRequestError("Failed to send friend request. Please try again.");
        toast.error("Failed to send friend request. Please try again.");
      }
    } finally {
      setIsSendingRequest(false);
    }
  };

  // Sidebar Navigation Items
  const navItems = [
    { 
      icon: User, 
      label: 'Profile', 
      key: 'profile' 
    },
    { 
      icon: Info, 
      label: 'Details', 
      key: 'details' 
    },
    { 
      icon: Shield, 
      label: 'Privacy', 
      key: 'privacy' 
    }
  ];

  // Render Policy Popup
  const renderPolicyPopup = () => {
    if (!showPolicyPopup) return null;

    const { user1Count, user2Count, requiredCount } = extractMessageCounts();
    
    return (
      <div 
        className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={() => setShowPolicyPopup(false)}
      >
        <div 
          className="w-full max-w-md bg-gradient-to-b from-[#272829] to-[#31333A] rounded-2xl p-4 sm:p-6 shadow-2xl border border-[#61677A]/40 relative mx-2"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button 
            onClick={() => setShowPolicyPopup(false)}
            className="absolute top-3 right-3 text-[#D8D9DA] hover:text-[#FFF6E0] bg-[#61677A]/20 hover:bg-[#61677A]/40 p-1.5 rounded-full transition-all duration-200"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-start mb-4">
            <div className="bg-amber-500/20 p-2 rounded-full mr-3">
              <AlertTriangle className="text-amber-500" size={24} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#FFF6E0] mb-1">
                Friend Request Policy
              </h3>
              <p className="text-[#D8D9DA] text-xs sm:text-sm mb-3">
                We encourage meaningful connections. You need to exchange at least {requiredCount} messages with this user before sending a friend request.
              </p>
            </div>
          </div>
          
          <div className="bg-[#1A1B1C] rounded-xl p-3 sm:p-4 mb-5 border border-[#61677A]/10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#61677A] rounded-full flex items-center justify-center text-[#FFF6E0] mr-2">
                  <User size={14} />
                </div>
                <span className="text-[#FFF6E0] text-sm">You</span>
              </div>
              <div className="flex items-center">
                <span className="text-[#D8D9DA] text-xs sm:text-sm">{user1Count}/{requiredCount}</span>
                <div className="w-16 sm:w-24 h-2 bg-[#61677A]/30 rounded-full ml-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-green-500 rounded-full"
                    style={{ width: `${Math.min(100, (user1Count/requiredCount) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex mb-3">
              <div className="flex-1 border-t border-dashed border-[#61677A]/30 mt-4"></div>
              <div className="px-3 text-[#61677A]">
                <MessageSquare className="mx-auto" size={16} />
                <ArrowRight className="mx-auto mt-1" size={12} />
              </div>
              <div className="flex-1 border-t border-dashed border-[#61677A]/30 mt-4"></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#61677A] rounded-full flex items-center justify-center text-[#FFF6E0] mr-2 overflow-hidden">
                  <img
                    src={user.profileImageURL || "https://via.placeholder.com/150"}
                    alt={`${user.uniqueTag}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="text-[#FFF6E0] text-sm">#{user.uniqueTag}</span>
              </div>
              <div className="flex items-center">
                <span className="text-[#D8D9DA] text-xs sm:text-sm">{user2Count}/{requiredCount}</span>
                <div className="w-16 sm:w-24 h-2 bg-[#61677A]/30 rounded-full ml-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-green-500 rounded-full"
                    style={{ width: `${Math.min(100, (user2Count/requiredCount) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setShowPolicyPopup(false)}
              className="bg-[#61677A] text-[#FFF6E0] px-5 py-2.5 rounded-full hover:bg-[#61677A]/80 transition-all shadow-lg hover:shadow-xl text-sm"
            >
              <MessageCircle size={16} className="inline mr-2" />
              Keep Chatting
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Mobile Menu
  const renderMobileMenu = () => {
    if (!showMobileMenu) return null;
    
    return (
      <div 
        className="fixed inset-0 z-[999998] flex items-end justify-center bg-black/50 backdrop-blur-sm"
        onClick={() => setShowMobileMenu(false)}
      >
        <div 
          className="w-full bg-[#1A1B1C] rounded-t-xl shadow-2xl p-4 animate-slideUp"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-center mb-2">
            <div className="w-10 h-1 bg-[#61677A]/30 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveSection(item.key);
                  setShowMobileMenu(false);
                }}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all duration-300 ${
                  activeSection === item.key 
                    ? 'bg-[#61677A]/40 text-[#FFF6E0]' 
                    : 'text-[#D8D9DA]/70 hover:bg-[#61677A]/20'
                }`}
              >
                {item.key === 'privacy' ? (
                  <div className="relative mb-1">
                    <item.icon size={24} />
                    <AlertTriangle 
                      className="absolute -top-1 -right-1 text-yellow-500" 
                      size={12} 
                    />
                  </div>
                ) : (
                  <item.icon size={24} className="mb-1" />
                )}
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render Active Section Content
  const renderContent = () => {
    switch(activeSection) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#61677A]/30 shadow-lg">
                <img
                  src={user.profileImageURL || "https://via.placeholder.com/150"}
                  alt={`${user.uniqueTag}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {isUserFriend && (
                <h2 className="text-lg sm:text-xl font-bold text-[#FFF6E0] mt-3">{user.name}</h2>
              )}
              
              <div className="flex items-center mt-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#FFF6E0] mr-2 italic">#{user.uniqueTag}</h2>
                <button 
                  onClick={copyUniqueTag}
                  className="text-[#D8D9DA] hover:text-[#FFF6E0] transition-colors p-1.5 rounded-full hover:bg-[#61677A]/20"
                >
                  <Copy size={16} />
                </button>
              </div>

              {isUserFriend && (
                <div className="flex items-center mt-2 text-[#D8D9DA] bg-[#61677A]/10 px-3 py-1 rounded-full text-sm">
                  <Users size={14} className="mr-1" />
                  <span>{friendCount || 0} Friends</span>
                </div>
              )}
            </div>
            
            {friendRequestError && !showPolicyPopup && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-3 flex items-start space-x-2">
                <AlertTriangle className="text-amber-500 mt-1 flex-shrink-0" size={16} />
                <div className="text-amber-500 text-xs sm:text-sm">
                  <p className="font-semibold mb-1">Friend Request Policy</p>
                  <p className="text-xs">{friendRequestError}</p>
                  <p className="mt-1">
                    <button 
                      onClick={() => setShowPolicyPopup(true)}
                      className="underline hover:text-amber-400 transition-colors text-xs"
                    >
                      View Details
                    </button>
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#1A1B1C] p-3 rounded-lg border border-[#61677A]/10">
                <div className="flex items-center space-x-2">
                  <Cake className="text-[#F6B0BA]" size={18} />
                  <span className="text-[#FFF6E0] text-sm">{formatDate(user.dateOfBirth)}</span>
                </div>

                <span className="font-medium text-[#FFF6E0] flex items-center gap-2 bg-[#61677A]/20 px-3 py-1 rounded-full text-xs self-start sm:self-auto">
                  {getGenderIcon(user.gender)} {user.gender}
                </span>
              </div>
              
              <div className="bg-[#1A1B1C] p-3 sm:p-4 rounded-lg border border-[#61677A]/10">
                <h3 className="text-[#D8D9DA] font-semibold mb-3 text-xs sm:text-sm border-b border-[#61677A]/20 pb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.bio.map((interest, index) => (
                    <span 
                      key={index} 
                      className="bg-[#61677A]/20 text-[#FFF6E0] px-2 py-1 rounded-full text-xs hover:bg-[#61677A]/30 transition-all cursor-default"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'details':
        return (
          <div className="space-y-3">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#1A1B1C] p-3 rounded-lg border border-[#61677A]/10">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-[#D8D9DA]" size={18} />
                  <span className="text-[#D8D9DA] text-sm">Created On</span>
                </div>
                <span className="font-medium text-[#FFF6E0] bg-[#61677A]/20 px-3 py-1 rounded-full text-xs self-start sm:self-auto">{formatDate(user.createdAt)}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#1A1B1C] p-3 rounded-lg border border-[#61677A]/10">
                <div className="flex items-center space-x-2">
                  <MapPin className="text-[#D8D9DA]" size={18} />
                  <span className="text-[#D8D9DA] text-sm">Location Radius</span>
                </div>
                <span className="font-medium text-[#FFF6E0] bg-[#61677A]/20 px-3 py-1 rounded-full text-xs self-start sm:self-auto">{user.locationRadiusPreference} km</span>
              </div>
            </div>
          </div>
        );
      
      case 'privacy':
        return (
          <div className="space-y-3">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-3 flex items-center space-x-2">
              <AlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
              <span className="text-yellow-500 text-xs sm:text-sm">
                These features are under development and will be available soon.
              </span>
            </div>
            <div className="space-y-3 opacity-50 pointer-events-none">
              <div className="flex items-center justify-between bg-[#1A1B1C] p-3 rounded-lg border border-[#61677A]/10">
                <div className="flex items-center space-x-2">
                  <Bell className="text-[#D8D9DA]" size={18} />
                  <span className="text-[#D8D9DA] text-sm">Notifications</span>
                </div>
                <button 
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    isNotificationsMuted 
                    ? 'bg-red-500/10 text-red-500' 
                    : 'bg-green-500/10 text-green-500'
                  }`}
                >
                  {isNotificationsMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>
              
              <div className="flex items-center justify-between bg-[#1A1B1C] p-3 rounded-lg border border-[#61677A]/10">
                <div className="flex items-center space-x-2">
                  {isBlocked ? <Lock className="text-red-500" size={18} /> : <Unlock className="text-[#D8D9DA]" size={18} />}
                  <span className="text-[#D8D9DA] text-sm">Block User</span>
                </div>
                <button 
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    isBlocked 
                    ? 'bg-red-500/10 text-red-500' 
                    : 'bg-green-500/10 text-green-500'
                  }`}
                >
                  {isBlocked ? 'Unblock' : 'Block'}
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={onClose}
    >
      {renderPolicyPopup()}
      {renderMobileMenu()}
      
      <div 
        className="relative w-full max-w-sm sm:max-w-md h-auto min-h-[60vh] max-h-[92vh] bg-[#272829] rounded-xl sm:rounded-2xl shadow-2xl flex overflow-hidden border border-[#61677A]/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toaster for notifications */}
        <Toaster position="top-center" />

        {/* Sidebar Navigation - Hidden on Mobile */}
        <div className="hidden sm:flex w-16 sm:w-20 bg-[#1A1B1C] border-r border-[#61677A]/20 flex-col py-4 sm:py-6 items-center">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`p-2 sm:p-3 rounded-lg mb-2 sm:mb-3 transition-all duration-300 ${
                activeSection === item.key 
                  ? 'bg-[#61677A]/40 text-[#FFF6E0] shadow-md' 
                  : 'text-[#D8D9DA]/50 hover:bg-[#61677A]/10 hover:text-[#D8D9DA]'
              }`}
            >
              {item.key === 'privacy' ? (
                <div className="relative">
                  <item.icon size={18} className="sm:h-5 sm:w-5" />
                  <AlertTriangle 
                    className="absolute -top-1 -right-1 text-yellow-500" 
                    size={10} 
                  />
                </div>
              ) : (
                <item.icon size={18} className="sm:h-5 sm:w-5" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-3 sm:p-4 border-b border-[#61677A]/10 bg-gradient-to-r from-[#272829] to-[#31333A]">
            {/* Mobile Menu Button - Visible only on mobile */}
            <button 
              onClick={() => setShowMobileMenu(true)}
              className="sm:hidden text-[#D8D9DA] hover:bg-[#61677A]/20 p-1.5 rounded-full transition-all duration-200"
            >
              <Menu size={20} />
            </button>
            
            <h2 className="text-base sm:text-lg font-semibold text-[#FFF6E0]">
              {navItems.find(item => item.key === activeSection)?.label}
            </h2>
            <button 
              onClick={onClose} 
              className="text-[#D8D9DA] hover:bg-[#61677A]/20 p-1.5 sm:p-2 rounded-full transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-5 flex-1 overflow-y-auto">
            {renderContent()}
          </div>

          {/* Action Buttons */}
          {activeSection === 'profile' && (
            <div className="p-3 sm:p-4 bg-gradient-to-b from-[#272829] to-[#1A1B1C] border-t border-[#61677A]/10 flex flex-col sm:flex-row gap-2">
              <button 
                onClick={onClose} 
                className="flex-1 bg-[#61677A] text-[#FFF6E0] rounded-full py-2.5 sm:py-3 flex items-center justify-center hover:bg-[#61677A]/80 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                <MessageCircle size={18} className="mr-2" />
                Message
              </button>
              
              {isUserFriend ? (
                <button 
                  onClick={onRemoveFriend}
                  className="flex-1 bg-red-500/10 text-red-500 rounded-full py-2.5 sm:py-3 flex items-center justify-center hover:bg-red-500/20 transition-all duration-300 border border-red-500/30 text-sm"
                >
                  <UserMinus size={18} className="mr-2" />
                  Remove Friend
                </button>
              ) : hasReceivedFriendRequest ? (
                <button 
                  onClick={onViewFriendRequest}
                  className="flex-1 bg-amber-500/10 text-amber-500 rounded-full py-2.5 sm:py-3 flex items-center justify-center hover:bg-amber-500/20 transition-all duration-300 animate-pulse border border-amber-500/30 text-sm"
                >
                  <UserPlus size={18} className="mr-2" />
                  View Request
                </button>
              ) : hasSentRequest() ? (
                <button
                  disabled
                  className="flex-1 bg-amber-500/10 text-amber-500 rounded-full py-2.5 sm:py-3 flex items-center justify-center opacity-80 cursor-not-allowed border border-amber-500/30 text-sm"
                >
                  <Clock size={18} className="mr-2" />
                  Request Sent
                </button>
              ) : (
                <button 
                  onClick={handleAddFriend}
                  disabled={isSendingRequest}
                  className="flex-1 bg-green-500/10 text-green-500 rounded-full py-2.5 sm:py-3 flex items-center justify-center hover:bg-green-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-green-500/30 text-sm"
                >
                  {isSendingRequest ? (
                    <>
                      <span className="animate-pulse">Processing...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} className="mr-2" />
                      Add Friend
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoPopup;