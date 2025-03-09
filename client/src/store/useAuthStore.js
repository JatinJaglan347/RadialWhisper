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

  // Function to check if the user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/api/v1/user/checkAuth');

      console.log("check Auth API");

      set({ authUser: res.data });
      const { authUser } = get();
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
      toast.error("Failed to fetch user details");
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
      toast.success("Logged in successfully");
    } catch (error) {
      console.error(error);  // Log the entire error object to the console
      const errorMessage = error.response?.data?.message || "Failed to log in";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
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

































  authUser: null,
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
