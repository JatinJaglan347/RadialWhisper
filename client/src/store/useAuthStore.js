import { create } from 'zustand';
import { axiosInstance } from '../lib/axios'; // axios instance for API calls
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // Function to check if the user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/api/v1/user/checkAuth');
      set({ authUser: res.data });
    } catch (err) {
      console.error("Error in checkAuth:", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Function to get the user details from the API
  getUserDetails: async () => {
    try {
      const res = await axiosInstance.get('/api/v1/user/userDetails');
      console.log("Fetched User Details:", res.data);
       // Log the fetched user details to the console
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

  // Add any additional actions as needed
}));
