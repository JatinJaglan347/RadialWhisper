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
  Users
} from 'lucide-react';

const UserInfoPopup = ({ user, onClose, isUserFriend, friendCount, onAddFriend, onRemoveFriend }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isNotificationsMuted, setIsNotificationsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

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
              ) : (
                <button 
                  onClick={onAddFriend}
                  className="flex-1 bg-green-500/10 text-green-500 rounded-full py-3 flex items-center justify-center hover:bg-green-500/20 transition-all duration-300"
                >
                  <UserPlus size={20} className="mr-2" />
                  Add Friend
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