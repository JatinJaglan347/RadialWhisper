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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  <div className="h-screen flex flex-col md:flex-row overflow-hidden relative">
    {/* Dynamic background elements - removed blur */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[#272829] opacity-90"></div>
     
      <div className="absolute inset-0 bg-[url('/src/assets/images/abstract-pattern.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
    </div>
    
    {/* Minimal floating orbs for visual interest - removed blur */}
    <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-[#61677A] opacity-20 animate-pulse hidden md:block" style={{animationDuration: '10s'}}></div>
    <div className="absolute bottom-20 left-40 w-72 h-72 rounded-full bg-[#61677A] opacity-20 animate-pulse hidden md:block" style={{animationDuration: '15s'}}></div>
    
    {/* Subtle grid pattern */}
    <div className="absolute inset-0 opacity-5 hidden md:block">
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, #FFF6E0 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>
    </div>

    {/* Mobile Burger Menu */}
    {!sidebarOpen && (
      <button 
        className="md:hidden absolute top-4 right-4 z-30 bg-[#272829] text-[#FFF6E0] p-3 rounded-full shadow-md hover:bg-[#31333A] transition-all duration-300"
        onClick={toggleSidebar}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
    )}
    
    {/* Mobile Overlay Sidebar with improved animation - removed backdrop blur */}
    <div 
      className={`
        md:hidden 
        fixed 
        inset-y-0 
        right-0 
        z-30 
        w-4/5
        max-w-sm
        bg-gradient-to-b from-[#272829] to-[#31333A]
        transform 
        transition-all 
        duration-300 
        ease-in-out 
        shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button with hover effect */}
      <button 
        className="absolute top-4 right-4 bg-[#272829]/50 p-2 rounded-full text-[#FFF6E0] hover:bg-[#61677A] hover:rotate-90 transition-all duration-300"
        onClick={toggleSidebar}
        aria-label="Close menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Mobile Nearby Users List - removed backdrop blur */}
      <aside className="h-full flex flex-col text-[#FFF6E0] overflow-hidden">
        {/* Navbar for users section */}
        <div className="sticky top-0 z-10 p-6 bg-[#272829]/70 border-b border-[#3a3b3c] shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <MessageCircle className="mr-2" /> 
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Nearby Users</span>
            </h2>
            <button 
              onClick={handleRefreshNearby}
              className="p-2 rounded-full hover:bg-[#3a3b3c] transition-all duration-300 hover:rotate-180"
              title="Refresh nearby users"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* User List with animation on each item */}
        <div className="flex-1 overflow-y-auto p-4">
          {isFetchingNearbyUsers && (
            <div className="p-4 text-center text-[#FFF6E0] opacity-75">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
              <p>Discovering nearby connections...</p>
            </div>
          )}
          
          {!isFetchingNearbyUsers && arrayOfNearbyUserData.length === 0 && (
            <div className="p-8 text-center text-[#FFF6E0] opacity-75">
              <div className="bg-[#272829]/30 p-6 rounded-xl border border-[#61677A]/30 shadow-lg">
                <p className="mb-4">No nearby users found.</p>
                <button
                  onClick={handleRefreshNearby}
                  className="px-4 py-2 bg-gradient-to-r from-[#FFF6E0]/20 to-[#D8D9DA]/20 hover:from-[#FFF6E0]/30 hover:to-[#D8D9DA]/30 rounded-lg transition-all duration-300 text-[#FFF6E0] transform hover:scale-105"
                >
                  <RefreshCw size={16} className="inline mr-2" /> Try Again
                </button>
              </div>
            </div>
          )}
          
          {arrayOfNearbyUserData.length > 0 && (
            <div className="space-y-3">
              {arrayOfNearbyUserData.map((user, index) => {
                const unreadCount = unreadMessages[user._id] || 0;
                return (
                  <div
                    key={user._id}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform ${
                      activeChatUser?._id === user._id 
                        ? 'bg-gradient-to-r from-[#61677A] to-[#505460] shadow-lg scale-102' 
                        : 'bg-[#272829]/40 hover:bg-[#61677A]/60 hover:scale-105'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => {
                      handleStartChat(user);
                      toggleSidebar();
                    }}
                  >
                    <div className="relative">
                      <div className="relative overflow-hidden rounded-full w-14 h-14 border-2 border-[#61677A]/50">
                        <img
                          src={user.profileImageURL || 'https://via.placeholder.com/150'}
                          alt={`${user.fullName}'s profile`}
                          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#61677A] animate-pulse"></span>
                    </div>
                    <div className="flex-1 ml-3">
                      <h3 className="text-lg font-semibold">{user.fullName}</h3>
                      <p className="text-sm text-[#FFF6E0] opacity-75">{user.email}</p>
                    </div>
                    {unreadCount > 0 && (
                      <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce">
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
        className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={toggleSidebar}
      />
    )}

    {/* Desktop Sidebar with refined styling - removed backdrop blur */}
    <aside className={`
      hidden 
      md:block 
      md:w-1/3 
      lg:w-1/4 
      bg-gradient-to-b from-[#272829] to-[#31333A]
      text-[#FFF6E0] 
      h-full 
      flex 
      flex-col
      relative
      z-10
      shadow-xl
      border-r border-[#61677A]/20
    `}>
      {/* Desktop Sidebar Header - removed backdrop blur */}
      <div className="sticky top-0 z-10 p-6 bg-[#272829]/70 border-b border-[#3a3b3c] shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <MessageCircle className="mr-2" /> 
            <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">Nearby Users</span>
          </h2>
          <button 
            onClick={handleRefreshNearby}
            className="p-2 rounded-full hover:bg-[#3a3b3c] transition-all duration-300 hover:rotate-180"
            title="Refresh nearby users"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Desktop User List with enhanced styling */}
      <div className="flex-1 overflow-y-auto p-4">
        {isFetchingNearbyUsers && (
          <div className="p-4 text-center text-[#FFF6E0] opacity-75">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
            <p>Discovering nearby connections...</p>
          </div>
        )}
        
        {!isFetchingNearbyUsers && arrayOfNearbyUserData.length === 0 && (
          <div className="p-8 text-center text-[#FFF6E0] opacity-75">
            <div className="bg-[#272829]/30 p-6 rounded-xl border border-[#61677A]/30 shadow-lg">
              <p className="mb-4">No nearby users found.</p>
              <button
                onClick={handleRefreshNearby}
                className="px-4 py-2 bg-gradient-to-r from-[#FFF6E0]/20 to-[#D8D9DA]/20 hover:from-[#FFF6E0]/30 hover:to-[#D8D9DA]/30 rounded-lg transition-all duration-300 text-[#FFF6E0] transform hover:scale-105"
              >
                <RefreshCw size={16} className="inline mr-2" /> Try Again
              </button>
            </div>
          </div>
        )}
        
        {arrayOfNearbyUserData.length > 0 && (
          <div className="space-y-3">
            {arrayOfNearbyUserData.map((user, index) => {
              const unreadCount = unreadMessages[user._id] || 0;
              return (
                <div
                  key={user._id}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform ${
                    activeChatUser?._id === user._id 
                      ? 'bg-gradient-to-r from-[#61677A] to-[#505460] shadow-lg scale-102' 
                      : 'bg-[#272829]/40 hover:bg-[#61677A]/60 hover:scale-105'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleStartChat(user)}
                >
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-full w-14 h-14 border-2 border-[#61677A]/50">
                      <img
                        src={user.profileImageURL || 'https://via.placeholder.com/150'}
                        alt={`${user.fullName}'s profile`}
                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#61677A] animate-pulse"></span>
                  </div>
                  <div className="flex-1 ml-3">
                    <h3 className="text-lg font-semibold">{user.fullName}</h3>
                    <p className="text-sm text-[#FFF6E0] opacity-75">{user.email}</p>
                  </div>
                  {unreadCount > 0 && (
                    <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce">
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

    {/* Right Panel - Chat Area with refined styling - removed backdrop blur */}
    <main className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#FFF6E0] to-[#D8D9DA] text-[#272829] relative z-10">
      {activeChatUser ? (
        <>
          {/* Chat Header - removed backdrop blur */}
          <div className="p-4 border-b border-gray-200 bg-[#FFF6E0] shadow-sm sticky top-0 z-10 bg-opacity-80">
            <div className="flex items-center">
              <div className="relative overflow-hidden rounded-full w-10 h-10 border-2 border-[#61677A]/30">
                <img
                  src={activeChatUser.profileImageURL || 'https://via.placeholder.com/150'}
                  alt={`${activeChatUser.fullName}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-bold">{activeChatUser.fullName}</h2>
                <div className="flex items-center text-xs text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  Online
                </div>
              </div>
            </div>
          </div>
          
          {/* Messages Area with gradient background and soft pattern */}
          <div className="flex-1 overflow-y-auto p-4 relative">
            {/* Background pattern for messages area */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, #272829 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            
            {activeChatRoom ? (
              <div className="space-y-4 relative z-10">
                {messages.length > 0 ? (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender === authUser.data.user._id;
                    return (
                      <div 
                        key={idx} 
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <div 
                          className={`max-w-xs md:max-w-md p-4 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg ${
                            isMe 
                              ? 'bg-gradient-to-r from-[#272829] to-[#31333A] text-[#FFF6E0]' 
                              : 'bg-gradient-to-r from-[#61677A] to-[#505460] text-[#FFF6E0]'
                          }`}
                        >
                          <p className="leading-relaxed">{msg.message}</p>
                          <div className="text-xs mt-2 text-right opacity-70 flex justify-end items-center">
                            <span>{formatTime(msg.timestamp)}</span>
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
                    <div className="text-center p-8 bg-[#272829]/5 rounded-xl border border-[#61677A]/10 shadow-md transform transition-all duration-700 hover:scale-105">
                      <MessageCircle size={40} className="mx-auto mb-2 opacity-50" />
                      <p className="text-lg font-medium mb-2">Start a conversation</p>
                      <p className="text-sm opacity-75">Send a message to connect with {activeChatUser.fullName}</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[#61677A]">
                <div className="text-center">
                  <RefreshCw size={30} className="mx-auto mb-2 animate-spin" />
                  <p>Establishing secure connection...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Message Input with modern styling and animation - removed backdrop blur */}
          <div className="p-4 border-t border-gray-200 bg-[#FFF6E0] sticky bottom-0 left-0 right-0 bg-opacity-80 shadow-md">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-[#272829] text-[#FFF6E0] border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#61677A] transition-all duration-300 shadow-inner placeholder-[#FFF6E0]/50 transform focus:scale-102"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="group relative overflow-hidden bg-gradient-to-r from-[#272829] to-[#31333A] text-[#FFF6E0] px-5 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                disabled={!activeChatRoom || !chatMessage.trim()}
              >
                <Send size={18} className="mr-2 group-hover:translate-x-1 transition-transform duration-300" /> 
                <span>Send</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-[#272829] p-8 relative">
          {/* Background animation for empty state - removed blur */}
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#61677A] opacity-20 animate-pulse" style={{animationDuration: '15s'}}></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-[#61677A] opacity-30 animate-pulse" style={{animationDuration: '10s'}}></div>
          
          <div className="text-center max-w-md relative z-10 bg-[#FFF6E0]/50 p-8 rounded-2xl shadow-xl border border-[#61677A]/10 transform transition-all duration-700 hover:scale-105">
            <div className="w-24 h-24 bg-gradient-to-r from-[#272829] to-[#31333A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle size={50} className="text-[#FFF6E0] animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to Connect</h2>
            <p className="mb-6 text-[#61677A] leading-relaxed">Select a nearby user to start a conversation and discover new connections in your area</p>
            <div className="flex justify-center">
              <button 
                onClick={handleRefreshNearby}
                className="group bg-gradient-to-r from-[#272829] to-[#31333A] text-[#FFF6E0] px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105"
              >
                <RefreshCw size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-500" /> 
                <span>Find Nearby Users</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Subtle wave divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 pointer-events-none hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-16">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,96,0,64V56.44Z" fill="#31333A" fillOpacity="0.05"></path>
        </svg>
      </div>
    </main>

    {/* Location Permission Denial Modal - removed backdrop blur */}
    {locationPermissionDenied && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 animate-fadeIn">
        <div className="p-8 bg-gradient-to-b from-[#FFF6E0] to-[#D8D9DA] rounded-xl shadow-2xl max-w-md m-4 border border-[#61677A]/20 transform transition-all duration-500 animate-scaleIn">
          <h3 className="text-2xl font-bold mb-4 text-[#272829]">Location Access Required</h3>
          <p className="mb-6 text-[#61677A] leading-relaxed">
            RadialWhisper needs location access to find nearby users. Please enable location services in your browser settings to continue.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setLocationPermissionDenied(false);
                fetchLocation();
              }}
              className="flex-1 bg-gradient-to-r from-[#272829] to-[#31333A] text-[#FFF6E0] px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105"
            >
              <RefreshCw size={16} className="mr-2" /> Try Again
            </button>
            <button
              onClick={() => setLocationPermissionDenied(false)}
              className="flex-1 border border-[#272829]/50 text-[#272829] px-4 py-3 rounded-xl hover:bg-[#272829]/5 transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Add this to your CSS or style definition */}
    <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out forwards;
      }
      .animate-scaleIn {
        animation: scaleIn 0.4s ease-out forwards;
      }
      .scale-102 {
        transform: scale(1.02);
      }
    `}</style>
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