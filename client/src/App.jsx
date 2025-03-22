// import React, { useState, useEffect, useRef } from 'react';
// import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
// // import Navbar from './components/Navbar.jsx';

// import HomePage from './pages/HomePage';
// import SignUpPage from './pages/SignUpPage';
// import LoginPage from './pages/LoginPage';
// import SettingsPage from './pages/SettingsPage';
// import ProfilePage from './pages/ProfilePage';
// import { useAuthStore } from './store/useAuthStore.js';
// import { Loader } from 'lucide-react';
// import { Toaster } from 'react-hot-toast';
// import ConfigRulesPage from './pages/ModerationPages/ConfigRulesPage.jsx';
// import toast from 'react-hot-toast';
// import LandingNavbar from './components/MainWebPage/LandingNavbar.jsx';
// import Navbar from './components/Navbar.jsx';
// import LandingHome from './pages/MainWebPage/LandingHome.jsx';
// import LandingAbout from './pages/MainWebPage/LandingAbout.jsx';
// import NotFoundPage from './pages/NotFoundPage.jsx';
// import LandingContact from './pages/MainWebPage/LandingContact.jsx';
// import LandingSuggestion from './pages/MainWebPage/LandingSuggestion.jsx';
// import DashboardPage from './pages/ModerationPages/DashboardPage.jsx';
// // import LandingNavbar from './componenst/MainWebPage/LandingNavbar.js';

// function App() {
//   const { authUser, checkAuth, isCheckingAuth, isKing, isAdmin, isModrater, checkOpUser } = useAuthStore();
//   const location = useLocation();
  
//   // Fetch authUser data on initial load
//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);
  
//   // Check if current path starts with /chat
//   const isChatRoute = location.pathname.startsWith('/chat') || location.pathname.startsWith('/op');
  
//   // Show loader while checking authUser status
//   if (isChatRoute && !authUser){
//     toast.error("Login required to access!");
//   }
//   if (isCheckingAuth && !authUser)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader className="size-10 animate-spin" />
//       </div>
//     );
  
//   return (
//     <div className="">
//       {/* Conditionally render navbar based on route */}
//       {isChatRoute ? 
//         (authUser && <Navbar/>) : 
//         <LandingNavbar/>
//       }
      
//       <main className="">
//         <Routes>
//           {/* Main landing pages */}
//           <Route path="/" element={<LandingHome/>} />
//           <Route path="/about" element={<LandingAbout/>} />
//           <Route path="/contact" element={<LandingContact/>} />
//           <Route path="/suggestion" element={<LandingSuggestion/>} />
          
//           {/* Authentication routes at root level */}
//           <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/chat" />} />
//           <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/chat" />} />
          
//           {/* Chat related routes */}
//           <Route path="/chat" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
//           <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
//           <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          
//           {/* Admin routes */}
//           <Route path="/op">
//             <Route
//               path="config-user-info-rules"
//               element={isAdmin || isKing ? <ConfigRulesPage /> : <Navigate to="/" /> }
//             />
//             <Route
//               path="dashboard"
//               element={isAdmin || isKing ? <DashboardPage/> : <Navigate to="/" /> }
//             />
//           </Route>

//           {/* 404 Not Found - this catches all unmatched routes */}
//           <Route path="*" element={<NotFoundPage />} />
//         </Routes>
//         <Toaster />
//       </main>
//     </div>
//   );
// }

// export default App;


















import React, { useState, useEffect } from 'react';
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
import ConfigRulesPage from './pages/ModerationPages/ConfigRulesPage.jsx';
import toast from 'react-hot-toast';
import LandingNavbar from './components/MainWebPage/LandingNavbar.jsx';
import Navbar from './components/Navbar.jsx';
// import ModerationNavbar from './components/ModerationNavbar.jsx';
import LandingHome from './pages/MainWebPage/LandingHome.jsx';
import LandingAbout from './pages/MainWebPage/LandingAbout.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LandingContact from './pages/MainWebPage/LandingContact.jsx';
import LandingSuggestion from './pages/MainWebPage/LandingSuggestion.jsx';
import DashboardPage from './pages/ModerationPages/DashboardPage.jsx';
// Admin Panel Pages (import placeholders - you'll need to create these)
// import ManageUsersPage from './pages/ModerationPages/ManageUsersPage.jsx';
// import ManageModeratorsPage from './pages/ModerationPages/ManageModeratorsPage.jsx';
// import BanUnbanUsersPage from './pages/ModerationPages/BanUnbanUsersPage.jsx';
// import ManageSuggestionsPage from './pages/ModerationPages/ManageSuggestionsPage.jsx';
// import ManageReportsPage from './pages/ModerationPages/ManageReportsPage.jsx';
// import ManageContactsPage from './pages/ModerationPages/ManageContactsPage.jsx';
import ModerationNavbar, { SidebarContext } from './components/ModerationComponents/ModerationNavbar.jsx';
import ManageUsersPage from './pages/ModerationPages/ManageUsersPage.jsx';
import ModerateUser from './components/ModerationComponents/ModerateUser.jsx';
import ManageModeratorsPage from './pages/ModerationPages/ManageModeratorsPage.jsx';
import ManageBansPage from './pages/ModerationPages/ManageBansPage.jsx';
import ManageSuggestionsPage from './pages/ModerationPages/ManageSuggestionsPage.jsx';
import ManageContactsPage from './pages/ModerationPages/ManageContactsPage.jsx';
import ManageAdminsPage from './pages/ModerationPages/ManageAdminsPage.jsx';
import PremiumPlan from './pages/PremiumPlan.jsx';
import LandingFooter from './components/MainWebPage/LandingFooter.jsx';
// import LandingNavbar from './componenst/MainWebPage/LandingNavbar.js';

function App() {
  const { authUser, checkAuth, isCheckingAuth, isKing, isAdmin, isModrater, checkOpUser } = useAuthStore();
  const location = useLocation();
  
  // Sidebar state
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Fetch authUser data on initial load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Check if current path starts with /chat or /op
  const isChatRoute = location.pathname.startsWith('/chat') || location.pathname.startsWith('/op');
  const isAdminRoute = location.pathname.startsWith('/op');
  
  // Check admin privileges for /op routes
  useEffect(() => {
    if (isAdminRoute && authUser) {
      checkOpUser();
    }
  }, [isAdminRoute, authUser, checkOpUser]);
  
  // Show loader while checking authUser status
  if (isChatRoute && !authUser){
    toast.error("Login required to access!");
  }
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen ">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  
  // Check if user has admin access for /op routes
  const hasAdminAccess = isAdmin || isKing || isModrater;

  // Handle sidebar state changes
  const handleSidebarStateChange = (isCollapsed) => {
    setIsNavbarCollapsed(isCollapsed);
  };
  
  // Handle mobile menu state changes
  const handleMobileMenuChange = (isOpen) => {
    setShowMobileMenu(isOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar - Choose between regular and landing navbar */}
      <div 
  className={`
    flex-1 transition-all duration-300 w-full
    ${isMobile ? 'px-2' : 'px-4'} 
    ${isAdminRoute && hasAdminAccess && !isMobile ? 'admin-main' : ''}
  `}
  style={{ 
    marginLeft: isAdminRoute && hasAdminAccess && !isMobile
      ? (isNavbarCollapsed ? '4rem' : '16rem') 
      : '0',
    width: isMobile ? '100vw' : 'auto',
    padding: '0' // Remove any padding
  }}
>
  {isChatRoute && authUser ? <Navbar /> : <LandingNavbar />}
</div>
      
      {/* Content area with potential admin sidebar */}
      <div className="flex flex-1 relative">
        {/* Admin sidebar for /op routes */}
        {isAdminRoute && authUser && hasAdminAccess && (
          <SidebarContext.Provider value={{ 
            isCollapsed: isNavbarCollapsed, 
            sidebarWidth: '16rem', 
            collapsedWidth: '4rem',
            isMobile: isMobile,
            showMobileMenu: showMobileMenu,
            onCollapsedChange: handleSidebarStateChange,
            onMobileMenuChange: handleMobileMenuChange
          }}>
            {/* <div className="fixed top-[var(--navbar-height)] left-0 h-[calc(100vh-var(--navbar-height))] z-20"> */}
              <ModerationNavbar />
            {/* </div> */}
          </SidebarContext.Provider>
        )}
        
        {/* Main content area */}
        <main 
          className={`
            flex-1 transition-all duration-300 w-full
            ${isMobile ? 'px-2' : 'px-4'} 
            ${isAdminRoute && hasAdminAccess && !isMobile ? 'admin-main' : ''}
          `}
          style={{ 
            marginLeft: isAdminRoute && hasAdminAccess && !isMobile
              ? (isNavbarCollapsed ? '4rem' : '16rem') 
              : '0',
            width: isMobile ? '100vw' : 'auto',
            padding: '0' // Remove any padding
          }}
        >
          <Routes>
            {/* Main landing pages */}
            <Route path="/" element={<LandingHome/>} />
            <Route path="/about" element={<LandingAbout/>} />
            <Route path="/contact" element={<LandingContact/>} />
            <Route path="/suggestion" element={<LandingSuggestion/>} />
            <Route path="/premium" element={<PremiumPlan/>} />
            
            {/* Authentication routes at root level */}
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/chat" />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/chat" />} />
            
            {/* Chat related routes */}
            <Route path="/chat" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/chat/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
            <Route path="/chat/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            {/* <Route path="/modrateUser" element={<ModerateUser/>} /> */}
            {/* Admin routes */}
            <Route path="/op">
              {/* Dashboard route */}
              <Route
                index
                element={hasAdminAccess ? <DashboardPage/> : <Navigate to="/" />}
              />
              <Route
                path="dashboard"
                element={hasAdminAccess ? <DashboardPage/> : <Navigate to="/" />}
              />
              
              {/* User Management */}
              <Route
                path="users"
                element={hasAdminAccess ? <ManageUsersPage/> : <Navigate to="/" />}
              />
              
              {/* Moderator Management */}
              <Route
                path="moderators"
                element={hasAdminAccess ? <ManageModeratorsPage/>: <Navigate to="/" />}
              />
               {/* Admin Management */}
               <Route
                path="admins"
                element={hasAdminAccess ? <ManageAdminsPage/>: <Navigate to="/" />}
              />
              
              {/* Ban/Unban Management */}
              <Route
                path="bans"
                element={hasAdminAccess ? <ManageBansPage/> : <Navigate to="/" />}
              />
              
              {/* Suggestions Management */}
              <Route
                path="suggestions"
                element={hasAdminAccess ? <ManageSuggestionsPage/> : <Navigate to="/" />}
              />
              
              {/* Reports Management */}
              {/* <Route
                path="reports"
                element={hasAdminAccess ? <ManageReportsPage /> : <Navigate to="/" />}
              /> */}
              
              {/* Contact Management */}
              <Route
                path="contacts"
                element={hasAdminAccess ? <ManageContactsPage/> : <Navigate to="/" />}
              />
              
              {/* Config/Rules Management */}
              <Route
                path="config"
                element={hasAdminAccess ? <ConfigRulesPage /> : <Navigate to="/" />}
              />
            </Route>
            <Route path="*" element={location.pathname.includes("modrateUser") ? <ModerateUser /> : <NotFoundPage />} />
            {/* 404 Not Found - this catches all unmatched routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </main>
      </div>
      {!isChatRoute  ? <LandingFooter/> : null}
    </div>
  );
}

export default App;