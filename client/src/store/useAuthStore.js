import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
      const res = await axiosInstance.post('/api/v1/op/update-user-info-rules' ,data);
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

































  
  socket: null,
  messages: [],
  activeChatRoom: null,
  unreadMessagesBySender: {},
  currentUserId: null,

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

    try {
      const storedUnread = JSON.parse(localStorage.getItem('unreadMessagesBySender') || '{}');
      set({ unreadMessagesBySender: storedUnread });
    } catch (error) {
      console.error("Error loading stored unread messages:", error);
    }


    newSocket.on("newMessage", (data) => {
      console.log("📩 New message received:", data);
      
      const state = get();
      const { activeChatRoom, currentUserId } = state;
      
      // If I'm the sender, just add to messages
      if (data.sender === currentUserId) {
        set(state => ({ messages: [...state.messages, data] }));
        return;
      }
      
      // Always add to messages array
      set(state => ({ messages: [...state.messages, data] }));
      
      // Important change: Track unread messages for ALL senders except the active chat
      if (data.room !== activeChatRoom) {
        set(state => {
          const newUnreadMessagesBySender = {
            ...state.unreadMessagesBySender,
            [data.sender]: (state.unreadMessagesBySender[data.sender] || 0) + 1
          };
          
          // Save to localStorage for persistence
          localStorage.setItem('unreadMessagesBySender', JSON.stringify(newUnreadMessagesBySender));
          
          return { unreadMessagesBySender: newUnreadMessagesBySender };
        });
      } else {
        // Mark as read if this is the active chat
        if (get().socket) {
          get().socket.emit("markMessagesAsRead", { roomId: activeChatRoom });
        }
      }
    });


    newSocket.on("messageDelivered", (data) => {
      console.log("📩 Message delivery status updated:", data);
      set(state => ({
        messages: state.messages.map(msg => 
          msg._id === data.messageId ? { ...msg, status: 'delivered' } : msg
        )
      }));
    });

    newSocket.on("messagesRead", (data) => {
      console.log("📩 Messages marked as read:", data);
      set(state => ({
        messages: state.messages.map(msg => 
          (data.messageIds || []).includes(msg._id) ? { ...msg, status: 'read' } : msg
        )
      }));
    });

    set({ socket: newSocket });
  },

 
  markMessagesAsReadForSender: (senderId) => {
    set(state => {
   
      const newUnreadMessagesBySender = {
        ...state.unreadMessagesBySender,
        [senderId]: 0 // Reset count for this sender
      };
            localStorage.setItem('unreadMessagesBySender', JSON.stringify(newUnreadMessagesBySender));
      
      return { unreadMessagesBySender: newUnreadMessagesBySender };
    });
  },

  setActiveChatRoom: (roomId) => {
    set({ activeChatRoom: roomId });
  },

  setCurrentUserId: (userId) => {
    set({ currentUserId: userId });
  },

  sendMessage: (message) => {
    const { socket } = get();
    if (socket) {
      socket.emit("message", { text: message });
      console.log("📤 Message sent:", message);
    } else {
      console.warn("⚠️ Socket not connected!");
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },


  
  

}));


