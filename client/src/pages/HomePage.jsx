import React, { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import {
  MessageCircle,
  Send,
  RefreshCw,
  CheckCheck,
  Check,
} from "lucide-react";
import { useUserActivity } from "../hooks/useUserActivity";
import EmojiPicker from "../components/EmojiPicker";
import UserInfoPopup from "../components/UserInfoPopup";

const HomePage = () => {
  useUserActivity();
  const {
    authUser,
    fetchNearbyUsers,
    nearbyUsersData,
    isFetchingNearbyUsers,
    connectSocket,
    socket,
    sendMessage,
    unreadMessagesBySender,
    messagesByRoom,
    markMessagesAsReadForSender,

  } = useAuthStore();

  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});

  const messagesEndRef = useRef(null);
  const isInitialFetchDone = useRef(false);
  const activeChatUserRef = useRef(activeChatUser);
  const [onlineUsers, setOnlineUsers] = useState({});
  const currentMessages = messagesByRoom[activeChatRoom] || {};

  // Add this new state for tracking expanded messages
  const [expandedMessages, setExpandedMessages] = useState({});

  // Add state for selected message and context menu
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  
  // Add refs for tracking clicks
  const contextMenuRef = useRef(null);

  // Add these state variables if they don't exist yet
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUserInfoPopup, setShowUserInfoPopup] = useState(false);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) return "";

    // Format: HH:MM AM/PM
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  window.scrollTo(0, 0);
  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (userId) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: true }));
    };

    const handleUserOffline = (userId) => {
      setOnlineUsers((prev) => {
        const updatedUsers = { ...prev };
        delete updatedUsers[userId];
        return updatedUsers;
      });
    };

    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [socket]);

  // Update ref whenever activeChatUser changes
  useEffect(() => {
    activeChatUserRef.current = activeChatUser;
  }, [activeChatUser]);

  const arrayOfNearbyUserData = Array.isArray(
    nearbyUsersData?.data?.nearbyUsers
  )
    ? nearbyUsersData?.data?.nearbyUsers
    : [];

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);
  // Connect socket when user is authenticated
  useEffect(() => {
    if (authUser) {
      connectSocket();
      const timer = setTimeout(() => {
        const currentSocket = useAuthStore.getState().socket;
        if (currentSocket && authUser?.data?.user?._id) {
          currentSocket.emit("registerUser", {
            userId: authUser.data.user._id,
          });
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
          console.error("Geolocation error:", error);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermissionDenied(true);
            toast.error(
              "Location permission denied. Please allow location access."
            );
          } else {
            toast.error("Failed to fetch location. Please try again.");
          }
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  // Fetch nearby users periodically based on location
  const refreshTime = 100000; // 100 seconds
  useEffect(() => {
    if (
      location.latitude &&
      location.longitude &&
      !isInitialFetchDone.current
    ) {
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
      // setActiveChatRoom(data.roomId);
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
          activeChatRoom: data.roomId,
        });
        console.log(
          "Received chat history for room",
          data.roomId,
          data.history
        );
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
      const currentState = useAuthStore.getState();
      const currentUserId = currentState.authUser?.data?.user?._id;
      const storeActiveChatRoom = currentState.activeChatRoom;
  
      // Log for debugging
      console.log("Received newMessage:", {
        messageRoom: data.room,
        activeChatRoom: storeActiveChatRoom,
        localActiveChatRoom: activeChatRoom,
        messageSender: data.sender,
        activeChatUserId: activeChatUser?._id,
        currentUserId,
      });
  
      // Check 1: Ignore messages from self to avoid duplication
      if (data.sender === currentUserId) {
        console.log("Message from self, skipping UI update");
        return;
      }
  
      // Check 2: Ensure message room matches the locally active chat room
      if (data.room !== activeChatRoom) {
        console.log("Message not for current local active chat room, updating unread only");
        setUnreadMessages((prev) => {
          const newCount = (prev[data.sender] || 0) + 1;
          const newUnread = { ...prev, [data.sender]: newCount };
          localStorage.setItem("unreadMessages", JSON.stringify(newUnread));
          return newUnread;
        });
        return;
      }
  
      // Check 3: Verify sender matches the active chat user
      if (data.sender !== activeChatUser?._id) {
        console.log("Sender does not match active chat user, skipping");
        return;
      }
  
      // Check 4: Ensure store's activeChatRoom matches local activeChatRoom
      if (storeActiveChatRoom !== activeChatRoom) {
        console.log("Store activeChatRoom mismatch, skipping UI update");
        return;
      }
  
      // Check 5: Prevent duplicate messages in the UI
      const isDuplicate = currentMessages.some((msg) => msg._id === data._id);
      if (isDuplicate) {
        console.log("Duplicate message detected in UI, skipping");
        return;
      }
  
      console.log("Message valid for active chat, relying on store update");
      // No need to update state here; the store's "newMessage" handler already adds to messagesByRoom
    };
  
    socket.on("newMessage", messageReceivedHandler);
    return () => socket.off("newMessage", messageReceivedHandler);
  }, [socket, activeChatUser, activeChatRoom, currentMessages]);

  // Update the useEffect for socket registration to include the user ID in the state
  useEffect(() => {
    if (authUser) {
      connectSocket();
      const timer = setTimeout(() => {
        const currentSocket = useAuthStore.getState().socket;
        if (currentSocket && authUser?.data?.user?._id) {
          currentSocket.emit("registerUser", {
            userId: authUser.data.user._id,
          });
          console.log("User registered via socket:", authUser.data.user._id);

          // Store the user ID in the state for easy access
          useAuthStore.setState({
            currentUserId: authUser.data.user._id,
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
    if (currentSocket) {
      currentSocket.emit("leaveAllRooms", () => {
        console.log("Left all previous chat rooms");
        const newRoomId = [authUser.data.user._id, user._id].sort().join("_");
        setActiveChatUser(user);
        useAuthStore.getState().setActiveChatRoom(newRoomId);
        setActiveChatRoom(newRoomId);
        markMessagesAsReadForSender(user._id);
        setUnreadMessages((prev) => {
          const newUnread = { ...prev, [user._id]: 0 };
          localStorage.setItem("unreadMessages", JSON.stringify(newUnread));
          return newUnread;
        });
        currentSocket.emit("joinChat", { targetUserId: user._id });
      });
    } else {
      toast.error("Socket not connected");
    }
  };
  // Add this useEffect to update the document title with unread count
  useEffect(() => {
    const totalUnread = Object.values(unreadMessagesBySender).reduce(
      (sum, count) => sum + count,
      0
    );
    if (totalUnread > 0) {
      document.title = `(${totalUnread}) ChatApp`;
    } else {
      document.title = "ChatApp";
    }
  }, [unreadMessagesBySender]);

  // Send a message to the active chat
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    if (socket && activeChatRoom) {
      const expectedRoomId = [authUser.data.user._id, activeChatUser._id].sort().join("_");
      if (activeChatRoom !== expectedRoomId) {
        console.error("Room mismatch! Expected:", expectedRoomId, "Got:", activeChatRoom);
        toast.error("Chat room not ready. Please try again.");
        return;
      }

      sendMessage(chatMessage, activeChatRoom);
      setChatMessage("");
    } else {
      toast.error("No active chat room. Please start a chat first.");
    }
  };

  // Add updateUnreadCount listener
useEffect(() => {
  if (!socket) return;

  const updateUnreadCountHandler = ({ sender, count }) => {
    console.log("Received unread count update:", sender, count);
    setUnreadMessages((prev) => {
      const newUnread = { ...prev, [sender]: count };
      try {
        localStorage.setItem("unreadMessages", JSON.stringify(newUnread));
      } catch (error) {
        console.error("Error updating localStorage:", error);
      }
      return newUnread;
    });
  };

  socket.on("updateUnreadCount", updateUnreadCountHandler);

  return () => {
    socket.off("updateUnreadCount", updateUnreadCountHandler);
  };
}, [socket]);

  // Refresh the list of nearby users
  const handleRefreshNearby = () => {
    if (location.latitude && location.longitude) {
      fetchNearbyUsers(location);
      toast.success("Refreshed nearby users");
    } else {
      fetchLocation();
    }
  };

  // Handle Enter key press in chat input
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
      console.log("Messages marked as read:", data);
      useAuthStore.setState((state) => {
        const roomMessages = state.messagesByRoom[data.roomId] || [];
        const updatedMessages = roomMessages.map((msg) =>
          data.messageIds.includes(msg._id) ? { ...msg, status: "read" } : msg
        );
        return {
          messagesByRoom: {
            ...state.messagesByRoom,
            [data.roomId]: updatedMessages,
          },
        };
      });
    };
  
    socket.on("messagesRead", messagesReadHandler);
    return () => socket.off("messagesRead", messagesReadHandler);
  }, [socket]);

  // Add this to your HomePage.jsx component
  useEffect(() => {
    if (!socket) return;
  
    const messageDeliveredHandler = (data) => {
      console.log("Message delivered:", data);
      useAuthStore.setState((state) => {
        const roomMessages = state.messagesByRoom[data.room] || [];
        const updatedMessages = roomMessages.map((msg) =>
          msg._id === data.messageId ? { ...msg, status: "delivered" } : msg
        );
        return {
          messagesByRoom: {
            ...state.messagesByRoom,
            [data.room]: updatedMessages,
          },
        };
      });
    };
  
    socket.on("messageDelivered", messageDeliveredHandler);
    return () => socket.off("messageDelivered", messageDeliveredHandler);
  }, [socket]);

  // Add this function to mark messages as read when viewing a chat
  const markMessagesAsRead = () => {
    if (socket && activeChatRoom && activeChatUser) {
      socket.emit("markMessagesAsRead", { roomId: activeChatRoom });
      console.log("Marking messages as read in room:", activeChatRoom);
    }
  };
// Adjust markMessagesAsRead trigger
useEffect(() => {
  if (activeChatRoom && activeChatUser && currentMessages.length > 0) {
    const hasUnread = currentMessages.some(
      (msg) => msg.sender === activeChatUser._id && msg.status !== "read"
    );
    if (hasUnread) {
      markMessagesAsRead();
    }
  }
}, [activeChatRoom, activeChatUser, currentMessages]);

  // Add this function to toggle message expansion
  const toggleMessageExpansion = (messageId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };
  
  // Add this function to truncate long messages
  const truncateMessage = (message, maxLength = 150) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  // Function to handle message click and show context menu
  const handleMessageClick = (e, message) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Position the menu near the click but ensure it doesn't go off-screen
    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - 150);
    
    setContextMenuPosition({ x, y });
    setSelectedMessage(message);
    setShowContextMenu(true);
  };
  
  // Function to copy message text
  const copyMessageText = () => {
    if (!selectedMessage) return;
    
    navigator.clipboard.writeText(selectedMessage.message)
      .then(() => {
        toast.success("Message copied to clipboard");
        setShowContextMenu(false);
      })
      .catch(() => {
        toast.error("Failed to copy message");
      });
  };
  
  // Function to show message info
  const showMessageInfo = () => {
    if (!selectedMessage) return;
    
    // Build info message based on message status
    let statusText = "Sent";
    if (selectedMessage.status === "delivered") statusText = "Delivered";
    if (selectedMessage.status === "read") statusText = "Read";
    
    const sender = selectedMessage.sender === authUser.data.user._id 
      ? "You" 
      : activeChatUser?.fullName || "User";
    
    const dateTime = new Date(selectedMessage.timestamp);
    const formattedDateTime = dateTime.toLocaleString();
    
    // Show toast with message info
    toast(
      <div className="space-y-2">
        <p><strong>Sender:</strong> {sender}</p>
        <p><strong>Time:</strong> {formattedDateTime}</p>
        <p><strong>Status:</strong> {statusText}</p>
      </div>,
      {
        duration: 5000,
        style: {
          background: "#272829",
          color: "#FFF6E0",
          maxWidth: "none",
        },
      }
    );
    
    setShowContextMenu(false);
  };
  
  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add this function to group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      const dateString = date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      
      groups[dateString].push(message);
    });
    
    return groups;
  };

  // Update this function to handle emoji selection properly
  const handleEmojiSelect = (emoji) => {
    if (emoji) {
      setChatMessage(prevMessage => prevMessage + emoji.native);
    } else {
      // Close the picker if emoji is null (click outside)
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden relative" onClick={() => setShowContextMenu(false)}>
      {/* Dynamic background elements - removed blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#272829] opacity-90"></div>

        <div className="absolute inset-0 bg-[url('/src/assets/images/abstract-pattern.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#272829] via-[#31333A] to-transparent opacity-90"></div>
      </div>

      {/* Minimal floating orbs for visual interest - removed blur */}
      <div
        className="absolute top-40 right-20 w-64 h-64 rounded-full bg-[#61677A] opacity-20 animate-pulse hidden md:block"
        style={{ animationDuration: "10s" }}
      ></div>
      <div
        className="absolute bottom-20 left-40 w-72 h-72 rounded-full bg-[#61677A] opacity-20 animate-pulse hidden md:block"
        style={{ animationDuration: "15s" }}
      ></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5 hidden md:block">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #FFF6E0 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      {/* Mobile Burger Menu */}
      {!sidebarOpen && !showUserInfoPopup && (
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
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
      `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button with hover effect */}
        <button
          className="absolute top-4 right-4 bg-[#272829]/50 p-2 rounded-full text-[#FFF6E0] hover:bg-[#61677A] hover:rotate-90 transition-all duration-300"
          onClick={toggleSidebar}
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
                <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
                  Nearby Users
                </span>
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
                  const isOnline = onlineUsers[user._id] || false; // Use this for online status
                  return (
                    <div
                      key={user._id}
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform ${
                        activeChatUser?._id === user._id
                          ? "bg-gradient-to-r from-[#61677A] to-[#505460] shadow-lg scale-102"
                          : "bg-[#272829]/40 hover:bg-[#61677A]/60 hover:scale-105"
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => handleStartChat(user)}
                    >
                      <div className="relative">
                        <div className="relative overflow-hidden rounded-full w-14 h-14 border-2 border-[#61677A]/50">
                          <img
                            src={
                              user.profileImageURL ||
                              "https://via.placeholder.com/150"
                            }
                            alt={`${user.fullName}'s profile`}
                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                          />
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 ${
                            isOnline ? "bg-green-500" : "bg-red-500"
                          } rounded-full border-2 border-[#61677A] animate-pulse`}
                        ></span>
                      </div>
                      <div className="flex-1 ml-3">
                        <h3 className="text-lg font-semibold">
                          {user.fullName}
                        </h3>
                        <p className="text-sm text-[#FFF6E0] opacity-75">
                          {user.email}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce">
                          {unreadCount > 9 ? "9+" : unreadCount}
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
      <aside
        className={`
      hidden 
      md:block 
      md:w-1/3 
      lg:w-1/4 
      bg-gradient-to-b from-[#272829] to-[#31333A]
      text-[#FFF6E0] 
      h-full 
      flex-col
      relative
      z-10
      shadow-xl
      border-r border-[#61677A]/20
    `}
      >
        {/* Desktop Sidebar Header - removed backdrop blur */}
        <div className="sticky top-0 z-10 p-6 bg-[#272829]/70 border-b border-[#3a3b3c] shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <MessageCircle className="mr-2" />
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-transparent bg-clip-text">
                Nearby Users
              </span>
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
                        ? "bg-gradient-to-r from-[#61677A] to-[#505460] shadow-lg scale-102"
                        : "bg-[#272829]/40 hover:bg-[#61677A]/60 hover:scale-105"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => handleStartChat(user)}
                  >
                    <div className="relative">
                      <div className="relative overflow-hidden rounded-full w-14 h-14 border-2 border-[#61677A]/50">
                        <img
                          src={
                            user.profileImageURL ||
                            "https://via.placeholder.com/150"
                          }
                          alt={`${user.fullName}'s profile`}
                          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                        />
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 ${
                          user.activeStatus.isActive
                            ? "bg-green-500"
                            : "bg-red-500"
                        } rounded-full border-2 border-[#61677A] animate-pulse`}
                      ></span>
                    </div>
                    <div className="flex-1 ml-3">
                      <h3 className="text-lg font-semibold">{user.fullName}</h3>
                      <p className="text-sm text-[#FFF6E0] opacity-75">
                        {user.email}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <div className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce">
                        {unreadCount > 9 ? "9+" : unreadCount}
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
                <div className="relative overflow-hidden rounded-full w-10 h-10 border-2 border-[#61677A]/30 cursor-pointer" onClick={() => setShowUserInfoPopup(true)}>
                  <img
                    src={
                      activeChatUser.profileImageURL ||
                      "https://via.placeholder.com/150"
                    }
                    alt={`${activeChatUser.fullName}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-bold">
                    {activeChatUser.fullName}
                  </h2>
                  <div
                    className={`flex items-center text-xs ${
                      onlineUsers[activeChatUser._id]
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 ${
                        onlineUsers[activeChatUser._id]
                          ? "bg-green-500"
                          : "bg-red-500"
                      } rounded-full mr-1 animate-pulse`}
                    ></span>
                    {onlineUsers[activeChatUser._id] ? "online" : "offline"}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area with gradient background and soft pattern */}
            <div className="flex-1 overflow-y-auto p-4 relative bg-[url('/src/assets/images/chat-bg-pattern.png')] bg-repeat bg-[#E9E9E9]/20">
              {activeChatRoom ? (
                <div className="space-y-4 relative z-10">
                  {currentMessages.length > 0 ? (
                    Object.entries(groupMessagesByDate(currentMessages)).map(([dateString, messages]) => (
                      <div key={dateString} className="mb-6">
                        {/* Date Header */}
                        <div className="flex justify-center mb-4">
                          <div className="bg-[#D8D9DA] text-[#272829] text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                            {dateString}
                          </div>
                        </div>
                        
                        {/* Messages for this date */}
                        <div className="space-y-1">
                          {messages.map((msg, idx) => {
                            const isMe = msg.sender === authUser.data.user._id;
                            const isExpanded = expandedMessages[msg._id] || false;
                            const isLongMessage = msg.message.length > 150;
                            const prevMsg = idx > 0 ? messages[idx - 1] : null;
                            const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;
                            
                            // Check if messages are from the same sender
                            const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender;
                            const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender;
                            
                            return (
                              <div key={msg._id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                {/* Show avatar only for first message in group from others */}
                                {!isMe && isFirstInGroup && (
                                  <div className="self-end mb-2 mr-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#61677A]/30">
                                      <img
                                        src={activeChatUser.profileImageURL || "https://via.placeholder.com/150"}
                                        alt={`${activeChatUser.fullName}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                )}
                                
                                <div className={`group relative max-w-[75%] ${!isFirstInGroup && !isMe ? 'ml-10' : ''}`}>
                                  <div
                                    className={`
                                      p-3 
                                      shadow-sm 
                                      hover:shadow-md 
                                      transition-shadow 
                                      cursor-pointer
                                      ${isMe 
                                        ? "bg-[#272829] text-[#FFF6E0]" 
                                        : "bg-[#61677A] text-[#FFF6E0]"}
                                      ${isFirstInGroup && isMe ? 'rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-sm' : ''}
                                      ${isFirstInGroup && !isMe ? 'rounded-tr-xl rounded-tl-sm rounded-bl-xl rounded-br-xl' : ''}
                                      ${isLastInGroup && isMe ? 'rounded-tl-xl rounded-tr-sm rounded-bl-xl rounded-br-xl' : ''}
                                      ${isLastInGroup && !isMe ? 'rounded-tr-xl rounded-tl-xl rounded-bl-sm rounded-br-xl' : ''}
                                      ${!isFirstInGroup && !isLastInGroup && isMe ? 'rounded-tl-xl rounded-tr-sm rounded-bl-xl rounded-br-sm' : ''}
                                      ${!isFirstInGroup && !isLastInGroup && !isMe ? 'rounded-tr-xl rounded-tl-sm rounded-bl-sm rounded-br-xl' : ''}
                                      ${isFirstInGroup && isLastInGroup && isMe ? 'rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl' : ''}
                                      ${isFirstInGroup && isLastInGroup && !isMe ? 'rounded-tr-xl rounded-tl-xl rounded-bl-xl rounded-br-xl' : ''}
                                    `}
                                    onClick={(e) => handleMessageClick(e, msg)}
                                  >
                                    <p className="leading-relaxed text-sm md:text-base">
                                      {isLongMessage && !isExpanded 
                                        ? truncateMessage(msg.message) 
                                        : msg.message}
                                    </p>
                                    
                                    {isLongMessage && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleMessageExpansion(msg._id);
                                        }}
                                        className="text-xs mt-1 text-[#FFF6E0]/70 hover:text-[#FFF6E0] transition-colors duration-300 underline focus:outline-none"
                                      >
                                        {isExpanded ? "Read less" : "Read more"}
                                      </button>
                                    )}
                                    
                                    <div className="text-[10px] mt-1 text-right flex justify-end items-center opacity-70">
                                      <span>{formatTime(msg.timestamp)}</span>
                                      {isMe && (
                                        <span className="ml-1">
                                          {msg.status === "sent" && <Check size={12} />}
                                          {msg.status === "delivered" && <CheckCheck size={12} />}
                                          {msg.status === "read" && (
                                            <span className="text-blue-400">
                                              <CheckCheck size={12} />
                                            </span>
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full py-20 text-[#61677A]">
                      <div className="text-center p-6 bg-[#FFF6E0]/30 rounded-2xl">
                        <MessageCircle size={40} className="mx-auto mb-4 text-[#61677A]/50" />
                        <p>Start a conversation with {activeChatUser.fullName}</p>
                        <p className="text-xs mt-2 text-[#61677A]/70">Messages are end-to-end encrypted</p>
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

            {/* Message Input with modern styling and animation - simplified version */}
            <div className="p-3 border-t border-gray-200 bg-[#FFF6E0] sticky bottom-0 left-0 right-0 bg-opacity-90 shadow-md z-40">
              <div className="flex gap-2 items-end">
                {/* Emoji button with position relative for proper positioning */}
                <div className="relative z-[9000]">
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 rounded-full hover:bg-[#D8D9DA] transition-colors text-[#272829]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </button>
                  
                  <EmojiPicker
                    visible={showEmojiPicker}
                    onEmojiSelect={(emoji) => {
                      if (emoji) {
                        setChatMessage(prevMessage => prevMessage + emoji.native);
                      } else {
                        setShowEmojiPicker(false);
                      }
                    }}
                    position="top"
                  />
                </div>
                
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-[#272829] text-[#FFF6E0] border-none rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#61677A] transition-all duration-300 shadow-inner placeholder-[#FFF6E0]/50 min-h-[44px]"
                  placeholder="Type a message..."
                />
                
                <button
                  onClick={handleSendMessage}
                  className="p-3 rounded-full bg-[#272829] text-[#FFF6E0] hover:bg-[#31333A] transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!activeChatRoom || !chatMessage.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>

            {showUserInfoPopup && (
      <UserInfoPopup
          className="z-100"
        user={activeChatUser}
        isOnline={onlineUsers[activeChatUser._id] || false}
        onClose={() => setShowUserInfoPopup(false)}
      />
    )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#272829] p-8 relative">
            {/* Background animation for empty state - removed blur */}
            <div
              className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#61677A] opacity-20 animate-pulse"
              style={{ animationDuration: "15s" }}
            ></div>
            <div
              className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-[#61677A] opacity-30 animate-pulse"
              style={{ animationDuration: "10s" }}
            ></div>

            <div className="text-center max-w-md relative z-10 bg-[#FFF6E0]/50 p-8 rounded-2xl shadow-xl border border-[#61677A]/10 transform transition-all duration-700 hover:scale-105">
              <div className="w-24 h-24 bg-gradient-to-r from-[#272829] to-[#31333A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageCircle
                  size={50}
                  className="text-[#FFF6E0] animate-pulse"
                />
              </div>
              <h2 className="text-3xl font-bold mb-4">Ready to Connect</h2>
              <p className="mb-6 text-[#61677A] leading-relaxed">
                Select a nearby user to start a conversation and discover new
                connections in your area
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleRefreshNearby}
                  className="group bg-gradient-to-r from-[#272829] to-[#31333A] text-[#FFF6E0] px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105"
                >
                  <RefreshCw
                    size={18}
                    className="mr-2 group-hover:rotate-90 transition-transform duration-500"
                  />
                  <span>Find Nearby Users</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subtle wave divider at bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 pointer-events-none hidden md:block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-12 md:h-16"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,96,0,64V56.44Z"
              fill="#31333A"
              fillOpacity="0.05"
            ></path>
          </svg>
        </div>
      </main>

      {/* Location Permission Denial Modal - removed backdrop blur */}
      {locationPermissionDenied && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 animate-fadeIn">
          <div className="p-8 bg-gradient-to-b from-[#FFF6E0] to-[#D8D9DA] rounded-xl shadow-2xl max-w-md m-4 border border-[#61677A]/20 transform transition-all duration-500 animate-scaleIn">
            <h3 className="text-2xl font-bold mb-4 text-[#272829]">
              Location Access Required
            </h3>
            <p className="mb-6 text-[#61677A] leading-relaxed">
              RadialWhisper needs location access to find nearby users. Please
              enable location services in your browser settings to continue.
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

      {/* Message Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-[#272829] text-[#FFF6E0] rounded-lg shadow-lg py-2 z-50 animate-scaleIn w-48"
          style={{
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`,
          }}
        >
          <button
            className="w-full text-left px-4 py-2 hover:bg-[#31333A] transition-colors duration-200 flex items-center"
            onClick={copyMessageText}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-[#31333A] transition-colors duration-200 flex items-center"
            onClick={showMessageInfo}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Info
          </button>
        </div>
      )}

      {/* Add this to your CSS or style definition */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
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
