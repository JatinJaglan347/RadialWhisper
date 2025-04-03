import React from 'react';
import { 
  AlertTriangle, 
  MessageCircle, 
  User,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

const FriendRequestPolicyPopup = ({ 
  onClose, 
  errorMessage,
  user
}) => {
  // Extract message counts from error message if available
  const extractMessageCounts = () => {
    if (!errorMessage) return { user1Count: 0, user2Count: 0, requiredCount: 5 };
    
    const requiredMatch = errorMessage.match(/at least (\d+) messages/);
    const requiredCount = requiredMatch ? parseInt(requiredMatch[1]) : 5;
    
    const countsMatch = errorMessage.match(/You sent (\d+) messages, they sent (\d+) messages/);
    const user1Count = countsMatch ? parseInt(countsMatch[1]) : 0;
    const user2Count = countsMatch ? parseInt(countsMatch[2]) : 0;
    
    return { user1Count, user2Count, requiredCount };
  };

  const { user1Count, user2Count, requiredCount } = extractMessageCounts();

  return (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
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
                  src={user?.profileImageURL || "https://via.placeholder.com/150"}
                  alt={`${user?.uniqueTag || "User"}`}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-[#FFF6E0]">#{user?.uniqueTag || "User"}</span>
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
            onClick={onClose}
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

export default FriendRequestPolicyPopup; 