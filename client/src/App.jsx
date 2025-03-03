import React, { useState, useEffect,useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './componenst/Navbar';
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
import LandingPage from './pages/MainWebPage/LandingPage.jsx';

function App() {
  const { authUser, checkAuth, isCheckingAuth,  isKing , isAdmin , isModrater , checkOpUser } = useAuthStore();
  const location = useLocation();


  // Fetch authUser data on initial load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  

  
  // Show loader while checking authUser status
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  

  return (
    <div className="">
      {authUser && <Navbar />}
      <main className="">
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/home" element={<LandingPage/>} />
          <Route path="/op">
            <Route
              path="config-user-info-rules"
              element={isAdmin || isKing ? <ConfigRulesPage /> : <Navigate to="/" /> }
            />
          </Route>
        </Routes>
        <Toaster />
      </main>
    </div>
  );
}

export default App;
