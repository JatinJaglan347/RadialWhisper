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
  Clock
} from 'lucide-react';

const UserInfoPopup = ({ user, onClose, isUserFriend, friendCount, onAddFriend, onRemoveFriend, sentFriendRequests = [] }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isNotificationsMuted, setIsNotificationsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [friendRequestError, setFriendRequestError] = useState("");
  const [showPolicyPopup, setShowPolicyPopup] = useState(false);

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
        className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={() => setShowPolicyPopup(false)}
      >
        <div 
          className="w-full max-w-md bg-gradient-to-b from-[#272829] to-[#31333A] rounded-2xl p-6 shadow-2xl border border-[#61677A]/40"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start mb-4">
            <div className="bg-amber-500/20 p-2 rounded-full mr-4">
              <AlertTriangle className="text-amber-500" size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FFF6E0] mb-2">
                Friend Request Policy
              </h3>
              <p className="text-[#D8D9DA] text-sm mb-3">
                We encourage meaningful connections. You need to exchange at least {requiredCount} messages with this user before sending a friend request.
              </p>
            </div>
          </div>
          
          <div className="bg-[#1A1B1C] rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#61677A] rounded-full flex items-center justify-center text-[#FFF6E0] mr-2">
                  <User size={16} />
                </div>
                <span className="text-[#FFF6E0]">You</span>
              </div>
              <div className="flex items-center">
                <span className="text-[#D8D9DA] text-sm">{user1Count}/{requiredCount} messages</span>
                <div className="w-20 h-2 bg-[#61677A]/30 rounded-full ml-2 overflow-hidden">
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
                <MessageSquare className="mx-auto" size={18} />
                <ArrowRight className="mx-auto mt-1" size={14} />
              </div>
              <div className="flex-1 border-t border-dashed border-[#61677A]/30 mt-4"></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#61677A] rounded-full flex items-center justify-center text-[#FFF6E0] mr-2">
                  <img
                    src={user.profileImageURL || "https://via.placeholder.com/150"}
                    alt={`${user.uniqueTag}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="text-[#FFF6E0]">#{user.uniqueTag}</span>
              </div>
              <div className="flex items-center">
                <span className="text-[#D8D9DA] text-sm">{user2Count}/{requiredCount} messages</span>
                <div className="w-20 h-2 bg-[#61677A]/30 rounded-full ml-2 overflow-hidden">
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
              className="bg-[#61677A] text-[#FFF6E0] px-6 py-3 rounded-full hover:bg-[#61677A]/80 transition-all"
            >
              <MessageCircle size={18} className="inline mr-2" />
              Keep Chatting
            </button>
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
              <img
                src={user.profileImageURL || "https://via.placeholder.com/150"}
                alt={`${user.uniqueTag}'s profile`}
                className="w-28 h-28 rounded-full object-cover border-4 border-[#61677A]/30"
              />
              
              {isUserFriend && (
                <h2 className="text-xl font-bold text-[#FFF6E0] mt-3">{user.name}</h2>
              )}
              
              <div className="flex items-center mt-2">
                <h2 className="text-xl font-bold text-[#FFF6E0] mr-2 italic">#{user.uniqueTag}</h2>
                <button 
                  onClick={copyUniqueTag}
                  className="text-[#D8D9DA] hover:text-[#FFF6E0] transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>

              {isUserFriend && (
                <div className="flex items-center mt-2 text-[#D8D9DA]">
                  <Users size={16} className="mr-1" />
                  <span>{friendCount || 0} Friends</span>
                </div>
              )}
            </div>
            
            {friendRequestError && !showPolicyPopup && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4 flex items-start space-x-3">
                <AlertTriangle className="text-amber-500 mt-1 flex-shrink-0" size={18} />
                <div className="text-amber-500 text-sm">
                  <p className="font-semibold mb-1">Friend Request Policy</p>
                  <p>{friendRequestError}</p>
                  <p className="mt-1">
                    <button 
                      onClick={() => setShowPolicyPopup(true)}
                      className="underline hover:text-amber-400 transition-colors"
                    >
                      View Details
                    </button>
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap">
                <div className="flex items-center space-x-1">
                  <Cake className="text-[#F6B0BA]" size={20} />
                  <span className="text-[#FFF6E0]">{formatDate(user.dateOfBirth)}</span>
                </div>

                <span className="font-medium text-[#FFF6E0] flex items-center gap-2">
                  {getGenderIcon(user.gender)} {user.gender}
                </span>
              </div>
              
              <div>
                <h3 className="text-[#D8D9DA] font-semibold mb-2 text-sm">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.bio.map((interest, index) => (
                    <span 
                      key={index} 
                      className="bg-[#61677A]/20 text-[#FFF6E0] px-2 py-1 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      // Rest of the code remains the same as in the previous implementation
      case 'details':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-[#D8D9DA]" size={20} />
                  <span className="text-[#D8D9DA]">Created On</span>
                </div>
                <span className="font-medium text-[#FFF6E0]">{formatDate(user.createdAt)}</span>
              </div>
              
              <div className="flex items-center justify-between flex-wrap">
                <div className="flex items-center space-x-3">
                  <MapPin className="text-[#D8D9DA]" size={20} />
                  <span className="text-[#D8D9DA]">Location Radius</span>
                </div>
                <span className="font-medium text-[#FFF6E0]">{user.locationRadiusPreference} km</span>
              </div>
            </div>
          </div>
        );
      
      case 'privacy':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4 flex items-center space-x-3">
              <AlertTriangle className="text-yellow-500" size={24} />
              <span className="text-yellow-500 text-sm">
                These features are under development and will be available soon.
              </span>
            </div>
            <div className="space-y-4 opacity-50 pointer-events-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="text-[#D8D9DA]" size={20} />
                  <span className="text-[#D8D9DA]">Notifications</span>
                </div>
                <button 
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    isNotificationsMuted 
                    ? 'bg-red-500/10 text-red-500' 
                    : 'bg-green-500/10 text-green-500'
                  }`}
                >
                  {isNotificationsMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isBlocked ? <Lock className="text-red-500" size={20} /> : <Unlock className="text-[#D8D9DA]" size={20} />}
                  <span className="text-[#D8D9DA]">Block User</span>
                </div>
                <button 
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
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
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {renderPolicyPopup()}
      
      <div 
        className="relative w-full max-w-md h-auto min-h-[60vh] max-h-[90vh] bg-[#272829] rounded-2xl shadow-2xl flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toaster for notifications */}
        <Toaster position="top-center" />

        {/* Rest of the component remains the same */}
        {/* Sidebar Navigation */}
        <div className="w-20 bg-[#272829] border-r border-[#61677A]/20 flex flex-col py-6 items-center">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`p-3 rounded-lg mb-2 transition-all duration-300 ${
                activeSection === item.key 
                  ? 'bg-[#61677A]/30 text-[#FFF6E0]' 
                  : 'text-[#D8D9DA]/50 hover:bg-[#61677A]/10 hover:text-[#D8D9DA]'
              }`}
            >
              {item.key === 'privacy' ? (
                <div className="relative">
                  <item.icon size={20} />
                  <AlertTriangle 
                    className="absolute -top-1 -right-1 text-yellow-500" 
                    size={12} 
                  />
                </div>
              ) : (
                <item.icon size={20} />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-[#61677A]/10">
            <h2 className="text-lg font-semibold text-[#FFF6E0]">
              {navItems.find(item => item.key === activeSection)?.label}
            </h2>
            <button 
              onClick={onClose} 
              className="text-[#D8D9DA] hover:bg-[#61677A]/10 p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            {renderContent()}
          </div>

          {/* Action Buttons */}
          {activeSection === 'profile' && (
            <div className="p-4 bg-[#272829] border-t border-[#61677A]/10 flex gap-2">
              <button 
                onClick={onClose} 
                className="flex-1 bg-[#61677A] text-[#FFF6E0] rounded-full py-3 flex items-center justify-center hover:bg-[#61677A]/80 transition-all duration-300"
              >
                <MessageCircle size={20} className="mr-2" />
                Message
              </button>
              
              {isUserFriend ? (
                <button 
                  onClick={onRemoveFriend}
                  className="flex-1 bg-red-500/10 text-red-500 rounded-full py-3 flex items-center justify-center hover:bg-red-500/20 transition-all duration-300"
                >
                  <UserMinus size={20} className="mr-2" />
                  Remove Friend
                </button>
              ) : hasSentRequest() ? (
                <button
                  disabled
                  className="flex-1 bg-amber-500/10 text-amber-500 rounded-full py-3 flex items-center justify-center opacity-80 cursor-not-allowed"
                >
                  <Clock size={20} className="mr-2" />
                  Request Sent
                </button>
              ) : (
                <button 
                  onClick={handleAddFriend}
                  disabled={isSendingRequest}
                  className="flex-1 bg-green-500/10 text-green-500 rounded-full py-3 flex items-center justify-center hover:bg-green-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingRequest ? (
                    <>
                      <span className="animate-pulse">Processing...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} className="mr-2" />
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