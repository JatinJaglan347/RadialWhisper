import { create } from 'zustand';
import { axiosInstance } from '../lib/axios'; // axios instance for API calls
import toast from 'react-hot-toast';
import { io } from 'socket.io-client'




export const useAuthStore = create((set, get) => ({
  authUser: null,
  isAdmin: false,
  isKing: false,
  isModrater: false,
  isSigninUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isFetchingNearbyUsers: false, // State to track the loading of nearby users
  nearbyUsersData: [], // State to store nearby users
  userInfoRulesData: null,
  isGettingUserInfoRules :false,
  suggestions: [], // Stores the list of all suggestions
  selectedSuggestion: null, // Stores a single selected suggestion
  opStats: {},
  isFetchingUsers: false,
  usersData: [],
  totalPages: 1,
  currentPage: 1,
  isSearchingUser: false,
  searchedUser: null,
  isUpdatingBanStatus: false,
  bannedUser: null,
  isUpdatingRole: false,
  isUpdatingSuggestion: false,
  isDeletingSuggestion: false,
  contacts: [],
  isSubmitting: false,
  isUpdating: false,
  userInfoRules: null,
  isLoading: false,
  

  user: null,
  isActive: false,
  lastActive: null,


  friends: [],
  friendRequests: [],
  isFetchingFriends: false,
  isFetchingFriendRequests: false,


  // Function to check if the user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/api/v1/user/checkAuth');

      console.log("check Auth API");

      set({ authUser: res.data });
      const { authUser } = get();
      localStorage.setItem('authUser', JSON.stringify(res.data));
      const userRole = authUser?.data?.user?.userRole;
      console.log("User Role:", userRole);

      if (userRole === 'king') {
        set({ isKing: true });
      } else if (userRole === 'admin') {    
        set({ isAdmin: true });
      } else if (userRole === 'moderator') {
        set({ isModrater: true });
      } else {
        set({ isKing: false });
        set({ isAdmin: false });
        set({ isModrater: false });
      }
    } catch (err) {
      console.error("Error in checkAuth:", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
   
  },

  checkOpUser:()=>{
     const { isKing, isAdmin, isModrater } = get();
    if (!isKing && !isAdmin && !isModrater) {
      toast.error("You are not authorized to access this page");
      

    }else{
      toast.success("User Verified Successfully");
      
    }
  },


  // Function to get the user details from the API
  getUserDetails: async () => {
    try {
      
      const res = await axiosInstance.get('/api/v1/user/userDetails');

      console.log("Fetched User Details API");

      // console.log("Fetched User Details:", res.data);
      set({ authUser: res.data });
      
    } catch (err) {
      console.error("Error in getUserDetails:", err);
      set({ authUser: null });
      // toast.error("Failed to fetch user details");
    }
  },

  // Function to handle user signup
  signup: async (data) => {
    set({ isSigninUp: true });

    try {
      const res = await axiosInstance.post('/api/v1/user/register', data);

      console.log("Signup API");

      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      console.error(error);  // Log the entire error object to the console
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    } finally {
      set({ isSigninUp: false });
    }
  },

  // Function to handle user login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/api/v1/user/login', data);
      console.log("Login API");
      set({ authUser: res.data });
      // Immediately update role flags by calling checkAuth:
      await get().checkAuth();
      toast.success("Logged in successfully");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Failed to log in";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },


  logout: async () => {
    try {
      await get().updateActivityStatus(false, new Date());
      await axiosInstance.post("/api/v1/user/logout");
      toast.success("Logged out successfully");
  
      // Reset all relevant state
      set({
        authUser: null,
        isAdmin: false,
        isKing: false,
        isModrater: false,
        nearbyUsersData: [],
        userInfoRulesData: null,
        suggestions: [],
        selectedSuggestion: null,
        opStats: {},
        unreadMessagesBySender: {},
        activeChatRoom: null,
        currentUserId: null,
        friends: [], 
        friendRequests: [],
      });
  
      // Clear stored user data
      localStorage.removeItem("authUser");
      localStorage.removeItem("unreadMessagesBySender");
  
      // Disconnect socket if connected
      const { socket } = get();
      if (socket) {
        socket.disconnect();
        set({ socket: null });
      }
      
      // Navigate to login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 500); 
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  },


   // Update a user field dynamically
   updateUserField: async ({ userId ,field, value }) => {
    set({ isUpdating: true });

    try {
      const res = await axiosInstance.patch("/api/v1/user/update-field", { userId ,field, value });

      toast.success("User field updated successfully");

      // Optimistically update state
      set((state) => ({
        userData: {
          ...state.userData,
          [field]: value,
        },
      }));

      return res.data;
    } catch (error) {
      console.error("Error updating user field:", error);
      const errorMessage = error.response?.data?.message || "Failed to update user field";
      toast.error(errorMessage);
    } finally {
      set({ isUpdating: false });
    }
  },
  
  

  fetchNearbyUsers: async (data)=>{
    set({ isFetchingNearbyUsers: true });
    try{
      const res = await axiosInstance.post('/api/v1/user/nearbyUsers' , data);
      console.log("Fetch NearbyUsers API");
      set({ nearbyUsersData: res.data });

    }catch(err){
      console.error("Error in fetchNearbyUsers:", err);
      const errorMessage = err.response?.data?.message || "Failed to fetch nearby users";
      toast.error(errorMessage);
    }finally{
      set({ isFetchingNearbyUsers: false });
    }
  },

  getUserInfoRules:async(data)=>{
    set({isGettingUserInfoRules:true});
    try{
      const res = await axiosInstance.post('/api/v1/op/user-info-rules' ,data);
      console.log("Fetch UserInfor Rules");
      set({userInfoRulesData: res.data});
    }catch(err){
      console.error("Error in getUserInfoRules: " , err);
      const errorMessage = err.response?.data?.message || "Failed to get the User Info Rules";
      toast.error(errorMessage);
    }finally{
      set({isGettingUserInfoRules:false});
    }
  },

  // Method to update user's active status with debouncing to avoid too many updates
// In your updateActivityStatus function in useAuthStore.js:
// In client/src/store/useAuthStore.js (within your create store)
updateActivityStatus: async (isActive, lastActive) => {
  console.log(`Setting status: isActive=${isActive}, lastActive=${lastActive}`);
  set({ isActive, lastActive });
  
  const { authUser } = get();
  if (authUser?.data?.user?._id) {
    try {
      console.log(`Sending activity update to server: ${isActive}`);
      await axiosInstance.post('/api/v1/user/update-activity', {
        userId: authUser.data.user._id,
        isActive,
        lastActive: lastActive || new Date()
      });
      console.log('Activity status updated successfully');
    } catch (error) {
      console.error('Failed to update activity status:', error);
    }
  }
},




  getUsers: async (filters = {}, page = 1) => {
    try {
      set({ isFetchingUsers: true });

      const res = await axiosInstance.get("/api/v1/op/getusers", {
        params: { page, filters }
      });

      console.log("Fetched Users API");

      set({
        usersData: res.data?.message?.users || [],
        totalPages: res.data?.message?.totalPages || 1,
        currentPage: res.data?.message?.currentPage || 1,
      });

    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isFetchingUsers: false });
    }
  },



  adminSearchUser: async (searchQuery) => {
    set({ isSearchingUser: true });

    try {
        const res = await axiosInstance.get(`/api/v1/op/adminsearchuser`, {
            params: searchQuery, // Pass email or uniqueTag as query params
        });

        console.log("Admin Search User API:", res.data);
        set({ searchedUser: res.data.message });

        toast.success("User found successfully");
    } catch (error) {
        console.error("Error in adminSearchUser:", error);
        const errorMessage = error.response?.data?.message || "Failed to fetch user";
        toast.error(errorMessage);
        set({ searchedUser: null });
    } finally {
        set({ isSearchingUser: false });
    }
},



banUnbanUser: async (data) => {
  set({ isUpdatingBanStatus: true });

  try {
      const res = await axiosInstance.post('/api/v1/op/ban-unban', data);

      console.log("Ban/Unban User API:", res.data);
      toast.success("User ban status updated successfully");

      // Optionally update local state if needed
      set({ bannedUser: res.data });

  } catch (error) {
      console.error("Error in banUnbanUser:", error);
      const errorMessage = error.response?.data?.message || "Failed to update ban status";
      toast.error(errorMessage);
  } finally {
      set({ isUpdatingBanStatus: false });
  }
},

 // Promote/Demote User Function
promoteDemoteToModerator: async ({ input, promote, actionBy }) => {
  set({ isUpdatingRole: true });

  try {
    const res = await axiosInstance.post('/api/v1/op/promotedemotetomoderator', {
      input,
      promote,
      actionBy,
    });

    toast.success(`User ${promote ? 'promoted' : 'demoted'} successfully`);
    return res.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    const errorMessage = error.response?.data?.message || "Failed to update user role";
    toast.error(errorMessage);
  } finally {
    set({ isUpdatingRole: false });
  }
},

promoteDemoteToAdmin: async ({ input, promote, actionBy }) => {
  set({ isUpdatingRole: true });

  try {
    const res = await axiosInstance.post("/api/v1/op/promotedemotetoadmin", {
      input,
      promote,
      actionBy,
    });

    toast.success(`User ${promote ? "promoted to admin" : "demoted to normal user"} successfully`);
    return res.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    const errorMessage = error.response?.data?.message || "Failed to update user role";
    toast.error(errorMessage);
  } finally {
    set({ isUpdatingRole: false });
  }
},










  // Function to create a suggestion
createSuggestion: async (data) => {
  try {
    const res = await axiosInstance.post('/api/v1/suggestions/create', data);
    console.log("✅ Suggestion Created:", res.data);
    toast.success("Suggestion submitted successfully");
  } catch (error) {
    console.error("❌ Error in createSuggestion:", error);
    const errorMessage = error.response?.data?.message || "Failed to create suggestion";
    toast.error(errorMessage);
  }
},

// Function to get all suggestions
fetchSuggestions: async () => {
  try {
    const res = await axiosInstance.get('/api/v1/suggestions');
    console.log("📌 Fetched Suggestions:", res.data.data);
    set({ suggestions: res.data.data });
  } catch (error) {
    console.error("❌ Error in fetchSuggestions:", error);
    toast.error("Failed to load suggestions");
  }
},

// Function to get a single suggestion by ID
fetchSuggestionById: async (id) => {
  try {
    const res = await axiosInstance.get(`/api/v1/suggestions/${id}`);
    console.log("📌 Fetched Suggestion:", res.data);
    set({ selectedSuggestion: res.data.suggestion });
  } catch (error) {
    console.error("❌ Error in fetchSuggestionById:", error);
    toast.error("Failed to load suggestion details");
  }
},

// Function to like a suggestion
likeSuggestion: async (id) => {
  const { authUser } = get();
  if (!authUser?.data?.user?._id) {
    toast.error("You must be logged in to like a suggestion");
    return;
  }

  try {
    await axiosInstance.post(`/api/v1/suggestions/${id}/like`, { userId: authUser.data.user._id });
    console.log("👍 Suggestion Like Toggled");
    toast.success("Like updated successfully");
    get().fetchSuggestions(); // Refresh the list
  } catch (error) {
    console.error("❌ Error in likeSuggestion:", error);
    toast.error(error.response?.data?.message || "Failed to update like");
  }
},


// Update Suggestion
updateSuggestion: async ({ id, title, category, description }) => {
  set({ isUpdatingSuggestion: true });

  try {
    const res = await axiosInstance.put(`/api/v1/suggestions/updatesuggestion/${id}`, {
      title,
      category,
      description,
    });

    toast.success("Suggestion updated successfully");
    return res.data;
  } catch (error) {
    console.error("Error updating suggestion:", error);
    const errorMessage = error.response?.data?.message || "Failed to update suggestion";
    toast.error(errorMessage);
  } finally {
    set({ isUpdatingSuggestion: false });
  }
},

// Delete Suggestion
deleteSuggestion: async (id) => {
  set({ isDeletingSuggestion: true });

  try {
    await axiosInstance.delete(`api/v1/suggestions/deletesuggestion/${id}`);
    toast.success("Suggestion deleted successfully");
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    const errorMessage = error.response?.data?.message || "Failed to delete suggestion";
    toast.error(errorMessage);
  } finally {
    set({ isDeletingSuggestion: false });
  }
},





// Update the fetchOpStats function:
fetchOpStats: async (range = 'daily') => {
  try {
    const res = await axiosInstance.get(`/api/v1/op/stats?range=${range}`);
    console.log("📊 OP Stats Fetched:", res.data);
    set({ opStats: res.data });
  } catch (error) {
    console.error("❌ Error fetching OP stats:", error);
    toast.error("Failed to fetch OP stats");
  }
},





submitContact: async ({ name, email, subject, message, isExistingUser }) => {
  set({ isSubmitting: true });

  try {
    const res = await axiosInstance.post("/api/v1/contact/submit", {
      name,
      email,
      subject,
      message,
      isExistingUser,
    });

    toast.success("Contact request submitted successfully");
    return res.data;
  } catch (error) {
    console.error("Error submitting contact:", error);
    const errorMessage = error.response?.data?.message || "Failed to submit contact request";
    toast.error(errorMessage);
  } finally {
    set({ isSubmitting: false });
  }
},

// Fetch Contacts (Admin)
fetchContacts: async ({ email, contactCompleted }) => {
  set({ isLoading: true });

  try {
    let query = "/api/v1/contact/get";
    if (email || contactCompleted !== undefined) {
      query += `?${email ? `email=${email}&` : ""}${contactCompleted !== undefined ? `contactCompleted=${contactCompleted}` : ""}`;
    }

    const res = await axiosInstance.get(query);
    set({ contacts: res.data.data });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    toast.error("Failed to fetch contacts");
  } finally {
    set({ isLoading: false });
  }
},

// Update Contact Status (Admin)
updateContactStatus: async (id, contactCompleted) => {
  set({ isUpdating: true });

  try {
    await axiosInstance.put(`/api/v1/contact/update/${id}`, { contactCompleted });

    // Optimistically update state
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact._id === id ? { ...contact, contactCompleted } : contact
      ),
    }));

    toast.success("Contact status updated successfully");
  } catch (error) {
    console.error("Error updating contact status:", error);
    toast.error("Failed to update contact status");
  } finally {
    set({ isUpdating: false });
  }
},


// Fetch User Info Rules
fetchUserInfoRules: async (userId) => {
  set({ isLoading: true });

  try {
    const res = await axiosInstance.post("/api/v1/op/user-info-rules", { userId });

    set({ userInfoRules: res.data.data });
    toast.success("User info rules fetched successfully");
  } catch (error) {
    console.error("Error fetching user info rules:", error);
    const errorMessage = error.response?.data?.message || "Failed to fetch user info rules";
    toast.error(errorMessage);
  } finally {
    set({ isLoading: false });
  }
},

// Update User Info Rules
updateUserInfoRules: async (updateData) => {
  set({ isUpdating: true });

  try {
    const res = await axiosInstance.patch("/api/v1/op/update-user-info-rules", updateData);

    set({ userInfoRules: res.data.data });
    toast.success("User info rules updated successfully");
  } catch (error) {
    console.error("Error updating user info rules:", error);
    const errorMessage = error.response?.data?.message || "Failed to update user info rules";
    toast.error(errorMessage);
  } finally {
    set({ isUpdating: false });
  }
},


fetchPublicUserInfoRules: async () => {
  set({ isLoading: true });

  try {
    const res = await axiosInstance.get("/api/v1/op/public-user-info-rules");

    set({ userInfoRules: res.data.data });
    toast.success("Public user info rules fetched successfully");
  } catch (error) {
    console.error("Error fetching public user info rules:", error);
    const errorMessage = error.response?.data?.message || "Failed to fetch public user info rules";
    toast.error(errorMessage);
  } finally {
    set({ isLoading: false });
  }
},





// New actions for friend management
  fetchFriends: async () => {
    set({ isFetchingFriends: true });
    const { authUser } = get();
    if (!authUser?.data?.user?._id) {
      set({ isFetchingFriends: false });
      toast.error("You must be logged in to fetch friends");
      return;
    }
    try {
      const res = await axiosInstance.get(`/api/v1/friend/listFriends/${authUser.data.user._id}`);
      set({ friends: res.data.friends });
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error(error.response?.data?.message || "Failed to fetch friends");
    } finally {
      set({ isFetchingFriends: false });
    }
  },

  fetchFriendRequests: async () => {
    set({ isFetchingFriendRequests: true });
    const { authUser } = get();
    if (!authUser?.data?.user?._id) {
      set({ isFetchingFriendRequests: false });
      toast.error("You must be logged in to fetch friend requests");
      return;
    }
    try {
      const res = await axiosInstance.get(`/api/v1/friend/requests/${authUser.data.user._id}`);
      set({ friendRequests: res.data.friendRequests });
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      toast.error(error.response?.data?.message || "Failed to fetch friend requests");
    } finally {
      set({ isFetchingFriendRequests: false });
    }
  },

  sendFriendRequest: async (receiverId) => {
    const { authUser } = get();
    if (!authUser?.data?.user?._id) {
      toast.error("You must be logged in to send a friend request");
      return;
    }
    try {
      await axiosInstance.post('/api/v1/friend/request', {
        senderId: authUser.data.user._id,
        receiverId,
      });
      toast.success("Friend request sent successfully");
      // Note: No immediate state update here; receiver's friendRequests will update via API/server
    } catch (error) {
      console.error("Error sending friend request:", error);
      const errorMessage = error.response?.data?.message || "Failed to send friend request";
      toast.error(errorMessage);
    }
  },

  acceptFriendRequest: async (senderId) => {
    const { authUser } = get();
    if (!authUser?.data?.user?._id) {
      toast.error("You must be logged in to accept a friend request");
      return;
    }
    try {
      await axiosInstance.post('/api/v1/friend/accept', {
        senderId,
        receiverId: authUser.data.user._id,
      });
      toast.success("Friend request accepted successfully");
      // Refetch friends and friend requests to reflect the updated state
      get().fetchFriends();
      get().fetchFriendRequests();
    } catch (error) {
      console.error("Error accepting friend request:", error);
      const errorMessage = error.response?.data?.message || "Failed to accept friend request";
      toast.error(errorMessage);
    }
  },

  rejectFriendRequest: async (senderId) => {
    const { authUser } = get();
    if (!authUser?.data?.user?._id) {
      toast.error("You must be logged in to reject a friend request");
      return;
    }
    try {
      await axiosInstance.post('/api/v1/friend/reject', {
        senderId,
        receiverId: authUser.data.user._id,
      });
      toast.success("Friend request rejected successfully");
      // Refetch friend requests to reflect the updated state
      get().fetchFriendRequests();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      const errorMessage = error.response?.data?.message || "Failed to reject friend request";
      toast.error(errorMessage);
    }
  },

  removeFriend: async (friendId) => {
    const { authUser } = get();
    if (!authUser?.data?.user?._id) {
      toast.error("You must be logged in to remove a friend");
      return;
    }
    try {
      await axiosInstance.delete('/api/v1/friend/remove', {
        data: {
          userId: authUser.data.user._id,
          friendId,
        },
      });
      toast.success("Friend removed successfully");
      // Refetch friends to reflect the updated state
      get().fetchFriends();
    } catch (error) {
      console.error("Error removing friend:", error);
      const errorMessage = error.response?.data?.message || "Failed to remove friend";
      toast.error(errorMessage);
    }
  },

























  
  socket: null,
  messages: [],
  activeChatRoom: null,
  unreadMessagesBySender: {},
  currentUserId: null,
  messagesByRoom: {},
  

  connectSocket: () => {
    const { socket } = get();
    if (socket) return;

    const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("🟢 Connected to Socket.io server:", newSocket.id);
    });

    // Load stored unread messages
    try {
      const storedUnread = JSON.parse(localStorage.getItem("unreadMessagesBySender") || "{}");
      set({ unreadMessagesBySender: storedUnread });
    } catch (error) {
      console.error("Error loading stored unread messages:", error);
    }

    // Handle chat history
    newSocket.on("chatHistory", (data) => {
      set((state) => {
        const existingMessages = state.messagesByRoom[data.roomId] || [];
        const historyIds = new Set(data.history.map((msg) => msg._id));
        const mergedMessages = [
          ...existingMessages.filter((msg) => !historyIds.has(msg._id)),
          ...data.history,
        ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        return {
          messagesByRoom: {
            ...state.messagesByRoom,
            [data.roomId]: mergedMessages,
          },
          activeChatRoom: data.roomId,
        };
      });
    });

    // Handle new messages with checks
    newSocket.on("newMessage", (data) => {
      const { messagesByRoom, activeChatRoom, currentUserId, unreadMessagesBySender } = get();

    console.log("Store received newMessage:", {
      room: data.room,
      activeChatRoom,
      sender: data.sender,
      currentUserId,
      });

     // Check 1: Prevent duplicate messages
    const roomMessages = messagesByRoom[data.room] || [];
    if (roomMessages.some((msg) => msg._id === data._id)) {
      console.log("Duplicate message detected, skipping:", data._id);
      return;
    }

    // Check 2: Validate room ID format (optional, for robustness)
    if (!data.room || typeof data.room !== "string" || !data.room.includes("_")) {
      console.log("Invalid room ID, skipping:", data.room);
      return;
    }

     // Check 3: Add message to the correct room
    set((state) => ({
      messagesByRoom: {
        ...state.messagesByRoom,
        [data.room]: [...roomMessages, data],
      },
    }));

     // Check 4: Skip unread increment for self-messages
    if (data.sender === currentUserId) {
      console.log("Message from self, added to room:", data.room);
      return;
    }

      // Check 5: Update unread count if not active chat room
    if (data.room !== activeChatRoom) {
      console.log("Message for another room, incrementing unread:", data.sender);
      set((state) => {
        const newUnreadMessagesBySender = {
          ...state.unreadMessagesBySender,
          [data.sender]: (state.unreadMessagesBySender[data.sender] || 0) + 1,
        };
        localStorage.setItem("unreadMessagesBySender", JSON.stringify(newUnreadMessagesBySender));
        return { unreadMessagesBySender: newUnreadMessagesBySender };
      });
    } else {
      console.log("Message for active chat room, no unread increment:", data);
    }

      
    });

    // Handle message delivered
    newSocket.on("messageDelivered", (data) => {
      set((state) => {
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
    });

    // Handle messages read
    newSocket.on("messagesRead", (data) => {
      set((state) => {
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
    });

    set({ socket: newSocket });
  },
  
  
  sendMessage: (message, roomId) => {
    const { socket, activeChatRoom, currentUserId } = get();
    const targetRoom = roomId || activeChatRoom;
    if (socket && targetRoom && currentUserId) {
      socket.emit("message", { roomId: targetRoom, message, sender: currentUserId });
    } else {
      toast.error("Cannot send message: Chat not properly initialized");
    }
  },

  setActiveChatRoom: (roomId) => set({ activeChatRoom: roomId }),

  setCurrentUserId: (userId) => set({ currentUserId: userId }),

  markMessagesAsReadForSender: (senderId) => {
    set((state) => {
      const newUnreadMessagesBySender = {
        ...state.unreadMessagesBySender,
        [senderId]: 0,
      };
      localStorage.setItem("unreadMessagesBySender", JSON.stringify(newUnreadMessagesBySender));
      return { unreadMessagesBySender: newUnreadMessagesBySender };
    });
  },

  setActiveChatRoom: (roomId) => {
    set({ activeChatRoom: roomId });
  },

  setCurrentUserId: (userId) => {
    set({ currentUserId: userId });
  },

  

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },


  
  

}));


