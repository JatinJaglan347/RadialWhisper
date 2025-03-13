import React, { useState, useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
// import Navbar from './components/Navbar.jsx';

import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore.js';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import ConfigRulesPage from './pages/dashboard/ConfigRulesPage.jsx';
import toast from 'react-hot-toast';
import LandingNavbar from './components/MainWebPage/LandingNavbar.jsx';
import Navbar from './components/Navbar.jsx';
import LandingHome from './pages/MainWebPage/LandingHome.jsx';
import LandingAbout from './pages/MainWebPage/LandingAbout.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LandingContact from './pages/MainWebPage/LandingContact.jsx';
import LandingSuggestion from './pages/MainWebPage/LandingSuggestion.jsx';
// import LandingNavbar from './componenst/MainWebPage/LandingNavbar.js';

function App() {
  const { authUser, checkAuth, isCheckingAuth, isKing, isAdmin, isModrater, checkOpUser } = useAuthStore();
  const location = useLocation();
  
  // Fetch authUser data on initial load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Check if current path starts with /chat
  const isChatRoute = location.pathname.startsWith('/chat') || location.pathname.startsWith('/op');
  
  // Show loader while checking authUser status
  if (isChatRoute && !authUser){
    toast.error("Login required to access!");
  }
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  
  return (
    <div className="">
      {/* Conditionally render navbar based on route */}
      {isChatRoute ? 
        (authUser && <Navbar/>) : 
        <LandingNavbar/>
      }
      
      <main className="">
        <Routes>
          {/* Main landing pages */}
          <Route path="/" element={<LandingHome/>} />
          <Route path="/about" element={<LandingAbout/>} />
          <Route path="/contact" element={<LandingContact/>} />
          <Route path="/suggestion" element={<LandingSuggestion/>} />
          
          {/* Authentication routes at root level */}
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/chat" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/chat" />} />
          
          {/* Chat related routes */}
          <Route path="/chat" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          
          {/* Admin routes */}
          <Route path="/op">
            <Route
              path="config-user-info-rules"
              element={isAdmin || isKing ? <ConfigRulesPage /> : <Navigate to="/" /> }
            />
          </Route>

          {/* 404 Not Found - this catches all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </main>
    </div>
  );
}

export default App;