import React, { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import {
  MessageCircle,
  Send,
  RefreshCw,
  CheckCheck,
  Check,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Info,
  X,
  Reply,
  Copy,
  Calendar,
  Trash2,
} from "lucide-react";
import { useUserActivity } from "../hooks/useUserActivity";
import EmojiPicker from "../components/EmojiPicker";
import UserInfoPopup from "../components/UserInfoPopup";
import { 
  FaUserFriends, 
  FaSearch, 
  FaTimes, 
  FaChevronDown,
  FaSmile,
  FaHeart,
  FaUser,
  FaUserPlus,
  FaUserCheck,
  FaUserMinus,
  FaChevronUp,
  FaPaperPlane,
  FaEllipsisV,
  FaRegCopy,
  FaInfoCircle,
  FaClock,
  FaReply,
  FaCopy
} from 'react-icons/fa';
import { 
  MdRefresh, 
  MdExpandMore, 
  MdExpandLess,
  MdPersonAddAlt1,
  MdPersonRemove,
  MdClose,
  MdMenu,
  MdMessage
} from 'react-icons/md';
import { RiUserReceivedLine } from 'react-icons/ri';
import { GiBowTie } from 'react-icons/gi';
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5';
import FriendRequestPolicyPopup from "../components/FriendRequestPolicyPopup";

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
    fetchFriends,
    fetchFriendRequests,
    friends,
    sendFriendRequest,
    friendRequests,
    fetchSentFriendRequests,
    sentFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
  } = useAuthStore();

  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [waitingForChatConfirmation, setWaitingForChatConfirmation] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [showFriendRequestPopup, setShowFriendRequestPopup] = useState(false);
  const [interestFilter, setInterestFilter] = useState("");
  const [showInterestFilters, setShowInterestFilters] = useState(false);
  const messagesEndRef = useRef(null);
  const isInitialFetchDone = useRef(false);
  const activeChatUserRef = useRef(activeChatUser);
  const [onlineUsers, setOnlineUsers] = useState({});
  const currentMessages = messagesByRoom[activeChatRoom] || {};
  const [openMenuFriendId, setOpenMenuFriendId] = useState(null); // Tracks which friend's menu is open
  const [friendToRemove, setFriendToRemove] = useState(null); // Tracks the friend to be removed
  // Add this new state for tracking expanded messages
  const [expandedMessages, setExpandedMessages] = useState({});

  // Add state for selected message and context menu
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showContextMenu, setShowContextMenu] = useState(false);

  // Add refs for tracking clicks
  const contextMenuRef = useRef(null);

  // Add refs for friend list items
  const mobileFriendRefs = useRef({});
  const desktopFriendRefs = useRef({});

  // Add these state variables if they don't exist yet
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUserInfoPopup, setShowUserInfoPopup] = useState(false);
  const [viewMode, setViewMode] = useState("nearby");

  // Add this state to manage friend search
  const [friendSearchTerm, setFriendSearchTerm] = useState("");

  // Add this function to filter friends based on search term
  const filteredFriends = friendSearchTerm.trim() === "" 
    ? friends 
    : friends.filter(friend => 
        friend.friendId.fullName.toLowerCase().includes(friendSearchTerm.toLowerCase()) ||
        friend.friendId.email.toLowerCase().includes(friendSearchTerm.toLowerCase())
      );

  // Add this state to manage the friend requests dropdown
  const [isFriendRequestsExpanded, setIsFriendRequestsExpanded] = useState(false);

  // First, let the arrayOfNearbyUserData be defined 
  const arrayOfNearbyUserData = Array.isArray(
    nearbyUsersData?.data?.nearbyUsers
  )
    ? nearbyUsersData?.data?.nearbyUsers
    : [];

  // THEN define functions that use it
  const getAllUniqueInterests = () => {
    const interestsSet = new Set();
    
    arrayOfNearbyUserData.forEach(user => {
      if (user.bio && Array.isArray(user.bio)) {
        user.bio.forEach(interest => {
          interestsSet.add(interest);
        });
      }
    });
    
    return Array.from(interestsSet).sort();
  };

  // Add this function to filter nearby users by interest
  const filteredNearbyUsers = interestFilter 
    ? arrayOfNearbyUserData.filter(user => 
        user.bio && Array.isArray(user.bio) && 
        user.bio.some(interest => interest.toLowerCase().includes(interestFilter.toLowerCase()))
      )
    : arrayOfNearbyUserData;

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
    // Check if user is fully logged in and not in pending state
    const { showSingleDevicePrompt } = useAuthStore.getState();
    
    // Skip if user is in pending login state (waiting for device confirmation)
    if (showSingleDevicePrompt) {
      console.log("Skipping socket connection - user in pending login state");
      return;
    }
    
    if (authUser) {
      console.log("Connecting socket for fully authenticated user");
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

  // Fetch location when authenticated
  useEffect(() => {
    // Skip if user is in pending login state
    const { showSingleDevicePrompt } = useAuthStore.getState();
    if (showSingleDevicePrompt) {
      console.log("Skipping location fetch - user in pending login state");
      return;
    }
    
    if (authUser && !locationPermissionDenied) {
      console.log("Fetching location for fully authenticated user");
      fetchLocation();
    }
  }, [authUser, locationPermissionDenied]);

  // Fetch nearby users periodically based on location
  useEffect(() => {
    // Skip if user is in pending login state
    const { showSingleDevicePrompt } = useAuthStore.getState();
    if (showSingleDevicePrompt) {
      console.log("Skipping nearby users fetch - user in pending login state");
      return () => {}; // Return empty cleanup function
    }
    
    if (
      location.latitude &&
      location.longitude &&
      !isInitialFetchDone.current
    ) {
      console.log("Fetching nearby users for fully authenticated user");
      fetchNearbyUsers(location);
      isInitialFetchDone.current = true;
    }
    
    const fetchInterval = setInterval(() => {
      // Check if user is still fully logged in before fetching
      const { showSingleDevicePrompt } = useAuthStore.getState();
      if (showSingleDevicePrompt) {
        console.log("Skipping interval fetch - user in pending login state");
        return;
      }
      
      if (location.latitude && location.longitude) {
        fetchNearbyUsers(location);
      }
    }, refreshTime);
    
    return () => clearInterval(fetchInterval);
  }, [location, fetchNearbyUsers]);

  useEffect(() => {
    // Skip if user is in pending login state
    const { showSingleDevicePrompt } = useAuthStore.getState(); 
    if (showSingleDevicePrompt || !authUser) {
      console.log("Skipping friends fetch - user in pending login state");
      return;
    }
    
    console.log("Fetching friends for fully authenticated user");
    fetchFriends();
    fetchFriendRequests();
    fetchSentFriendRequests(); // Add this line to fetch sent friend requests
  }, [authUser, fetchFriends, fetchFriendRequests, fetchSentFriendRequests]);

  // Add this useEffect to load unread messages from localStorage on mount
  useEffect(() => {
    try {
      const savedUnreadMessages = localStorage.getItem("unreadMessages");
      if (savedUnreadMessages) {
        const parsedUnreadMessages = JSON.parse(savedUnreadMessages);
        setUnreadMessages(parsedUnreadMessages);
      }
    } catch (error) {
      console.error("Error loading unread messages from localStorage:", error);
    }
  }, []);

  const isFriend = friends.some((friend) => friend.friendId._id === activeChatUser?._id);

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

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Listen for chat started event
  useEffect(() => {
    if (!socket) return;

    const chatStartedHandler = (data) => {
      // setActiveChatRoom(data.roomId);
      console.log("Chat started in room:", data.roomId);
      setWaitingForChatConfirmation(false);
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
        console.log(
          "Message not for current local active chat room, updating unread only"
        );
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

  useEffect(() => {
    if (friendToRemove) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup on unmount or when popup closes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [friendToRemove]);

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
      setWaitingForChatConfirmation(true);
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

    if (waitingForChatConfirmation) {
      toast.error("Please wait for the chat to connect...");
      return;
    }

    if (socket && activeChatRoom) {
      const expectedRoomId = [authUser.data.user._id, activeChatUser._id]
        .sort()
        .join("_");
      if (activeChatRoom !== expectedRoomId) {
        console.error(
          "Room mismatch! Expected:",
          expectedRoomId,
          "Got:",
          activeChatRoom
        );
        toast.error("Chat room not ready. Please try again.");
        return;
      }

      // Send message with replyTo if replying
      sendMessage(chatMessage, activeChatRoom, replyingTo?._id || null);
      setChatMessage("");
      setReplyingTo(null); // Clear the replyingTo state after sending
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
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
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

    navigator.clipboard
      .writeText(selectedMessage.message)
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

    const sender =
      selectedMessage.sender === authUser.data.user._id
        ? "You"
        : activeChatUser?.fullName || "User";

    const dateTime = new Date(selectedMessage.timestamp);
    const formattedDateTime = dateTime.toLocaleString();

    // Show toast with message info
    toast(
      <div className="space-y-2">
        <p>
          <strong>Sender:</strong> {sender}
        </p>
        <p>
          <strong>Time:</strong> {formattedDateTime}
        </p>
        <p>
          <strong>Status:</strong> {statusText}
        </p>
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
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
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

    messages.forEach((message) => {
      const date = new Date(message.timestamp);
      const dateString = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
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
      setChatMessage(
        (prevMessage) => prevMessage + emoji.native
      );
    } else {
      // Close the picker if emoji is null (click outside)
      setShowEmojiPicker(false);
    }
  };

  // Add this helper function to check if a user is a friend
  const isUserFriend = (userId) => {
    return friends.some(friend => friend.friendId._id === userId);
  };

  // Add state for the retention policy popup
  const [showRetentionPolicyPopup, setShowRetentionPolicyPopup] = useState(false);

  // Add these functions to calculate unread messages by type
  const calculateUnreadFromFriends = () => {
    return friends.reduce((total, friend) => {
      return total + (unreadMessages[friend.friendId._id] || 0);
    }, 0);
  };

  const calculateUnreadFromNearby = () => {
    // Only count nearby users who are not friends
    return arrayOfNearbyUserData.reduce((total, user) => {
      if (!isUserFriend(user._id)) {
        return total + (unreadMessages[user._id] || 0);
      }
      return total;
    }, 0);
  };

  const [replyingTo, setReplyingTo] = useState(null); // Add this state for tracking which message we're replying to

  // Add a reply function to the context menu options
  const replyToMessage = () => {
    if (!selectedMessage) return;
    
    setReplyingTo(selectedMessage);
    setShowContextMenu(false);
    
    // Focus the chat input after selecting to reply
    const chatInput = document.getElementById('chatInput');
    if (chatInput) chatInput.focus();
  };

  // Add this function to render a reply preview
  const renderReplyPreview = () => {
    if (!replyingTo) return null;
    
    const isReplyFromMe = replyingTo.sender === authUser.data.user._id;
    const replySender = isReplyFromMe ? 'You' : activeChatUser?.fullName || 'User';
    
    return (
      <div className="bg-[#31333A] text-[#FFF6E0] p-2 rounded-t-lg flex justify-between items-start">
        <div>
          <div className="text-xs font-semibold mb-1">
            Replying to {replySender}
          </div>
          <div className="text-sm text-[#FFF6E0]/80 truncate max-w-[220px]">
            {replyingTo.message}
          </div>
        </div>
        <button 
          onClick={() => setReplyingTo(null)} 
          className="text-[#FFF6E0]/60 hover:text-[#FFF6E0] transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  // Add a function to render replied message content
  const renderRepliedMessage = (message) => {
    if (!message.replyTo) return null;
    
    // Find the original message being replied to
    const repliedMessage = messagesByRoom[activeChatRoom]?.find(
      msg => msg._id === message.replyTo
    );
    
    if (!repliedMessage) return null;
    
    const isReplyFromMe = repliedMessage.sender === authUser.data.user._id;
    const replySender = isReplyFromMe ? 'You' : activeChatUser?.fullName || 'User';
    
    return (
      <div className="mb-1 text-xs bg-[#494D5A] p-1.5 rounded-lg text-[#FFF6E0]/80">
        <div className="font-semibold text-[#FFF6E0]/90 mb-0.5">
          {replySender}
        </div>
        <div className="truncate max-w-full">
          {repliedMessage.message}
        </div>
      </div>
    );
  };

  // Update the context menu to include a reply option
  // Add the reply option to the context menu
  const contextMenuItems = [
    { label: "Copy", icon: <FaCopy />, action: copyMessageText },
    { label: "Reply", icon: <FaReply />, action: replyToMessage },
    { label: "Info", icon: <FaInfoCircle />, action: showMessageInfo },
  ];

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

  // Refresh time for fetching nearby users
  const refreshTime = 100000; // 100 seconds

  // Add these new state variables in the component state section (around line 85-90)
  const [showPolicyPopup, setShowPolicyPopup] = useState(false);
  const [friendRequestError, setFriendRequestError] = useState("");

  // Add this function to check if a friend request has been sent to a user
  const hasSentRequestTo = (userId) => {
    return sentFriendRequests.some(request => 
      (request.receiverId?._id === userId || request.receiverId === userId) &&
      request.status === "pending"
    );
  };

  // Add a useEffect to fetch sent friend requests when the component mounts
  useEffect(() => {
    if (authUser?.data?.user?._id) {
      fetchSentFriendRequests();
    }
  }, [authUser]);

  // Update the handleFriendRequest function
  const handleFriendRequest = async () => {
    // If already sent a request, show a toast notification
    if (hasSentRequestTo(activeChatUser._id)) {
      toast.info("Friend request already sent");
      return;
    }

    try {
      // First check if we meet the message exchange requirement
      setFriendRequestError("");
      await useAuthStore.getState().sendFriendRequest(activeChatUser._id);
      // If successful, show a success toast
      toast.success("Friend request sent successfully");
    } catch (error) {
      console.error("Error sending friend request:", error);
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        // Check if the error is related to the message count policy
        if (errorMessage.includes("messages with this user before sending")) {
          setFriendRequestError(errorMessage);
          setShowPolicyPopup(true);
          // Don't show toast error since we're showing the popup
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Failed to send friend request. Please try again.");
      }
    }
  };

  return (
    <div
      className="h-full flex flex-col md:flex-row overflow-hidden relative"
      onClick={() => setShowContextMenu(false)}
    >
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
          className="md:hidden absolute top-4 right-4 z-30 bg-[#272829] text-[#FFF6E0] p-3 rounded-full shadow-md hover:bg-[#31333A] transition-all duration-300 "
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <MdMenu size={20} />
          {/* Add unread count badge */}
          {(calculateUnreadFromFriends() + calculateUnreadFromNearby()) > 0 && (
            <div className="absolute -top-2 -right-2 bg-[#B8B7B5] text-[#272829] rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-bold px-1.5">
              {(calculateUnreadFromFriends() + calculateUnreadFromNearby()) > 99 ? "99+" : (calculateUnreadFromFriends() + calculateUnreadFromNearby())}
            </div>
          )}
        </button>
      )}

      {/* Mobile Overlay Sidebar with improved animation and design */}
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
        {/* Mobile Sidebar Header - improved design */}
        <div className="sticky top-0 z-10 p-3 bg-gradient-to-r from-[#272829] to-[#31333A] border-b border-[#3a3b3c] shadow-md">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between px-3 pt-2">
              <h2 className="font-semibold text-[#FFF6E0] text-lg">ChatApp</h2>
        <button
                className="p-2 rounded-full hover:bg-[#3a3b3c] transition-all duration-300 text-[#FFF6E0]"
          onClick={toggleSidebar}
          aria-label="Close menu"
        >
          <MdClose size={24} />
        </button>
          </div>
            
            {/* Improved tab navigation with better contrast and visual cues */}
            <div className="flex bg-[#1e1f20]/40 p-1 rounded-lg mx-3">
                <button
                className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    viewMode === "nearby"
                    ? "bg-[#61677A] text-[#FFF6E0] shadow-md"
                    : "text-[#FFF6E0]/70 hover:text-[#FFF6E0] hover:bg-[#31333A]/50"
                  }`}
                  onClick={() => setViewMode("nearby")}
                >
                <FaUser className="mr-2" size={18} />
                Nearby
                {calculateUnreadFromNearby() > 0 && (
                  <div className="bg-[#FFF6E0] text-[#272829] rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-bold px-1.5 ml-2">
                    {calculateUnreadFromNearby() > 99 ? "99+" : calculateUnreadFromNearby()}
                  </div>
                )}
              </button>
              <button
                className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  viewMode === "friends"
                    ? "bg-[#61677A] text-[#FFF6E0] shadow-md"
                    : "text-[#FFF6E0]/70 hover:text-[#FFF6E0] hover:bg-[#31333A]/50"
                }`}
                onClick={() => setViewMode("friends")}
              >
                <FaUserFriends className="mr-2" size={18} />
                Friends
                {calculateUnreadFromFriends() > 0 && (
                  <div className="bg-[#FFF6E0] text-[#272829] rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-bold px-1.5 ml-2">
                    {calculateUnreadFromFriends() > 99 ? "99+" : calculateUnreadFromFriends()}
                  </div>
                )}
              </button>
            </div>
            
            {/* Search bar only in friends view */}
            {viewMode === "friends" && (
              <div className="relative px-3 pb-1">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search friends..."
                    value={friendSearchTerm}
                    onChange={(e) => setFriendSearchTerm(e.target.value)}
                    className="w-full bg-[#1e1f20]/40 rounded-lg px-3 py-2 pl-10 text-sm text-[#FFF6E0] placeholder-[#FFF6E0]/40 focus:outline-none focus:ring-1 focus:ring-[#61677A]/50"
                  />
                  <FaSearch className="absolute left-3 text-[#FFF6E0]/40" size={16} />
                  {friendSearchTerm && (
                    <button
                      onClick={() => setFriendSearchTerm("")}
                      className="absolute right-3 p-1 rounded-full hover:bg-[#3a3b3c] text-[#FFF6E0]/70 hover:text-[#FFF6E0]"
                    >
                      <FaTimes size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile User List with enhanced styling */}
        <div className="flex-1 overflow-y-auto h-full custom-scrollbar p-2">
          {viewMode === "nearby" ? (
            <>
              {/* Loading state with improved styling */}
              {isFetchingNearbyUsers && (
                <div className="p-6 text-center text-[#FFF6E0] opacity-75">
                  <div className="inline-block p-3 bg-[#272829]/50 rounded-full">
                    <RefreshCw size={24} className="animate-spin" />
                  </div>
                  <p className="mt-4 font-medium">Discovering nearby connections...</p>
                  </div>
                )}

              {/* Empty state with improved styling */}
              {!isFetchingNearbyUsers && arrayOfNearbyUserData.length === 0 && (
                <div className="p-6 text-center text-[#FFF6E0]">
                  <div className="bg-[#272829]/40 p-6 rounded-xl border border-[#61677A]/20 shadow-lg">
                    <div className="inline-block p-4 bg-[#272829]/40 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                      </svg>
                    </div>
                    <p className="mb-4 font-medium">No nearby users found</p>
                        <button
                          onClick={handleRefreshNearby}
                      className="px-4 py-2 bg-[#61677A] text-[#FFF6E0] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center mx-auto"
                        >
                      <RefreshCw size={16} className="inline mr-2" /> Try Again
                        </button>
                      </div>
                    </div>
                  )}

              {/* User list with improved cards */}
                {arrayOfNearbyUserData.length > 0 && (
                <div className="space-y-2 px-2">
                  {/* Section header with refresh button and filter */}
                  <div className="sticky top-0 bg-[#272829]/90 py-3 z-20">
                    <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="text-xs uppercase tracking-wider text-[#FFF6E0]/60 font-semibold">
                        People Nearby ({filteredNearbyUsers.length})
                    </h3>
                  <div className="flex items-center">
                            <button
                          onClick={() => setShowInterestFilters(!showInterestFilters)}
                          className="p-2 rounded-full hover:bg-[#31333A] transition-all duration-300 text-[#FFF6E0]/70 hover:text-[#FFF6E0] flex items-center mr-1"
                          title="Filter by interest"
                            >
                          <FaSearch size={16} />
                            </button>
                    <button
                      onClick={handleRefreshNearby}
                          className="p-2 rounded-full hover:bg-[#31333A] transition-all duration-300 text-[#FFF6E0]/70 hover:text-[#FFF6E0] flex items-center"
                      title="Refresh nearby users"
                    >
                          <MdRefresh size={18} className="mr-1" />
                          <span className="text-xs">Refresh</span>
                    </button>
                  </div>
                                </div>
                    
                    {/* Interest filter dropdown */}
                    {showInterestFilters && (
                      <div className="px-2 mb-2 animate-fadeIn">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Filter by interest..."
                            value={interestFilter}
                            onChange={(e) => setInterestFilter(e.target.value)}
                            className="w-full bg-[#1e1f20]/40 rounded-lg px-3 py-2 pl-10 text-sm text-[#FFF6E0] placeholder-[#FFF6E0]/40 focus:outline-none focus:ring-1 focus:ring-[#61677A]/50"
                          />
                          <FaSearch className="absolute left-3 text-[#FFF6E0]/40" size={16} />
                          {interestFilter && (
                            <button
                              onClick={() => setInterestFilter("")}
                              className="absolute right-3 p-1 rounded-full hover:bg-[#3a3b3c] text-[#FFF6E0]/70 hover:text-[#FFF6E0]"
                            >
                              <FaTimes size={14} />
                            </button>
                          )}
                        </div>
                        
                        {/* Quick interest tags */}
                        {getAllUniqueInterests().length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {getAllUniqueInterests().slice(0, 10).map(interest => (
                              <button 
                                key={interest}
                                onClick={() => setInterestFilter(interest)}
                                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                                  interestFilter === interest 
                                    ? "bg-[#61677A] text-[#FFF6E0]" 
                                    : "bg-[#272829]/40 text-[#FFF6E0]/70 hover:bg-[#272829]/60"
                                }`}
                              >
                                {interest}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Updated user cards with more visible interests */}
                  {filteredNearbyUsers.map((user, index) => {
                    const unreadCount = unreadMessages[user._id] || 0;
                    const isOnline = onlineUsers[user._id] || false;
                    const isFriend = isUserFriend(user._id);
                    return (
                      <div
                        key={user._id}
                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                          activeChatUser?._id === user._id
                          ? "bg-gradient-to-r from-[#61677A] to-[#505460] shadow-md border-l-4 border-[#FFF6E0]"
                          : "bg-[#272829]/30 hover:bg-[#61677A]/40 hover:translate-x-1"
                        }`}
                        onClick={() => {
                          handleStartChat(user);
                          toggleSidebar();
                        }}
                      >
                        <div className="relative">
                          <div className={`relative overflow-hidden rounded-full w-12 h-12 border-2 ${
                            activeChatUser?._id === user._id 
                              ? "border-[#FFF6E0]" 
                              : "border-[#61677A]/30"
                          }`}>
                            <img
                              src={
                                user.profileImageURL ||
                                "https://via.placeholder.com/150"
                              }
                              alt={`${isFriend ? user.fullName : user.uniqueTag}'s profile`}
                              className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                            />
                          </div>
                          {isFriend && (
                            <div className="absolute -top-[6px] -left-1 z-10">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg rotate-[-25deg]">
                                <GiBowTie className="text-pink-500 text-3xl" />
                              </div>
                            </div>
                          )}
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 ${
                              isOnline ? "bg-green-500" : "bg-red-500"
                            } rounded-full border-2 border-[#272829]`}
                          ></span>
                        </div>
                        <div className="flex-1 ml-3">
                          <h3 className="text-base font-semibold text-[#FFF6E0] flex items-center">
                            {isFriend ? (
                              <>
                                {user.fullName}
                                {isOnline && (
                                  <span className="ml-2 text-xs text-green-400 font-normal">• online</span>
                                )}
                              </>
                            ) : (
                              <>
                                #{user.uniqueTag}
                                {isOnline && (
                                  <span className="ml-2 text-xs text-green-400 font-normal">• online</span>
                                )}
                              </>
                            )}
                          </h3>
                          {/* Enhance interest display here */}
                          {!isFriend && user.bio && user.bio.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {user.bio.map((interest, idx) => (
                                <span 
                                  key={idx} 
                                  className="inline-block px-2 py-0.5 bg-[#272829]/50 text-[#FFF6E0] text-[10px] rounded-full border border-[#FFF6E0]/10"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          )}
                          {isFriend && (
                            <p className="text-xs text-[#FFF6E0]/70 line-clamp-1 mt-1">
                              Friend
                            </p>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <div className="bg-[#FFF6E0] text-[#272829] rounded-full min-w-6 h-6 flex items-center justify-center text-xs font-bold px-2">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="px-2">
              {/* Friend Requests Section as expandable dropdown */}
              <div className="mb-6 bg-[#272829]/40 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setIsFriendRequestsExpanded(!isFriendRequestsExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#31333A]/70 hover:bg-[#31333A] transition-colors"
                >
                  <div className="flex items-center">
                    <FaUserPlus className="mr-2" size={16} />
                    <h3 className="text-xs uppercase tracking-wider text-[#FFF6E0]/90 font-semibold">
                      Friend Requests
                    </h3>
                  </div>
                  <div className="flex items-center">
                    {friendRequests.length > 0 && (
                      <span className="bg-[#FFF6E0] text-[#272829] rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-bold px-1.5 mr-2">
                        {friendRequests.length}
                      </span>
                    )}
                    {isFriendRequestsExpanded ? (
                      <FaChevronUp size={16} />
                    ) : (
                      <FaChevronDown size={16} />
                    )}
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    isFriendRequestsExpanded 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-2 p-3">
                    {friendRequests.length > 0 ? (
                      friendRequests.map((request) => (
                        <div
                          key={request._id}
                          className="flex items-center justify-between p-3 bg-[#31333A]/50 rounded-lg border-l-2 border-[#FFF6E0]/50"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#61677A]/30 mr-3">
                              <img 
                                src={request.userId.profileImageURL || "https://via.placeholder.com/150"} 
                                alt={request.userId.fullName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-medium text-sm">{request.userId.fullName}</span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => acceptFriendRequest(request.userId._id)}
                              className="p-2 rounded-lg bg-[#272829]/50 hover:bg-green-500/20 transition-colors"
                            >
                              <FaUserCheck size={18} className="text-[#FFF6E0] hover:text-green-400" />
                            </button>
                            <button
                              onClick={() => rejectFriendRequest(request.userId._id)}
                              className="p-2 rounded-lg bg-[#272829]/50 hover:bg-red-500/20 transition-colors"
                            >
                              <FaUserMinus size={18} className="text-[#FFF6E0] hover:text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-[#FFF6E0]/70 bg-[#272829]/20 rounded-lg p-4 text-center">
                        No pending friend requests
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Friends list with improved styling */}
              <h3 className="text-xs uppercase tracking-wider text-[#FFF6E0]/60 font-semibold px-2 py-3 sticky top-0 bg-[#272829]/90 flex items-center ">
                Friends
                ({friends.length > 0 && (
                  <span className="text-[#FFF6E0]/60 flex items-center justify-center text-xs font-bold ">
                    {friends.length}
                  </span>
                )})
              </h3>
              
                  <div className="space-y-2 relative">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                        <div
                          key={friend.friendId._id}
                          ref={(el) => (mobileFriendRefs.current[friend.friendId._id] = el)}
                          className="relative"
                        >
                          <div 
                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                          activeChatUser?._id === friend.friendId._id
                            ? "bg-gradient-to-r from-[#61677A] to-[#505460] shadow-md border-l-4 border-[#FFF6E0]"
                            : "bg-[#272829]/30 hover:bg-[#61677A]/40 hover:translate-x-1"
                        }`}
                        onClick={() => {
                          handleStartChat(friend.friendId);
                          toggleSidebar();
                        }}
                      >
                          <div className="relative">
                          <div className={`relative overflow-hidden rounded-full w-12 h-12 border-2 ${
                            activeChatUser?._id === friend.friendId._id 
                              ? "border-[#FFF6E0]" 
                              : "border-[#61677A]/30"
                          }`}>
                            <img
                              src={friend.friendId.profileImageURL || "https://via.placeholder.com/150"}
                              alt={`${friend.friendId.fullName}'s profile`}
                              className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                            />
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 ${
                              onlineUsers[friend.friendId._id] ? "bg-green-500" : "bg-red-500"
                            } rounded-full border-2 border-[#272829]`}
                          ></span>
                        </div>
                        <div className="flex-1 ml-3">
                          <h3 className="text-base font-semibold text-[#FFF6E0] flex items-center">
                            {friend.friendId.fullName}
                            {onlineUsers[friend.friendId._id] && (
                              <span className="ml-2 text-xs text-green-400 font-normal">• online</span>
                            )}
                          </h3>
                          <p className="text-xs text-[#FFF6E0]/70 line-clamp-1">
                            Friend
                          </p>
                        </div>
                            {(unreadMessages[friend.friendId._id] || 0) > 0 && (
                          <div className="bg-[#FFF6E0] text-[#272829] rounded-full min-w-6 h-6 flex items-center justify-center text-xs font-bold px-2 mr-2">
                            {unreadMessages[friend.friendId._id] > 99 ? "99+" : unreadMessages[friend.friendId._id]}
                          </div>
                        )}
                        <div className="relative">
                          <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                              setOpenMenuFriendId(
                                    openMenuFriendId === friend.friendId._id ? null : friend.friendId._id
                              )
                                }}
                            className="text-[#FFF6E0]/70 hover:text-[#FFF6E0] p-2 hover:bg-[#272829]/30 rounded-full transition-colors"
                          >
                            <FaEllipsisV size={16} />
                          </button>
                          {openMenuFriendId === friend.friendId._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#272829] text-[#FFF6E0] rounded-lg shadow-lg z-50 border border-[#61677A]/20">
                              <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                  setFriendToRemove(friend.friendId);
                                  setOpenMenuFriendId(null);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-[#31333A] transition-colors flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="8.5" cy="7" r="4"></circle>
                                  <line x1="18" y1="8" x2="23" y2="13"></line>
                                  <line x1="23" y1="8" x2="18" y2="13"></line>
                                </svg>
                                Remove Friend
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {friendToRemove &&
                        friendToRemove._id === friend.friendId._id && (
                          <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-[#FFF6E0] rounded-lg shadow-lg z-50">
                            <p className="text-[#272829] mb-4">
                              Do you really want to remove{" "}
                              {friendToRemove.fullName} from your friends?
                            </p>
                            <div className="flex justify-end space-x-4">
                              <button
                                onClick={() => {
                                  removeFriend(friendToRemove._id);
                                  setFriendToRemove(null);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setFriendToRemove(null)}
                                className="px-4 py-2 bg-gray-300 text-[#272829] rounded hover:bg-gray-400 transition-colors"
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-[#FFF6E0]/70 bg-[#272829]/20 rounded-lg p-4 text-center">
                    {friendSearchTerm.trim() !== "" ? (
                      <p>No friends match your search</p>
                    ) : (
                      <>
                        <p>No friends yet</p>
                        <p className="text-xs mt-2">Add friends to chat with them anytime</p>
                      </>
                    )}
                  </div>
                )}
              </div>
                </div>
              )}
          </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300 block md:hidden"
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
        {/* Desktop Sidebar Header - improved design */}
        <div className="sticky top-0 z-10 p-3 bg-gradient-to-r from-[#272829] to-[#31333A] border-b border-[#3a3b3c] shadow-md">
          <div className="flex flex-col space-y-3">
            <h2 className="font-semibold text-[#FFF6E0] text-lg px-3 pt-2">ChatApp</h2>
            
            {/* Improved tab navigation with better contrast and visual cues */}
            <div className="flex bg-[#1e1f20]/40 p-1 rounded-lg">
              <button
                className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  viewMode === "nearby"
                    ? "bg-[#61677A] text-[#FFF6E0] shadow-md"
                    : "text-[#FFF6E0]/70 hover:text-[#FFF6E0] hover:bg-[#31333A]/50"
                }`}
                onClick={() => setViewMode("nearby")}
              >
                <FaUser className="mr-2" size={18} />
                Nearby
                {calculateUnreadFromNearby() > 0 && (
                  <div className="bg-[#FFF6E0] text-[#272829] rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-bold px-1.5 ml-2">
                    {calculateUnreadFromNearby() > 99 ? "99+" : calculateUnreadFromNearby()}
                  </div>
                )}
              </button>
              <button
                className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  viewMode === "friends"
                    ? "bg-[#61677A] text-[#FFF6E0] shadow-md"
                    : "text-[#FFF6E0]/70 hover:text-[#FFF6E0] hover:bg-[#31333A]/50"
                }`}
                onClick={() => setViewMode("friends")}
              >
                <FaUserFriends className="mr-2" size={18} />
                Friends
                {calculateUnreadFromFriends() > 0 && (
                  <div className="bg-[#FFF6E0] text-[#272829] rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-bold px-1.5 ml-2">
                    {calculateUnreadFromFriends() > 99 ? "99+" : calculateUnreadFromFriends()}
                  </div>
                )}
              </button>
            </div>
            
            {/* Search bar only in friends view */}
            {viewMode === "friends" && (
              <div className="relative px-3 pb-1">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search friends..."
                    value={friendSearchTerm}
                    onChange={(e) => setFriendSearchTerm(e.target.value)}
                    className="w-full bg-[#1e1f20]/40 rounded-lg px-3 py-2 pl-10 text-sm text-[#FFF6E0] placeholder-[#FFF6E0]/40 focus:outline-none focus:ring-1 focus:ring-[#61677A]/50"
                  />
                  <FaSearch className="absolute left-3 text-[#FFF6E0]/40" size={16} />
                  {friendSearchTerm && (
                    <button
                      onClick={() => setFriendSearchTerm("")}
                      className="absolute right-3 p-1 rounded-full hover:bg-[#3a3b3c] text-[#FFF6E0]/70 hover:text-[#FFF6E0]"
                    >
                      <FaTimes size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop User List with enhanced styling */}
        <div className="flex-1 overflow-y-auto h-auto p-2 custom-scrollbar">
          {viewMode === "nearby" ? (
            <>
              {/* Loading state with improved styling */}
              {isFetchingNearbyUsers && (
                <div className="p-6 text-center text-[#FFF6E0] opacity-75">
                  <div className="inline-block p-3 bg-[#272829]/50 rounded-full">
                    <RefreshCw size={24} className="animate-spin" />
                  </div>
                  <p className="mt-4 font-medium">Discovering nearby connections...</p>
                </div>
              )}

              {/* Empty state with improved styling */}
              {!isFetchingNearbyUsers && arrayOfNearbyUserData.length === 0 && (
                <div className="p-6 text-center text-[#FFF6E0]">
                  <div className="bg-[#272829]/40 p-6 rounded-xl border border-[#61677A]/20 shadow-lg">
                    <div className="inline-block p-4 bg-[#272829]/40 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                      </svg>
                    </div>
                    <p className="mb-4 font-medium">No nearby users found</p>
                    <button
                      onClick={handleRefreshNearby}
                      className="px-4 py-2 bg-[#61677A] text-[#FFF6E0] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center mx-auto"
                    >
                      <MdRefresh className="inline mr-2" size={16} /> Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* User list with improved cards */}
              {arrayOfNearbyUserData.length > 0 && (
                <div className="space-y-2 px-2">
                  {/* Section header with refresh button and filter */}
                  <div className="sticky top-0 bg-[#272829]/90 py-3 z-20">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <h3 className="text-xs uppercase tracking-wider text-[#FFF6E0]/60 font-semibold">
                        People Nearby ({filteredNearbyUsers.length})
                      </h3>
                      <div className="flex items-center">
                        <button
                          onClick={() => setShowInterestFilters(!showInterestFilters)}
                          className="p-2 rounded-full hover:bg-[#31333A] transition-all duration-300 text-[#FFF6E0]/70 hover:text-[#FFF6E0] mr-1"
                          title="Filter by interest"
                        >
                          <FaSearch size={16} />
                        </button>
                        <button
                          onClick={handleRefreshNearby}
                          className="p-2 rounded-full hover:bg-[#31333A] transition-all duration-300 text-[#FFF6E0]/70 hover:text-[#FFF6E0] hover:rotate-180"
                          title="Refresh nearby users"
                        >
                          <MdRefresh size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Interest filter dropdown */}
                    {showInterestFilters && (
                      <div className="px-2 mb-2 animate-fadeIn">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Filter by interest..."
                            value={interestFilter}
                            onChange={(e) => setInterestFilter(e.target.value)}
                            className="w-full bg-[#1e1f20]/40 rounded-lg px-3 py-2 pl-10 text-sm text-[#FFF6E0] placeholder-[#FFF6E0]/40 focus:outline-none focus:ring-1 focus:ring-[#61677A]/50"
                          />
                          <FaSearch className="absolute left-3 text-[#FFF6E0]/40" size={16} />
                          {interestFilter && (
                            <button
                              onClick={() => setInterestFilter("")}
                              className="absolute right-3 p-1 rounded-full hover:bg-[#3a3b3c] text-[#FFF6E0]/70 hover:text-[#FFF6E0]"
                            >
                              <FaTimes size={14} />
                            </button>
                          )}
                        </div>
                        
                        {/* Quick interest tags */}
                        {getAllUniqueInterests().length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {getAllUniqueInterests().slice(0, 10).map(interest => (
                              <button 
                                key={interest}
                                onClick={() => setInterestFilter(interest)}
                                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                                  interestFilter === interest 
                                    ? "bg-[#61677A] text-[#FFF6E0]" 
                                    : "bg-[#272829]/40 text-[#FFF6E0]/70 hover:bg-[#272829]/60"
                                }`}
                              >
                                {interest}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Updated desktop nearby user cards with more visible interests */}
                  {filteredNearbyUsers.map((user, index) => {
                    const unreadCount = unreadMessages[user._id] || 0;
                    const isFriend = isUserFriend(user._id);
                    
                    return (
                      <div
                        key={user._id}
                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                          activeChatUser?._id === user._id
                            ? "bg-gradient-to-r from-[#61677A] to-[#505460] shadow-md scale-102 border-l-4 border-[#FFF6E0]"
                            : "bg-[#272829]/30 hover:bg-[#61677A]/40 hover:translate-x-1"
                        }`}
                        onClick={() => handleStartChat(user)}
                      >
                        <div className="relative">
                          <div className={`relative overflow-hidden rounded-full w-12 h-12 border-2 ${
                            activeChatUser?._id === user._id 
                              ? "border-[#FFF6E0]" 
                              : "border-[#61677A]/30"
                          }`}>
                            <img
                              src={user.profileImageURL || "https://via.placeholder.com/150"}
                              alt={`${isFriend ? user.fullName : user.uniqueTag}'s profile`}
                              className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                            />
                            
                            
                          </div>
                          {isFriend && (
                              <div className="absolute -top-[6px] -left-1 z-10">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg rotate-[-25deg]">
                                  <GiBowTie className="text-pink-500 text-3xl" />
                                </div>
                              </div>
                            )}
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 ${
                              user.activeStatus?.isActive 
                                ? "bg-green-500" 
                                : "bg-red-500"
                            } rounded-full border-2 border-[#272829]`}
                          ></span>
                        </div>
                        <div className="flex-1 ml-3">
                          <h3 className="text-base font-semibold text-[#FFF6E0] flex items-center">
                            {isFriend ? (
                              <>
                                {user.fullName}
                                {user.activeStatus?.isActive && (
                                  <span className="ml-2 text-xs text-green-400 font-normal">• online</span>
                                )}
                              </>
                            ) : (
                              <>
                                #{user.uniqueTag}
                                {user.activeStatus?.isActive && (
                                  <span className="ml-2 text-xs text-green-400 font-normal">• online</span>
                                )}
                              </>
                            )}
                          </h3>
                          {/* Enhance interest display here */}
                          {!isFriend && user.bio && user.bio.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {user.bio.map((interest, idx) => (
                                <span 
                                  key={idx} 
                                  className="inline-block px-2 py-0.5 bg-[#272829]/50 text-[#FFF6E0] text-[10px] rounded-full border border-[#FFF6E0]/10"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          )}
                          {isFriend && (
                            <p className="text-xs text-[#FFF6E0]/70 line-clamp-1 mt-1">
                              Friend
                            </p>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <div className="bg-[#FFF6E0] text-[#272829] rounded-full min-w-6 h-6 flex items-center justify-center text-xs font-bold px-2">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="px-2">
              {/* Friend Requests Section as expandable dropdown */}
              <div className="mb-6 bg-[#272829]/40 rounded-lg overflow-hidden">
                        <button
                  onClick={() => setIsFriendRequestsExpanded(!isFriendRequestsExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#31333A]/70 hover:bg-[#31333A] transition-colors"
                >
                  <div className="flex items-center">
                    <FaUserPlus className="mr-2" size={16} />
                    <h3 className="text-xs uppercase tracking-wider text-[#FFF6E0]/90 font-semibold">
                      Friend Requests
                    </h3>
                  </div>
                  <div className="flex items-center">
                    {friendRequests.length > 0 && (
                      <span className="bg-[#FFF6E0] text-[#272829] rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-bold px-1.5 mr-2">
                        {friendRequests.length}
                      </span>
                    )}
                    {isFriendRequestsExpanded ? (
                      <FaChevronUp size={16} />
                    ) : (
                      <FaChevronDown size={16} />
                    )}
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    isFriendRequestsExpanded 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-2 p-3">
                    {friendRequests.length > 0 ? (
                      friendRequests.map((request) => (
                        <div
                          key={request._id}
                          className="flex items-center justify-between p-3 bg-[#31333A]/50 rounded-lg border-l-2 border-[#FFF6E0]/50"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#61677A]/30 mr-3">
                              <img 
                                src={request.userId.profileImageURL || "https://via.placeholder.com/150"} 
                                alt={request.userId.fullName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-medium text-sm">{request.userId.fullName}</span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => acceptFriendRequest(request.userId._id)}
                              className="p-2 rounded-lg bg-[#272829]/50 hover:bg-green-500/20 transition-colors"
                            >
                              <FaUserCheck size={18} className="text-[#FFF6E0] hover:text-green-400" />
                            </button>
                            <button
                              onClick={() => rejectFriendRequest(request.userId._id)}
                              className="p-2 rounded-lg bg-[#272829]/50 hover:bg-red-500/20 transition-colors"
                            >
                              <FaUserMinus size={18} className="text-[#FFF6E0] hover:text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-[#FFF6E0]/70 bg-[#272829]/20 rounded-lg p-4 text-center">
                        No pending friend requests
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Friends list with improved styling */}
              <h3 className="text-xs uppercase tracking-wider text-[#FFF6E0]/60 font-semibold px-2 py-3 sticky top-0 bg-[#272829]/90 flex items-center ">
                Friends
                {friends.length > 0 && (
                  <span className="bg-[#272829]/90  text-[#FFF6E0]/60 rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-bold px-1.5">
                    ({friends.length})
                  </span>
                )}
              </h3>
              
              <div className="space-y-2 relative">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                    <div
                      key={friend.friendId._id}
                      ref={(el) => (desktopFriendRefs.current[friend.friendId._id] = el)}
                      className="relative"
                    >
                      <div 
                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                          activeChatUser?._id === friend.friendId._id
                            ? "bg-gradient-to-r from-[#61677A] to-[#505460] shadow-md border-l-4 border-[#FFF6E0]"
                            : "bg-[#272829]/30 hover:bg-[#61677A]/40 hover:translate-x-1"
                        }`}
                        onClick={() => handleStartChat(friend.friendId)}
                      >
                        <div className="relative">
                          <div className={`relative overflow-hidden rounded-full w-12 h-12 border-2 ${
                            activeChatUser?._id === friend.friendId._id 
                              ? "border-[#FFF6E0]" 
                              : "border-[#61677A]/30"
                          }`}>
                            <img
                              src={friend.friendId.profileImageURL || "https://via.placeholder.com/150"}
                              alt={`${friend.friendId.fullName}'s profile`}
                              className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                            />
                          </div>
                          
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 ${
                              onlineUsers[friend.friendId._id] ? "bg-green-500" : "bg-red-500"
                            } rounded-full border-2 border-[#272829]`}
                          ></span>
                        </div>
                        <div className="flex-1 ml-3">
                          <h3 className="text-base font-semibold text-[#FFF6E0] flex items-center">
                            {friend.friendId.fullName}
                            {onlineUsers[friend.friendId._id] && (
                              <span className="ml-2 text-xs text-green-400 font-normal">• online</span>
                            )}
                            
                          </h3>
                          <p className="text-xs text-[#FFF6E0]/70 line-clamp-1">
                            Friend
                          </p>
                        </div>
                        {(unreadMessages[friend.friendId._id] || 0) > 0 && (
                          <div className="bg-[#FFF6E0] text-[#272829] rounded-full min-w-6 h-6 flex items-center justify-center text-xs font-bold px-2 mr-2">
                            {unreadMessages[friend.friendId._id] > 99 ? "99+" : unreadMessages[friend.friendId._id]}
                          </div>
                        )}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuFriendId(
                                openMenuFriendId === friend.friendId._id ? null : friend.friendId._id
                              )
                            }}
                            className="text-[#FFF6E0]/70 hover:text-[#FFF6E0] p-2 hover:bg-[#272829]/30 rounded-full transition-colors"
                          >
                            <FaEllipsisV size={16} />
                          </button>
                          {openMenuFriendId === friend.friendId._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#272829] text-[#FFF6E0] rounded-lg shadow-lg z-50 border border-[#61677A]/20">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFriendToRemove(friend.friendId);
                                  setOpenMenuFriendId(null);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-[#31333A] transition-colors flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="8.5" cy="7" r="4"></circle>
                                  <line x1="18" y1="8" x2="23" y2="13"></line>
                                  <line x1="23" y1="8" x2="18" y2="13"></line>
                                </svg>
                                Remove Friend
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {friendToRemove &&
                        friendToRemove._id === friend.friendId._id && (
                          <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-[#FFF6E0] rounded-lg shadow-lg z-50">
                            <p className="text-[#272829] mb-4">
                              Do you really want to remove{" "}
                              {friendToRemove.fullName} from your friends?
                            </p>
                            <div className="flex justify-end space-x-4">
                              <button
                                onClick={() => {
                                  removeFriend(friendToRemove._id);
                                  setFriendToRemove(null);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setFriendToRemove(null)}
                                className="px-4 py-2 bg-gray-300 text-[#272829] rounded hover:bg-gray-400 transition-colors"
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-[#FFF6E0]/70 bg-[#272829]/20 rounded-lg p-4 text-center">
                    {friendSearchTerm.trim() !== "" ? (
                      <p>No friends match your search</p>
                    ) : (
                      <>
                        <p>No friends yet</p>
                        <p className="text-xs mt-2">Add friends to chat with them anytime</p>
                      </>
                    )}
                  </div>
                )}
              </div>
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
                <div
                  className="relative overflow-hidden rounded-full w-10 h-10 border-2 border-[#61677A]/30 cursor-pointer"
                  onClick={() => setShowUserInfoPopup(true)}
                >
                  <img
                    src={
                      activeChatUser.profileImageURL ||
                      "https://via.placeholder.com/150"
                    }
                    alt={`${isFriend ? activeChatUser.fullName : activeChatUser.uniqueTag}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-bold">
                    {isFriend ? activeChatUser.fullName : `#${activeChatUser.uniqueTag}`}
                  </h2>
                  <div className="flex flex-col">
                    <div
                      className={`flex items-center text-xs ${
                        activeChatUser.activeStatus?.isActive
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 ${
                          activeChatUser.activeStatus?.isActive
                            ? "bg-green-500"
                            : "bg-red-500"
                        } rounded-full mr-1 animate-pulse`}
                      ></span>
                      {activeChatUser.activeStatus?.isActive ? "online" : "offline"}
                    </div>
                    
                  </div>
                </div>
                <div className="ml-5 flex items-center space-x-3">
                  {/* Message retention policy button */}
                  <button
                    onClick={() => setShowRetentionPolicyPopup(true)}
                    className="p-1.5 text-[#61677A] hover:text-[#272829] bg-[#F0F0F0]/70 hover:bg-[#F0F0F0] rounded-md transition-all duration-200 relative group shadow-sm"
                    title="Message Retention Policy"
                  >
                    <FaClock size={18} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full opacity-70 animate-pulse "></span>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-[#272829] text-[#FFF6E0] text-xs  p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#272829] "></div>
                      Messages expire after a period of time. Click for details.
                    </div>
                  </button>
                  {/* Friend Request Button */}
                  {!isFriend && (
                    <>
                      {hasSentRequestTo(activeChatUser?._id) ? (
                        <button
                          className="p-1.5 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 rounded-md transition-all duration-200 relative group shadow-sm flex items-center"
                          disabled
                          title="Friend request sent"
                        >
                          <Clock size={18} className="mr-1" />
                          <span className="text-xs">Request Sent</span>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-42 bg-[#272829] text-[#FFF6E0] text-xs p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#272829]"></div>
                            Friend request sent
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFriendRequest()}
                          className="p-1.5 text-[#61677A] hover:text-[#272829] bg-[#F0F0F0]/70 hover:bg-[#F0F0F0] rounded-md transition-all duration-200 relative group shadow-sm"
                          title="Send friend request"
                        >
                          <UserPlus size={18} />
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-36 bg-[#272829] text-[#FFF6E0] text-xs p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#272829]"></div>
                            Send friend request
                          </div>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Area with gradient background and soft pattern */}
            <div className="flex-1 overflow-y-auto p-4 relative bg-[url('/src/assets/images/chat-bg-pattern.png')] bg-repeat bg-[#E9E9E9]/20">
              {activeChatRoom ? (
                <div className="space-y-4 relative z-10">
                  {currentMessages.length > 0 ? (
                    Object.entries(groupMessagesByDate(currentMessages)).map(
                      ([dateString, messages]) => (
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
                              const isMe =
                                msg.sender === authUser.data.user._id;
                              const isExpanded =
                                expandedMessages[msg._id] || false;
                              const isLongMessage = msg.message.length > 150;
                              const prevMsg =
                                idx > 0 ? messages[idx - 1] : null;
                              const nextMsg =
                                idx < messages.length - 1
                                  ? messages[idx + 1]
                                  : null;

                              // Check if messages are from the same sender
                              const isFirstInGroup =
                                !prevMsg || prevMsg.sender !== msg.sender;
                              const isLastInGroup =
                                !nextMsg || nextMsg.sender !== msg.sender;

                              return (
                                <div
                                  key={msg._id || idx}
                                  className={`flex ${
                                    isMe ? "justify-end" : "justify-start"
                                  } mb-2`}
                                >
                                  {/* Show avatar only for first message in group from others */}
                                  {!isMe && isFirstInGroup && (
                                    <div className="self-end mb-1 mr-2">
                                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#61677A]/30">
                                        <img
                                          src={
                                            activeChatUser.profileImageURL ||
                                            "https://via.placeholder.com/150"
                                          }
                                          alt={`${activeChatUser.fullName}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <div
                                    className={`group relative max-w-[75%] ${
                                      !isFirstInGroup && !isMe ? "ml-10" : ""
                                    }`}
                                  >
                                    {/* Message Bubble */}
                                    <div
                                      className={`
                                        relative p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer
                                        ${isMe 
                                          ? "bg-[#272829] text-[#FFF6E0] rounded-2xl rounded-br-sm" 
                                          : "bg-[#61677A] text-[#FFF6E0] rounded-2xl rounded-bl-sm"}
                                      `}
                                      onClick={(e) => handleMessageClick(e, msg)}
                                    >
                                      {/* Render replied message if this message is a reply */}
                                      {renderRepliedMessage(msg)}
                                      
                                      {/* Message Content */}
                                      <p className="leading-relaxed text-sm md:text-base">
                                        {isLongMessage && !isExpanded
                                          ? truncateMessage(msg.message)
                                          : msg.message}
                                      </p>
                                      
                                      {/* Read More/Less Button */}
                                      {isLongMessage && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleMessageExpansion(msg._id);
                                          }}
                                          className="text-xs mt-1 text-[#FFF6E0]/70 hover:text-[#FFF6E0] transition-colors duration-300 underline focus:outline-none"
                                        >
                                          {isExpanded
                                            ? "Read less"
                                            : "Read more"}
                                        </button>
                                      )}

                                      {/* Timestamp and Message Status */}
                                      <div className="text-[10px] mt-1 text-right flex justify-end items-center opacity-70">
                                        <span>{formatTime(msg.timestamp)}</span>
                                        {isMe && (
                                          <span className="ml-1">
                                            {msg.status === "sent" && (
                                              <IoCheckmark size={12} />
                                            )}
                                            {msg.status === "delivered" && (
                                              <IoCheckmarkDone size={12} />
                                            )}
                                            {msg.status === "read" && (
                                              <span className="text-blue-400">
                                                <IoCheckmarkDone size={12} />
                                              </span>
                                            )}
                                          </span>
                                        )}
                                      </div>
                                      
                                      {/* Message Tail */}
                                      <div 
                                        className={`absolute w-4 h-4 ${
                                          isMe 
                                            ? "right-0 bottom-0 bg-[#272829]" 
                                            : "left-0 bottom-0 bg-[#61677A]"
                                        }`}
                                        style={{
                                          clipPath: isMe 
                                            ? 'polygon(100% 0, 0 100%, 100% 100%)' 
                                            : 'polygon(0 0, 0 100%, 100% 100%)'
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    
                    <div className="flex items-center justify-center h-full py-20 text-[#61677A]">
                      <div className="text-center p-6 bg-[#FFF6E0]/30 rounded-2xl">
                        <MdMessage
                          size={40}
                          className="mx-auto mb-4 text-[#61677A]/50"
                        />
                        <p>
                          Start a conversation with {isFriend ? activeChatUser.fullName : `#${activeChatUser.uniqueTag}`}
                        </p>
                        {/* <p className="text-xs mt-2 text-[#61677A]/70">
                          Messages are end-to-end encrypted
                        </p> */}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-[#61677A]">
                  <div className="text-center">
                    <RefreshCw
                      size={30}
                      className="mx-auto mb-2 animate-spin"
                    />
                    <p>Establishing secure connection...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input with modern styling and animation - simplified version */}
            <div className="p-3 border-t border-gray-200 bg-[#FFF6E0] sticky bottom-0 left-0 right-0 bg-opacity-90 shadow-md z-40">
              {/* Reply Preview */}
              {renderReplyPreview()}
              
              <div className="flex gap-2 items-end">
                {/* Emoji button with position relative for proper positioning */}
                <div className="relative z-[9000]">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 rounded-full hover:bg-[#D8D9DA] transition-colors text-[#272829]"
                  >
                    <FaSmile size={24} />
                  </button>

                  <EmojiPicker
                    visible={showEmojiPicker}
                    onEmojiSelect={(emoji) => {
                      if (emoji) {
                        setChatMessage(
                          (prevMessage) => prevMessage + emoji.native
                        );
                      } else {
                        setShowEmojiPicker(false);
                      }
                    }}
                    position="top"
                  />
                </div>

                <input
                  id="chatInput" // Add an ID to the input for focusing
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-[#272829] text-[#FFF6E0] border-none rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#61677A] transition-all duration-300 shadow-inner placeholder-[#FFF6E0]/50 min-h-[44px]"
                  placeholder={replyingTo ? "Type your reply..." : "Type a message..."}
                />

                <button
                  onClick={handleSendMessage}
                  className="p-3 rounded-full bg-[#272829] text-[#FFF6E0] hover:bg-[#31333A] transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!activeChatRoom || !chatMessage.trim()}
                >
                  <FaPaperPlane size={20} />
                </button>
              </div>
            </div>

            {showFriendRequestPopup && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 animate-fadeIn"
                onClick={() => setShowFriendRequestPopup(false)}
              >
                <div
                  className="p-8 bg-gradient-to-b from-[#FFF6E0] to-[#D8D9DA] rounded-xl shadow-2xl max-w-md m-4 border border-[#61677A]/20 transform transition-all duration-500 animate-scaleIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  {hasSentRequestTo(activeChatUser?._id) ? (
                    <>
                      <div className="flex items-center mb-4">
                        <div className="bg-amber-500/20 p-2 rounded-full mr-4">
                          <Clock size={22} className="text-amber-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#272829]">
                          Request Already Sent
                        </h3>
                      </div>
                      <p className="mb-6 text-[#61677A] leading-relaxed">
                        You've already sent a friend request to #{activeChatUser.uniqueTag}. 
                        They will be notified and can choose to accept or decline your request.
                      </p>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setShowFriendRequestPopup(false)}
                          className="bg-[#272829] text-[#FFF6E0] px-4 py-3 rounded-xl hover:bg-[#31333A] transition-all duration-300 flex items-center justify-center"
                        >
                          OK, Got It
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold mb-4 text-[#272829]">
                        Send Friend Request
                      </h3>
                      <p className="mb-6 text-[#61677A] leading-relaxed">
                        By sending a friend request to #{activeChatUser.uniqueTag},
                        they will be able to see your name and the number of friends
                        you have. Do you want to proceed?
                      </p>
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            handleFriendRequest();
                            setShowFriendRequestPopup(false);
                          }}
                          className="flex-1 bg-gradient-to-r from-[#272829] to-[#31333A] text-[#FFF6E0] px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                        >
                          Send Request
                        </button>
                        <button
                          onClick={() => setShowFriendRequestPopup(false)}
                          className="flex-1 border border-[#272829]/50 text-[#272829] px-4 py-3 rounded-xl hover:bg-[#272829]/5 transition-all duration-300 transform hover:scale-105"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {showUserInfoPopup && (
              <UserInfoPopup
                className="z-100"
                user={activeChatUser}
                isOnline={onlineUsers[activeChatUser._id] || false}
                onClose={() => setShowUserInfoPopup(false)}
                isUserFriend={isUserFriend(activeChatUser._id)}
                friendCount={friends.length}
                onAddFriend={async () => {
                  // Return a promise that will be handled by the UserInfoPopup component
                  return useAuthStore.getState().sendFriendRequest(activeChatUser._id);
                }}
                onRemoveFriend={() => removeFriend(activeChatUser._id)}
                sentFriendRequests={sentFriendRequests}
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
                  <MdRefresh className="mr-2 group-hover:rotate-90 transition-transform duration-500" size={18} />
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
                <MdRefresh className="mr-2" size={16} /> Try Again
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
          {contextMenuItems.map((item, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 hover:bg-[#31333A] transition-colors duration-200 flex items-center"
              onClick={item.action}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 31, 32, 0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(97, 103, 122, 0.4);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(97, 103, 122, 0.7);
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Add a floating action button for mobile view when scrolled down */}
      {viewMode === "nearby" && !activeChatUser && (
        <button
          onClick={handleRefreshNearby}
          className="md:hidden fixed bottom-6 right-6 z-20 p-3 rounded-full bg-[#61677A] text-[#FFF6E0] shadow-lg hover:bg-[#505460] transition-all duration-300 flex items-center justify-center"
          aria-label="Refresh nearby users"
        >
          <MdRefresh size={24} />
        </button>
      )}

      {/* Add the retention policy popup */}
      {showRetentionPolicyPopup && (
        <RetentionPolicyPopup onClose={() => setShowRetentionPolicyPopup(false)} />
      )}

      {showPolicyPopup && (
        <FriendRequestPolicyPopup
          onClose={() => setShowPolicyPopup(false)}
          errorMessage={friendRequestError}
          user={activeChatUser}
        />
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

// Add this component for the retention policy popup
const RetentionPolicyPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-[#FFF6E0] text-[#272829] p-6 rounded-lg shadow-xl max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <FaClock className="mr-2" /> Message Retention Policy
          </h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            For your privacy and to optimize app performance, messages are automatically deleted after a certain period:
          </p>
          
          <div className="bg-[#272829]/5 p-3 rounded-md">
            <h4 className="font-semibold mb-2 flex items-center">
              <FaUserFriends className="mr-2 text-blue-600" /> 
              Friend Messages
            </h4>
            <p className="text-sm ml-6">Messages between friends are kept for <span className="font-semibold">48 hours</span></p>
          </div>
          
          <div className="bg-[#272829]/5 p-3 rounded-md">
            <h4 className="font-semibold mb-2 flex items-center">
              <FaUser className="mr-2 text-green-600" /> 
              Nearby Users
            </h4>
            <p className="text-sm ml-6">Messages between nearby users are kept for <span className="font-semibold">1 hour</span></p>
          </div>
          
          <div className="bg-[#272829]/5 p-3 rounded-md">
            <h4 className="font-semibold mb-2 flex items-center">
              <Info className="mr-2 text-amber-600" size={16} /> 
              Unread Messages
            </h4>
            <p className="text-sm ml-6">Unread messages are preserved for <span className="font-semibold">60 hours</span></p>
          </div>
          
          <p className="text-xs text-[#272829]/70 italic">
            If you want to save important information, we recommend taking screenshots or notes of critical conversations.
          </p>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-5 w-full py-2 bg-[#272829] text-white rounded-md hover:bg-[#393A3C] transition duration-200"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default HomePage;
