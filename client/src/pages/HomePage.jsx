import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore'; // Zustand store
import { User as UserIcon } from 'lucide-react'; // Lucide icons
import toast from 'react-hot-toast';
// Helper function to ensure the value is an array
const ensureArray = (data) => {
  return Array.isArray(data) ? data : [];
};

const HomePage = () => {
  const { authUser, fetchNearbyUsers, nearbyUsersData, isFetchingNearbyUsers } = useAuthStore();
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  // Use the helper function to ensure nearbyUsers is an array
  const arrayOfNearbyUserData = ensureArray(nearbyUsersData?.data?.nearbyUsers);

  // Function to fetch location with geolocation API
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Call the fetchNearbyUsers function to get users within the radius
          fetchNearbyUsers(latitude, longitude);
          setIsLocationFetched(true);
        },
        (error) => {
          console.error("Error fetching location:", error);
          // Check if location permission is denied
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermissionDenied(true);  // Set state to show the prompt
            toast.error("Location permission denied. Please allow location access.");
          } else {
            toast.error("Failed to fetch location. Please try again.");
          }
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  // Run this effect when the component is mounted
  useEffect(() => {
    // Check if user is authenticated and has details
    if (!authUser) {
      toast.error("User not authenticated");
      return;
    }

    // If location permission is denied, prompt the user to allow location
    if (locationPermissionDenied) {
      toast.error("Location permission denied. Please enable location access in your browser settings.");
      return;
    }

    // Fetch the user's current location when the component is mounted
    fetchLocation();
  }, [authUser, fetchNearbyUsers, locationPermissionDenied]);

  // Log the nearbyUsersData whenever they change
  useEffect(() => {
    
  
    // Log the nearby users array
    console.log("Nearby Users from frontend:", arrayOfNearbyUserData);
  
    // Check if `x` is defined and an array before accessing its length
    
      console.log("Number of nearby users:", arrayOfNearbyUserData.length);  // Prints the length of the array
    
  }, [nearbyUsersData]);
  return (
    <div className="home-page container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Users</h1>

      {/* Loading State */}
      {isFetchingNearbyUsers && <div>Loading nearby users...</div>}

      {/* Error State */}
      {!isLocationFetched && !isFetchingNearbyUsers && (
        <div>No location data available. Please try again later.</div>
      )}

      {/* Display Nearby Users */}
      {arrayOfNearbyUserData.length > 0 ? (
        <div className="user-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {arrayOfNearbyUserData.map((user) => (
            <div key={user._id} className="user-card border p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <img
                  src={user.profileImageURL || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="user-details">
                  <h3 className="font-semibold text-lg">{user.fullName}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No nearby users found.</div>
      )}

      {/* Display prompt to ask the user to allow location access if it was denied */}
      {locationPermissionDenied && (
        <div className="alert alert-warning mt-4">
          <p>Location permission was denied. Please enable location access in your browser settings to find nearby users.</p>
          <button
            onClick={() => {
              setLocationPermissionDenied(false);  // Reset permission state
              fetchLocation();  // Try fetching location again
            }}
            className="btn btn-primary mt-2"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
