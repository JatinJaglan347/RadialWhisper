import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// import Navbar from './components/Navbar.jsx';

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore.js";
import { Ban, Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import ConfigRulesPage from "./pages/ModerationPages/ConfigRulesPage.jsx";
import toast from "react-hot-toast";
import LandingNavbar from "./components/MainWebPage/LandingNavbar.jsx";
import Navbar from "./components/Navbar.jsx";
// import ModerationNavbar from './components/ModerationNavbar.jsx';
import LandingHome from "./pages/MainWebPage/LandingHome.jsx";
import LandingAbout from "./pages/MainWebPage/LandingAbout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LandingContact from "./pages/MainWebPage/LandingContact.jsx";
import LandingSuggestion from "./pages/MainWebPage/LandingSuggestion.jsx";
import LandingTerms from "./pages/MainWebPage/LandingTerms.jsx";
import LandingPrivacy from "./pages/MainWebPage/LandingPrivacy.jsx";
import DashboardPage from "./pages/ModerationPages/DashboardPage.jsx";
// Admin Panel Pages (import placeholders - you'll need to create these)
// import ManageUsersPage from './pages/ModerationPages/ManageUsersPage.jsx';
// import ManageModeratorsPage from './pages/ModerationPages/ManageModeratorsPage.jsx';
// import BanUnbanUsersPage from './pages/ModerationPages/BanUnbanUsersPage.jsx';
// import ManageSuggestionsPage from './pages/ModerationPages/ManageSuggestionsPage.jsx';
// import ManageReportsPage from './pages/ModerationPages/ManageReportsPage.jsx';
// import ManageContactsPage from './pages/ModerationPages/ManageContactsPage.jsx';
import ModerationNavbar, {
  SidebarContext,
} from "./components/ModerationComponents/ModerationNavbar.jsx";
import ManageUsersPage from "./pages/ModerationPages/ManageUsersPage.jsx";
import ModerateUser from "./components/ModerationComponents/ModerateUser.jsx";
import ManageModeratorsPage from "./pages/ModerationPages/ManageModeratorsPage.jsx";
import ManageBansPage from "./pages/ModerationPages/ManageBansPage.jsx";
import ManageSuggestionsPage from "./pages/ModerationPages/ManageSuggestionsPage.jsx";
import ManageContactsPage from "./pages/ModerationPages/ManageContactsPage.jsx";
import ManageAdminsPage from "./pages/ModerationPages/ManageAdminsPage.jsx";
import ManageReviewsPage from "./pages/ModerationPages/ManageReviewsPage.jsx";
import PremiumPlan from "./pages/PremiumPlan.jsx";
import LandingFooter from "./components/MainWebPage/LandingFooter.jsx";
import FounderPage from "./pages/FounderPage.jsx";
import BannedUserPage from "./pages/BannedUserPage.jsx";
import LandingFeatures from "./pages/MainWebPage/LandingFeatures.jsx";
import Reviews from "./pages/Reviews.jsx";

function App() {
  const {
    authUser,
    checkAuth,
    isCheckingAuth,
    isKing,
    isAdmin,
    isModrater,
    checkOpUser,
  } = useAuthStore();
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if current path starts with /chat or /op
  const isChatRoute =
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/op");
  const isAdminRoute = location.pathname.startsWith("/op");

  // Check admin privileges for /op routes
  useEffect(() => {
    if (isAdminRoute && authUser) {
      checkOpUser();
    }
  }, [isAdminRoute, authUser, checkOpUser]);

  // Show loader while checking authUser status
  if (isChatRoute && !authUser) {
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

  // Check if user is banned
  const isUserBanned = () => {
    return authUser?.data?.user?.banned?.current?.status === true;
  };

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
      <style jsx>{`
        :root {
          --navbar-height: 64px; /* Adjust this value to match your navbar's height */
        }
      `}</style>
      {/* Top Navigation Bar - Choose between regular and landing navbar */}
      <div
        className={`
          flex-1 transition-all duration-300 w-full
          ${isMobile ? "px-2" : "px-4"} 
          ${isAdminRoute && hasAdminAccess && !isMobile ? "admin-main" : ""}
        `}
        style={{
          marginLeft:
            isAdminRoute && hasAdminAccess && !isMobile
              ? isNavbarCollapsed
                ? "4rem"
                : "16rem"
              : "0",
          width: isMobile ? "100vw" : "auto",
          padding: "0", // Remove any padding
        }}
      >
        {isChatRoute && authUser ? <Navbar /> : <LandingNavbar />}
      </div>

      {/* Content area with potential admin sidebar */}
      <div className="flex flex-1 relative">
        {/* Admin sidebar for /op routes */}
        {isAdminRoute && authUser && hasAdminAccess && (
          <SidebarContext.Provider
            value={{
              isCollapsed: isNavbarCollapsed,
              sidebarWidth: "16rem",
              collapsedWidth: "4rem",
              isMobile: isMobile,
              showMobileMenu: showMobileMenu,
              onCollapsedChange: handleSidebarStateChange,
              onMobileMenuChange: handleMobileMenuChange,
            }}
          >
            <ModerationNavbar />
          </SidebarContext.Provider>
        )}

        {/* Main content area */}
        <main
          className={`
            flex-1 transition-all duration-300 w-full
            ${isMobile ? "px-2" : "px-4"} 
            ${isAdminRoute && hasAdminAccess && !isMobile ? "admin-main" : ""}
            ${isChatRoute ? "h-[calc(100vh-var(--navbar-height))]" : ""}
          `}
          style={{
            marginLeft:
              isAdminRoute && hasAdminAccess && !isMobile
                ? isNavbarCollapsed
                  ? "4rem"
                  : "16rem"
                : "0",
            width: isMobile ? "100vw" : "auto",
            padding: "0", // Remove any padding
          }}
        >
          <Routes>
            {/* Main landing pages */}
            <Route path="/" element={<LandingHome />} />
            <Route path="/about" element={<LandingAbout />} />
            <Route path="/contact" element={<LandingContact />} />
            <Route path="/suggestion" element={<LandingSuggestion />} />
            <Route path="/premium" element={<PremiumPlan />} />
            <Route path="/anonymous" element={<FounderPage />} />
            <Route path="/banned" element={<BannedUserPage />} />
            <Route path="/terms" element={<LandingTerms />} />
            <Route path="/privacy" element={<LandingPrivacy />} />
            <Route path="/features" element={<LandingFeatures/>} />
            <Route path="/reviews" element={<Reviews />} />

            {/* Authentication routes at root level */}
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/chat" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/login" />}
            />

            {/* Chat related routes with banned user check */}
            <Route
              path="/chat"
              element={
                authUser ? (
                  isUserBanned() ? (
                    <Navigate to="/banned" />
                  ) : (
                    <HomePage />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/chat/settings"
              element={
                authUser ? (
                  isUserBanned() ? (
                    <Navigate to="/banned" />
                  ) : (
                    <SettingsPage />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/chat/profile"
              element={
                authUser ? (
                  isUserBanned() ? (
                    <Navigate to="/banned" />
                  ) : (
                    <ProfilePage />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Admin routes */}
            {/* Admin routes with banned user check */}
            <Route path="/op">
              {/* Dashboard route */}
              <Route
                index
                element={
                  authUser ? (
                    isUserBanned() ? (
                      <Navigate to="/banned" />
                    ) : hasAdminAccess ? (
                      <DashboardPage />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="dashboard"
                element={
                  authUser ? (
                    isUserBanned() ? (
                      <Navigate to="/banned" />
                    ) : hasAdminAccess ? (
                      <DashboardPage />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* User Management */}
              <Route
                path="users"
                element={
                  authUser ? (
                    isUserBanned() ? (
                      <Navigate to="/banned" />
                    ) : hasAdminAccess ? (
                      <ManageUsersPage />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* Moderator Management */}
              <Route
                path="moderators"
                element={
                  authUser ? (
                    isUserBanned() ? (
                      <Navigate to="/banned" />
                    ) : hasAdminAccess ? (
                      <ManageModeratorsPage />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* Admin Management */}
              <Route
                path="admins"
                element={
                  authUser ? (
                    isUserBanned() ? (
                      <Navigate to="/banned" />
                    ) : hasAdminAccess ? (
                      <ManageAdminsPage />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* Ban/Unban Management */}
              <Route
                path="bans"
                element={
                  authUser ? (
                    isUserBanned() ? (
                      <Navigate to="/banned" />
                    ) : hasAdminAccess ? (
                      <ManageBansPage />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* Suggestions Management */}
              <Route
                path="suggestions"
                element={
                  authUser ? (
                    isUserBanned() ? (
                      <Navigate to="/banned" />
                    ) : hasAdminAccess ? (
                      <ManageSuggestionsPage />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* Contact Management */}
              <Route
                path="contacts"
                element={
                  authUser ? (
                    isUserBanned() ? (
                      <Navigate to="/banned" />
                    ) : hasAdminAccess ? (
                      <ManageContactsPage />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* Config/Rules Management */}
              <Route
                path="config"
                element={
                  authUser ? (
                    isUserBanned() ? (
                      <Navigate to="/banned" />
                    ) : hasAdminAccess ? (
                      <ConfigRulesPage />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* Reviews Management */}
              <Route
                path="reviews"
                element={
                  authUser ? (
                    isUserBanned() ? (
                      <Navigate to="/banned" />
                    ) : hasAdminAccess ? (
                      <ManageReviewsPage />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Route>

            <Route
              path="*"
              element={
                location.pathname.includes("modrateUser") ? (
                  <ModerateUser />
                ) : (
                  <NotFoundPage />
                )
              }
            />
            {/* 404 Not Found - this catches all unmatched routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </main>
      </div>
      {!isChatRoute ? <LandingFooter /> : null}
    </div>
  );
}

export default App;
