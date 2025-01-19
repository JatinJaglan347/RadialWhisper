import { create } from 'zustand';
import { axiosInstance } from '../lib/axios'; // axios instance for API calls
import toast from 'react-hot-toast';
import { checkAuth } from '../../../server/src/controllers/user.controller';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isOpUser: false,
  isSigninUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isFetchingNearbyUsers: false, // State to track the loading of nearby users
  nearbyUsersData: [], // State to store nearby users

  // Function to check if the user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/api/v1/user/checkAuth');

      console.log("check Auth API");

      set({ authUser: res.data });
    } catch (err) {
      console.error("Error in checkAuth:", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  checkOp: async () => {
    await checkAuth();
    const userRole = get().authUser?.userRole;
   
    if (userRole === 'admin' || userRole === 'king') {
      set({ isOpUser: true });
    }else{
      toast.error("You are not authorized to access this page");
      set({ isOpUser: false });
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

  // Function to fetch nearby users based on the user's current location
  // fetchNearbyUsers: async () => {
  //   set({ isFetchingNearbyUsers: true });
  
  //   try {
  //     // Use get() to access the current state
  //     const { authUser } = get(); // Correctly use `get()` to access the current state
  
  //     // Log the authUser to see the data structure and its contents


  //     // console.log("authUser data:", authUser);
  //     // console.log("Location Radius Preference:", authUser?.data?.user?.locationRadiusPreference);
  //     console.log("Fetch NearbyUsers API");

  //     // Check if currentLocation and locationRadiusPreference are available
  //     if (!authUser?.data?.user?.currentLocation?.coordinates || !authUser?.data?.user?.locationRadiusPreference) {
  //       // Log if any of the data is missing
  //       console.error("Missing location or radius preference");
  //       toast.error("Location or radius preference not available");
  //       set({ isFetchingNearbyUsers: false });
  //       return;
  //     }
  
  //     // Log currentLocation and locationRadiusPreference
  //     // console.log("Current Location:", authUser?.data?.user?.currentLocation);
      
  
  //     const { coordinates } = authUser?.data?.user?.currentLocation; // Destructure to get coordinates
  //     const radius = authUser?.data?.user?.locationRadiusPreference; // Get radius


  //     // console.log("coordinates" ,coordinates);


  //     // Proceed with API call to fetch nearby users
  //     const res = await axiosInstance.post('/api/v1/user/nearbyUsers', {
  //       latitude: coordinates[1],  // latitude (coordinates[1] corresponds to latitude)
  //       longitude: coordinates[0], // longitude (coordinates[0] corresponds to longitude)
  //       radius: radius,            // radius
  //     });
  
  //     // Log the response data for nearby users
  //     // console.log("Nearby Users:", res.data); 
  
  //     // Update Zustand state with fetched nearby users
  //     set({ nearbyUsersData: res.data});
  
  //   } catch (err) {
  //     // Log any errors encountered during the process
  //     console.error("Error in fetchNearbyUsers:", err);
  //     toast.error("Failed to fetch nearby users");
  //   } finally {
  //     // Stop fetching state after the API call is complete
  //     set({ isFetchingNearbyUsers: false });
  //   }
  // }

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
  }
  
  

  // Add any additional actions as needed
}));
