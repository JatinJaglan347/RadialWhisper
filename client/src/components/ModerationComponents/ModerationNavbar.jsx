import React, { useState, useEffect, createContext, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Users, 
  ShieldAlert, 
  Ban, 
  Lightbulb, 
  Flag, 
  Mail, 
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut,
  LayoutDashboard,
  Crown,
  Skull,
  Star
} from 'lucide-react';
import { useAuthStore } from "../../store/useAuthStore";

// Create a context to share sidebar state with other components
export const SidebarContext = createContext({
  isCollapsed: false,
  sidebarWidth: '16rem',
  collapsedWidth: '4rem',
  isMobile: false,
  showMobileMenu: false,
  onCollapsedChange: () => {},
  onMobileMenuChange: () => {}
});

export const useSidebar = () => useContext(SidebarContext);

const ModerationNavbar = () => {
  const location = useLocation();
  const { 
    isCollapsed, 
    sidebarWidth, 
    collapsedWidth, 
    onCollapsedChange, 
    onMobileMenuChange 
  } = useSidebar();
  
  // Get user role from auth store
  const { authUser } = useAuthStore();
  const userRole = authUser?.data?.user?.userRole || 'moderator'; // Default to moderator if role is undefined
  
  const [localIsCollapsed, setLocalIsCollapsed] = useState(isCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check if the current route starts with "/op"
  const isAdminRoute = location.pathname.startsWith('/op');

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      
      if (!mobileView && showMobileMenu) {
        setShowMobileMenu(false);
        if (onMobileMenuChange) onMobileMenuChange(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showMobileMenu, onMobileMenuChange]);

  // Sync local state with context
  useEffect(() => {
    setLocalIsCollapsed(isCollapsed);
  }, [isCollapsed]);

  // Handle toggle collapse
  const handleToggleCollapse = () => {
    const newState = !localIsCollapsed;
    setLocalIsCollapsed(newState);
    if (onCollapsedChange) {
      onCollapsedChange(newState);
    }
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    const newState = !showMobileMenu;
    setShowMobileMenu(newState);
    if (onMobileMenuChange) {
      onMobileMenuChange(newState);
    }
  };

  // Don't render if not on admin route
  if (!isAdminRoute) return null;

  // Get panel name based on role
  const getPanelName = () => {
    switch(userRole) {
      case 'king':
        return 'KING PANEL';
      case 'admin':
        return 'ADMIN PANEL';
      case 'moderator':
        return 'MOD PANEL';
      default:
        return 'PANEL';
    }
  };

  // Get panel abbreviation based on role
  const getPanelAbbr = () => {
    switch(userRole) {
      case 'king':
        return 'KP';
      case 'admin':
        return 'AP';
      case 'moderator':
        return 'MP';
      default:
        return 'OP';
    }
  };

  // Define all possible nav items
  const allNavItems = [
    { 
      path: '/op/overlord', 
      icon: <Skull size={20} />, 
      label: 'Absolute Power',
      description: 'Purge users and alter reality',
      roles: ['king'], // Only king can access this
      special: true // Mark as special for styling
    },
    {
      path: '/op/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      description: 'Overview and statistics',
      roles: ['admin', 'king'] // Only admin and king can access
    },
    { 
      path: '/op/users', 
      icon: <Users size={20} />, 
      label: 'Manage Users',
      description: 'User accounts and permissions',
      roles: ['admin', 'king']
    },
    { 
      path: '/op/moderators', 
      icon: <ShieldAlert size={20} />, 
      label: 'Manage Moderators',
      description: 'Moderator controls and assignments',
      roles: ['admin', 'king']
    },
    { 
      path: '/op/admins', 
      icon: <Crown size={20} />, 
      label: 'Manage Admins',
      description: 'Admin access and permissions',
      roles: ['king'] // Only king can manage admins
    },
    { 
      path: '/op/bans', 
      icon: <Ban size={20} />, 
      label: 'Ban/Unban Users',
      description: 'User restrictions and penalties',
      roles: ['moderator', 'admin', 'king'] // All roles can access
    },
    { 
      path: '/op/suggestions', 
      icon: <Lightbulb size={20} />, 
      label: 'Manage Suggestions',
      description: 'User feedback and ideas',
      roles: ['moderator', 'admin', 'king']
    },
    { 
      path: '/op/reviews', 
      icon: <Star size={20} />, 
      label: 'Manage Reviews',
      description: 'User ratings and comments',
      roles: ['admin', 'king'] // Only admin and king can access
    },
    { 
      path: '/op/reports', 
      icon: <Flag size={20} />, 
      label: 'Manage Reports',
      description: 'User reports and violations',
      roles: ['moderator', 'admin', 'king']
    },
    { 
      path: '/op/contacts', 
      icon: <Mail size={20} />, 
      label: 'Manage Contacts',
      description: 'User messages and inquiries',
      roles: ['moderator', 'admin', 'king']
    },
    { 
      path: '/op/config', 
      icon: <Settings size={20} />, 
      label: 'Manage Config',
      description: 'System settings and rules',
      roles: ['admin', 'king']
    }
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile menu toggle */}
      {isMobile && (
        <button
          onClick={handleMobileMenuToggle}
          className="fixed top-4 left-4 z-50 bg-[#31333A] p-2 rounded-full text-[#FFF6E0] shadow-lg"
        >
          {showMobileMenu ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      )}

      {/* Backdrop for mobile menu */}
      {isMobile && showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={handleMobileMenuToggle}
        />
      )}

      {/* Desktop sidebar or mobile menu */}
      <div 
        className={`fixed top-0 left-0 h-full bg-[#272829] text-[#FFF6E0] shadow-xl transition-all duration-300 z-40
                    ${isMobile 
                      ? showMobileMenu 
                        ? 'w-3/4 max-w-64 translate-x-0' 
                        : 'w-3/4 max-w-64 -translate-x-full'
                      : localIsCollapsed 
                        ? 'w-16' 
                        : 'w-64'}`}
      >
        {/* Admin panel logo/header */}
        <div className="h-16 flex items-center justify-between px-4 bg-[#31333A] border-b border-[#61677A]/30">
          <div className={`flex items-center ${localIsCollapsed && !isMobile ? 'justify-center w-full' : ''}`}>
            <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 rounded-full">
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-2 py-1 rounded-full text-sm font-medium">
                {localIsCollapsed && !isMobile ? getPanelAbbr() : getPanelName()}
              </span>
            </div>
          </div>
          
          {/* Role indicator */}
          {!localIsCollapsed && !isMobile && (
            <div className="text-xs rounded bg-[#31333A]/70 px-2 py-1">
              {userRole === 'king' ? (
                <span className="flex items-center">
                  <Crown size={12} className="mr-1 text-yellow-400" />
                  King
                </span>
              ) : userRole === 'admin' ? (
                <span className="text-blue-400">Admin</span>
              ) : (
                <span className="text-green-400">Moderator</span>
              )}
            </div>
          )}
          
          {/* Collapse toggle button (desktop only) */}
          {!isMobile && (
            <button 
              onClick={handleToggleCollapse}
              className="text-[#FFF6E0]/70 hover:text-[#FFF6E0] transition-colors"
            >
              {localIsCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
        </div>

        {/* Navigation items */}
     
<div className="py-4 overflow-y-auto max-h-[calc(100vh-144px)]">
  {navItems.map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) => `
        flex items-center px-4 py-3 hover:bg-[#31333A] transition-colors relative
        ${isActive ? 'bg-[#31333A]' : ''}
        ${item.special ? 'overflow-hidden' : ''}
      `}
    >
      {({ isActive }) => (
        <>
          {/* Active indicator */}
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFF6E0] to-[#D8D9DA]"></div>
          )}
          
          {/* Scary background for special items */}
          {item.special && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-transparent pulse-bg"></div>
          )}
          
          {/* Icon */}
          <div className={`
            ${isActive ? 'text-[#FFF6E0]' : item.special ? 'text-red-400' : 'text-[#FFF6E0]/70'} 
            ${localIsCollapsed && !isMobile ? 'mx-auto' : 'mr-3'}
            ${item.special ? 'z-10 animate-pulse' : ''}
          `}>
            {item.icon}
          </div>
          
          {/* Label and description */}
          {(!localIsCollapsed || isMobile) && (
            <div className={`flex flex-col ${item.special ? 'z-10' : ''}`}>
              <span className={`font-medium ${isActive ? 'text-[#FFF6E0]' : item.special ? 'text-red-400' : 'text-[#FFF6E0]/90'}`}>
                {item.label}
              </span>
              <span className={`text-xs ${item.special ? 'text-red-300/80' : 'text-[#D8D9DA]/60'}`}>
                {item.description}
              </span>
            </div>
          )}
        </>
      )}
    </NavLink>
  ))}
</div>

        {/* Logout option at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <NavLink
            to="/"
            className={({ isActive }) => `
              flex items-center ${localIsCollapsed && !isMobile ? 'px-2 py-3' : 'px-4 py-3'}  hover:bg-[#31333A] rounded-xl transition-colors 
              bg-[#31333A]/50 border border-[#61677A]/30
              ${isActive ? 'bg-[#31333A]' : ''}
            `}
          >
            <div className={`text-[#FFF6E0]/70 justify-center items-center text-center ${localIsCollapsed && !isMobile ? 'mx-auto' : 'mr-3'}`}>
              <LogOut size={20} />
            </div>
            {(!localIsCollapsed || isMobile) && (
              <span className="font-medium">Exit {localIsCollapsed && !isMobile ? getPanelAbbr() : getPanelName()}</span>
            )}
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default ModerationNavbar;