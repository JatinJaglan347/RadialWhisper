import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore'; // Zustand store
import toast from 'react-hot-toast';

const HomePage = () => {
  const { authUser, fetchNearbyUsers, nearbyUsersData, isFetchingNearbyUsers } = useAuthStore();
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  
  const isInitialFetchDone = useRef(false); // Track if the initial fetch is done

  const arrayOfNearbyUserData = Array.isArray(nearbyUsersData?.data?.nearbyUsers)
    ? nearbyUsersData?.data?.nearbyUsers
    : [];

  // Function to fetch user's current location
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

  const refreshtime = 1000000
  // Call `fetchNearbyUsers` every 10 seconds when location is available
  useEffect(() => {
    if (location.latitude && location.longitude && !isInitialFetchDone.current) {
      // Call immediately on initial render
      fetchNearbyUsers(location);
      isInitialFetchDone.current = true; // Mark initial fetch as done
    }

    // Set interval to call `fetchNearbyUsers` every 100,000ms (100 seconds)
    const fetchInterval = setInterval(() => {
      if (location.latitude && location.longitude) {
        fetchNearbyUsers(location);
      }
    }, refreshtime); // 100 seconds

    

    return () => clearInterval(fetchInterval); // Cleanup interval on component unmount
  }, [location]); // Depend on `location` to re-trigger only when it changes

  // Fetch location on component mount and when permission is not denied
  useEffect(() => {
    if (authUser && !locationPermissionDenied) {
      fetchLocation();
    }
  }, [authUser, locationPermissionDenied]);

  return (
    <div className="home-page container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Users</h1>

      {/* Loading State */}
      {isFetchingNearbyUsers && <div>Loading nearby users...</div>}

      {/* Error State */}
      {!isFetchingNearbyUsers && arrayOfNearbyUserData.length === 0 && (
        <div>No nearby users found. Please try again later.</div>
      )}

      {/* Display Nearby Users */}
      {arrayOfNearbyUserData.length > 0 && (
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
      )}

      {/* Handle Location Permission Denial */}
      {locationPermissionDenied && (
        <div className="alert alert-warning mt-4">
          <p>
            Location permission was denied. Please enable location access in your browser settings to find nearby
            users.
          </p>
          <button
            onClick={() => {
              setLocationPermissionDenied(false); // Reset permission state
              fetchLocation(); // Retry fetching location
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
