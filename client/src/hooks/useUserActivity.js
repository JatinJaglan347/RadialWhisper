// client/src/hooks/useUserActivity.js
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useUserActivity = () => {
  const { authUser, socket, updateActivityStatus } = useAuthStore();
  const inactivityTimeoutRef = useRef(null);
  // This ref holds the last known status: true means active, false means inactive.
  const currentStatusRef = useRef(null);
  // For testing we use 1 minute; you can change this to 5 minutes (5*60*1000) for production.
  const INACTIVITY_LIMIT = 1 * 60 * 1000; 

  // Reset the inactivity timer and update status only if it has changed.
  const resetTimer = () => {
    // Clear any existing timer
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    // If user is not already marked active, update to active.
    if (authUser?.data?.user?._id && currentStatusRef.current !== true) {
      updateActivityStatus(true, new Date());
      if (socket) {
        socket.emit('userActive', { userId: authUser.data.user._id });
      }
      currentStatusRef.current = true;
    }

    // Set timer to mark inactive after the inactivity limit.
    inactivityTimeoutRef.current = setTimeout(() => {
      if (authUser?.data?.user?._id && currentStatusRef.current !== false) {
        updateActivityStatus(false, new Date());
        if (socket) {
          socket.emit('userInactive', { userId: authUser.data.user._id });
        }
        currentStatusRef.current = false;
      }
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    // Debounce function to "smooth" rapid-fire events.
    let debounceTimeout = null;
    const debouncedReset = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        resetTimer();
      }, 300); // 300ms debounce delay
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, debouncedReset));

    // Set the initial timer immediately.
    resetTimer();

    // Add unload listener to send a beacon when the tab is closed.
    const handleBeforeUnload = () => {
      if (authUser?.data?.user?._id) {
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/update-activity`;
        const data = new FormData();
        data.append('userId', authUser.data.user._id);
        data.append('isActive', 'false');
        data.append('lastActive', new Date().toISOString());
        navigator.sendBeacon(url, data);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      events.forEach((event) => window.removeEventListener(event, debouncedReset));
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [authUser, socket, updateActivityStatus]);

  return null; // This hook doesn't render anything.
};
