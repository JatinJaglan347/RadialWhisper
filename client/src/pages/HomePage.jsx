import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { MessageCircle, Send, RefreshCw } from 'lucide-react';

const HomePage = () => {
  const { 
    authUser, 
    fetchNearbyUsers, 
    nearbyUsersData, 
    isFetchingNearbyUsers, 
    connectSocket, 
    socket,
    sendMessage,
    messages, 
    unreadMessagesBySender 
  } = useAuthStore();
  
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState({});

  const messagesEndRef = useRef(null);
  const isInitialFetchDone = useRef(false);
  const activeChatUserRef = useRef(activeChatUser);




  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    // Format: HH:MM AM/PM
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  
  // Update ref whenever activeChatUser changes
  useEffect(() => {
    activeChatUserRef.current = activeChatUser;
  }, [activeChatUser]);

  const arrayOfNearbyUserData = Array.isArray(nearbyUsersData?.data?.nearbyUsers)
    ? nearbyUsersData?.data?.nearbyUsers
    : [];

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect socket when user is authenticated
  useEffect(() => {
    if (authUser) {
      connectSocket();
      const timer = setTimeout(() => {
        const currentSocket = useAuthStore.getState().socket;
        if (currentSocket && authUser?.data?.user?._id) {
          currentSocket.emit("registerUser", { userId: authUser.data.user._id });
          console.log("User registered via socket:", authUser.data.user._id);
          
          useAuthStore.getState().setCurrentUserId(authUser.data.user._id);
          // Add socket event listeners for debugging
          currentSocket.on("connect", () => {
            console.log("Socket connected");
          });
          
          currentSocket.on("disconnect", () => {
            console.log("Socket disconnected");
          });
          
          currentSocket.on("error", (error) => {
            console.error("Socket error:", error);
            toast.error(error.message || "Socket error occurred");
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [authUser, connectSocket]);











  // Fetch user's current location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Geolocation error:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermissionDenied(true);
            toast.error('Location permission denied. Please allow location access.');
          } else {
            toast.error('Failed to fetch location. Please try again.');
          }
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  // Fetch nearby users periodically based on location
  const refreshTime = 100000; // 100 seconds
  useEffect(() => {
    if (location.latitude && location.longitude && !isInitialFetchDone.current) {
      fetchNearbyUsers(location);
      isInitialFetchDone.current = true;
    }
    const fetchInterval = setInterval(() => {
      if (location.latitude && location.longitude) {
        fetchNearbyUsers(location);
      }
    }, refreshTime);
    return () => clearInterval(fetchInterval);
  }, [location, fetchNearbyUsers]);

  // Fetch location when authenticated
  useEffect(() => {
    if (authUser && !locationPermissionDenied) {
      fetchLocation();
    }
  }, [authUser, locationPermissionDenied]);

  // Listen for chat started event
  useEffect(() => {
    if (!socket) return;
    
    const chatStartedHandler = (data) => {
      setActiveChatRoom(data.roomId);
      console.log("Chat started in room:", data.roomId);
    };
    
    socket.on("chatStarted", chatStartedHandler);
    
    return () => {
      socket.off("chatStarted", chatStartedHandler);
    };
  }, [socket]);

  // Listen for chat history event
  useEffect(() => {
    if (!socket) return;
    
    const chatHistoryHandler = (data) => {
      if (data.roomId) {
        // Update the messages in the store
        useAuthStore.setState({ 
          messages: data.history,
          activeChatRoom: data.roomId
        });
        console.log("Received chat history for room", data.roomId, data.history);
      }
    };
    
    socket.on("chatHistory", chatHistoryHandler);
    
    return () => {
      socket.off("chatHistory", chatHistoryHandler);
    };
  }, [socket]);


// In your HomePage component:

// Add this to your message listener useEffect where you're already tracking unread messages
// In your HomePage component:

useEffect(() => {
  if (!socket) return;
  
  const messageReceivedHandler = (data) => {
    console.log('Received message payload:', data);
    
    // Get current state directly from store
    const currentState = useAuthStore.getState();
    const currentActiveChatUser = activeChatUserRef.current?._id;
    const currentUserId = currentState.authUser?.data?.user?._id;
    
    // Don't count messages sent by the current user
    if (data.sender !== currentUserId) {
      // Update the messages array if it's for the active chat
      if (data.sender === currentActiveChatUser) {
        // Add to messages only if not a duplicate
        useAuthStore.setState(state => {
          const isDuplicate = state.messages.some(
            msg => msg.timestamp === data.timestamp && msg.sender === data.sender
          );
          
          if (!isDuplicate) {
            return {
              messages: [...state.messages, data]
            };
          }
          return state;
        });
        
        // Mark as read immediately if this is the active chat
        if (socket && data.room) {
          socket.emit("markMessagesAsRead", { roomId: data.room });
        }
      } 
      // If message is from someone other than active chat user, increment unread count
      else {
        // Use the sender's ID to track unread messages
        setUnreadMessages(prev => ({
          ...prev,
          [data.sender]: (prev[data.sender] || 0) + 1
        }));
        
        // Update localStorage to persist between sessions
        try {
          const storedUnread = JSON.parse(localStorage.getItem('unreadMessages') || '{}');
          storedUnread[data.sender] = (storedUnread[data.sender] || 0) + 1;
          localStorage.setItem('unreadMessages', JSON.stringify(storedUnread));
        } catch (error) {
          console.error("Error storing unread messages:", error);
        }
      }
    }
  };
  
  socket.on("newMessage", messageReceivedHandler);
  
  return () => {
    socket.off("newMessage", messageReceivedHandler);
  };
}, [socket]);



// Update the useEffect for socket registration to include the user ID in the state
useEffect(() => {
  if (authUser) {
    connectSocket();
    const timer = setTimeout(() => {
      const currentSocket = useAuthStore.getState().socket;
      if (currentSocket && authUser?.data?.user?._id) {
        currentSocket.emit("registerUser", { userId: authUser.data.user._id });
        console.log("User registered via socket:", authUser.data.user._id);
        
        // Store the user ID in the state for easy access
        useAuthStore.setState({
          currentUserId: authUser.data.user._id
        });
        
        // Add socket event listeners for debugging
        currentSocket.on("connect", () => {
          console.log("Socket connected");
        });
        
        currentSocket.on("disconnect", () => {
          console.log("Socket disconnected");
        });
        
        currentSocket.on("error", (error) => {
          console.error("Socket error:", error);
          toast.error(error.message || "Socket error occurred");
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }
}, [authUser, connectSocket]);

















// Modify handleStartChat to properly clear unread messages
const handleStartChat = (user) => {
  const currentSocket = useAuthStore.getState().socket;
  
  // Reset messages when starting a new chat
  useAuthStore.setState({ 
    messages: [],
    activeChatRoom: null 
  });
  
  if (currentSocket && activeChatRoom) {
    currentSocket.emit("leaveChat", { roomId: activeChatRoom });
    console.log("Requested to leave previous chat room:", activeChatRoom);
  }
  
  // Clear unread messages for ONLY this user (not all users)
  setUnreadMessages(prev => {
    const newUnread = { ...prev };
    newUnread[user._id] = 0;
    
    // Update localStorage too
    try {
      const storedUnread = JSON.parse(localStorage.getItem('unreadMessages') || '{}');
      storedUnread[user._id] = 0;
      localStorage.setItem('unreadMessages', JSON.stringify(storedUnread));
    } catch (error) {
      console.error("Error updating stored unread messages:", error);
    }
    
    return newUnread;
  });
  
  setActiveChatUser(user);
  if (currentSocket) {
    currentSocket.emit("joinChat", { targetUserId: user._id });
    console.log("Joining chat with user:", user._id);
    
    // Auto-close sidebar on mobile when selecting a chat
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  } else {
    toast.error("Socket is not connected.");
  }
};


// Add this useEffect to update the document title with unread count
useEffect(() => {
  const totalUnread = Object.values(unreadMessagesBySender).reduce((sum, count) => sum + count, 0);
  if (totalUnread > 0) {
    document.title = `(${totalUnread}) ChatApp`;
  } else {
    document.title = 'ChatApp';
  }
}, [unreadMessagesBySender]);


  // Send a message to the active chat
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    if (socket && activeChatRoom) {
      // Send message through socket
      socket.emit("message", { 
        roomId: activeChatRoom, 
        message: chatMessage 
      });
      
      console.log("Message sent:", chatMessage);
      console.log("Current Active Chat Room:", activeChatRoom);
      
      // Clear message input after sending
      setChatMessage("");
    } else {
      toast.error("No active chat room. Please start a chat first.");
    }
  };

  // Refresh the list of nearby users
  const handleRefreshNearby = () => {
    if (location.latitude && location.longitude) {
      fetchNearbyUsers(location);
      toast.success('Refreshed nearby users');
    } else {
      fetchLocation();
    }
  };

  // Handle Enter key press in chat input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  // Add this effect to listen for messagesRead events
useEffect(() => {
  if (!socket) return;
  
  const messagesReadHandler = (data) => {
    console.log('Messages marked as read:', data);
    
    // Update message status in the store
    useAuthStore.setState(state => {
      const updatedMessages = state.messages.map(msg => {
        // Check if this message is in the list of read messages
        if (data.messageIds.includes(msg._id)) {
          return { ...msg, status: 'read' };
        }
        return msg;
      });
      
      return { messages: updatedMessages };
    });
  };
  
  socket.on("messagesRead", messagesReadHandler);
  
  return () => {
    socket.off("messagesRead", messagesReadHandler);
  };
}, [socket]);


// Add this to your HomePage.jsx component
useEffect(() => {
  if (!socket) return;
  
  const messageDeliveredHandler = (data) => {
    console.log('Message delivered:', data);
    
    // Update message status in the store
    useAuthStore.setState(state => {
      const updatedMessages = state.messages.map(msg => {
        // Check if this message ID matches the delivered message
        if (msg._id === data.messageId) {
          return { ...msg, status: 'delivered' };
        }
        return msg;
      });
      
      return { messages: updatedMessages };
    });
  };
  
  socket.on("messageDelivered", messageDeliveredHandler);
  
  return () => {
    socket.off("messageDelivered", messageDeliveredHandler);
  };
}, [socket]);

// Add this function to mark messages as read when viewing a chat
const markMessagesAsRead = () => {
  if (socket && activeChatRoom && activeChatUser) {
    // Only mark messages as read if they're from the other user
    socket.emit("markMessagesAsRead", { roomId: activeChatRoom });
    console.log("Marking messages as read in room:", activeChatRoom);
  }
};
useEffect(() => {
  if (activeChatRoom && messages.length > 0) {
    markMessagesAsRead();
  }
}, [activeChatRoom, messages.length]);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#FFF6E0] overflow-hidden relative">
      {/* Mobile Burger Menu - Positioned on the right */}
      {!sidebarOpen && (
        <button 
          className="md:hidden absolute top-4 right-4 z-30 bg-[#272829] text-[#FFF6E0] p-2 rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
      )}
      
      {/* Mobile Overlay Sidebar */}
      <div 
        className={`
          md:hidden 
          fixed 
          inset-y-0 
          right-0 
          z-20 
          bg-[#272829] 
          transform 
          transition-transform 
          duration-300 
          ease-in-out 
          shadow-2xl
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 text-[#FFF6E0] text-2xl"
          onClick={toggleSidebar}
        >
          ×
        </button>

        {/* Mobile Nearby Users List */}
        <aside className="h-full flex flex-col text-[#FFF6E0] overflow-hidden">
          {/* Navbar for users section */}
          <div className="sticky top-0 z-10 p-4 bg-[#272829] border-b border-[#3a3b3c] shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center">
                <MessageCircle className="mr-2" /> Nearby Users
              </h2>
              <button 
                onClick={handleRefreshNearby}
                className="p-2 rounded-full hover:bg-[#3a3b3c] transition-colors"
                title="Refresh nearby users"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto">
            {isFetchingNearbyUsers && (
              <div className="p-4 text-center text-[#FFF6E0] opacity-75">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                <p>Loading users...</p>
              </div>
            )}
            
            {!isFetchingNearbyUsers && arrayOfNearbyUserData.length === 0 && (
              <div className="p-8 text-center text-[#FFF6E0] opacity-75">
                <p>No nearby users found.</p>
                <button
                  onClick={handleRefreshNearby}
                  className="mt-4 px-4 py-2 bg-[#61677A] rounded-lg hover:bg-[#505460] transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {arrayOfNearbyUserData.length > 0 && (
              <div className="space-y-2 p-3">
                {arrayOfNearbyUserData.map((user) => {
                  const unreadCount = unreadMessages[user._id] || 0;
                  return (
                    <div
                      key={user._id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        activeChatUser?._id === user._id 
                          ? 'bg-[#505460]' 
                          : 'bg-[#61677A] hover:bg-[#505460]'
                      }`}
                      onClick={() => {
                        handleStartChat(user);
                        toggleSidebar();
                      }}
                    >
                      <div className="relative">
                        <img
                          src={user.profileImageURL || 'https://via.placeholder.com/150'}
                          alt="Profile"
                          className="w-12 h-12 rounded-full mr-3 object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#61677A]"></span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{user.fullName}</h3>
                        <p className="text-sm text-[#FFF6E0] opacity-75">{user.email}</p>
                      </div>
                      {unreadCount > 0 && (
                        <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-0"
          onClick={toggleSidebar}
        />
      )}
  
      {/* Desktop Sidebar */}
      <aside className={`
        hidden 
        md:block 
        md:w-1/3 
        lg:w-1/4 
        bg-[#272829] 
        text-[#FFF6E0] 
        h-full 
        flex 
        flex-col
      `}>
        {/* Desktop Sidebar Header */}
        <div className="sticky top-0 z-10 p-4 bg-[#272829] border-b border-[#3a3b3c] shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <MessageCircle className="mr-2" /> Nearby Users
            </h2>
            <button 
              onClick={handleRefreshNearby}
              className="p-2 rounded-full hover:bg-[#3a3b3c] transition-colors"
              title="Refresh nearby users"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
  
        {/* Desktop User List */}
        <div className="flex-1 overflow-y-auto">
          {isFetchingNearbyUsers && (
            <div className="p-4 text-center text-[#FFF6E0] opacity-75">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
              <p>Loading users...</p>
            </div>
          )}
          
          {!isFetchingNearbyUsers && arrayOfNearbyUserData.length === 0 && (
            <div className="p-8 text-center text-[#FFF6E0] opacity-75">
              <p>No nearby users found.</p>
              <button
                onClick={handleRefreshNearby}
                className="mt-4 px-4 py-2 bg-[#61677A] rounded-lg hover:bg-[#505460] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {arrayOfNearbyUserData.length > 0 && (
            <div className="space-y-2 p-3">
              {arrayOfNearbyUserData.map((user) => {
                const unreadCount = unreadMessages[user._id] || 0;
                return (
                  <div
                    key={user._id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      activeChatUser?._id === user._id 
                        ? 'bg-[#505460]' 
                        : 'bg-[#61677A] hover:bg-[#505460]'
                    }`}
                    onClick={() => handleStartChat(user)}
                  >
                    <div className="relative">
                      <img
                        src={user.profileImageURL || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="w-12 h-12 rounded-full mr-3 object-cover"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#61677A]"></span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{user.fullName}</h3>
                      <p className="text-sm text-[#FFF6E0] opacity-75">{user.email}</p>
                    </div>
                    {unreadCount > 0 && (
                      <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
  
      {/* Right Panel - Chat Area */}
      <main className="flex-1 flex flex-col h-full bg-[#FFF6E0] text-[#272829] relative">
        {activeChatUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-[#FFF6E0] shadow-sm">
              <div className="flex items-center">
                <img
                  src={activeChatUser.profileImageURL || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-lg font-bold">{activeChatUser.fullName}</h2>
                  <div className="flex items-center text-xs text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Online
                  </div>
                </div>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeChatRoom ? (
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg, idx) => {
                      const isMe = msg.sender === authUser.data.user._id;
                      return (
                        <div 
                          key={idx} 
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                              isMe 
                                ? 'bg-[#272829] text-[#FFF6E0]' 
                                : 'bg-[#61677A] text-[#FFF6E0]'
                            }`}
                          >
                            <p>{msg.message}</p>
                            <div className="text-xs mt-1 text-right opacity-70">
  {formatTime(msg.timestamp)}
  {isMe && (
    <span className="ml-2">
      {msg.status === 'sent' && '✓'}
      {msg.status === 'delivered' && '✓✓'}
      {msg.status === 'read' && (
        <span className="text-blue-400">✓✓</span>
      )}
    </span>
  )}
</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#61677A]">
                      <div className="text-center">
                        <MessageCircle size={40} className="mx-auto mb-2 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm">Send a message to start the conversation</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-[#61677A]">
                  <div className="text-center">
                    <RefreshCw size={30} className="mx-auto mb-2 animate-spin" />
                    <p>Connecting to chat...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-[#FFF6E0] sticky bottom-0 left-0 right-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-[#272829] text-[#FFF6E0] border border-[#272829] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#272829]"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-[#272829] text-[#FFF6E0] px-4 py-2 rounded-lg hover:bg-[#61677A] transition-colors flex items-center"
                  disabled={!activeChatRoom || !chatMessage.trim()}
                >
                  <Send size={18} className="mr-1" /> Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#61677A] p-4">
            <div className="text-center max-w-md">
              <MessageCircle size={60} className="mx-auto mb-4 opacity-30" />
              <h2 className="text-2xl font-bold mb-2">Start Chatting</h2>
              <p className="mb-4">Select a user from the nearby users to start chatting</p>
              <p className="text-sm">Make sure your location is enabled to find nearby users</p>
            </div>
          </div>
        )}
      </main>
  
      {/* Location Permission Denial Modal */}
      {locationPermissionDenied && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="p-6 bg-[#FFF6E0] rounded-lg shadow-lg max-w-md m-4">
            <h3 className="text-xl font-bold mb-4 text-[#272829]">Location Access Required</h3>
            <p className="mb-6 text-[#272829]">
              Location permission was denied. Please enable location access in your browser settings to find nearby users.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setLocationPermissionDenied(false);
                  fetchLocation();
                }}
                className="bg-[#272829] text-[#FFF6E0] px-4 py-2 rounded-lg hover:bg-[#61677A] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setLocationPermissionDenied(false)}
                className="border border-[#272829] text-[#272829] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Menu component for mobile sidebar toggle
const Menu = ({ size }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
};

export default HomePage;