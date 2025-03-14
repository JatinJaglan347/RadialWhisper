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
  LayoutDashboard
} from 'lucide-react';

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

const AdminPanelNavbar = () => {
  const location = useLocation();
  const { 
    isCollapsed, 
    sidebarWidth, 
    collapsedWidth, 
    onCollapsedChange, 
    onMobileMenuChange 
  } = useSidebar();
  
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

  const navItems = [
    {
      path: '/op/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      description: 'Overview and statistics'
    },
    { 
      path: '/op/users', 
      icon: <Users size={20} />, 
      label: 'Manage Users',
      description: 'User accounts and permissions'
    },
    { 
      path: '/op/moderators', 
      icon: <ShieldAlert size={20} />, 
      label: 'Manage Moderators',
      description: 'Moderator controls and assignments'
    },
    { 
      path: '/op/bans', 
      icon: <Ban size={20} />, 
      label: 'Ban/Unban Users',
      description: 'User restrictions and penalties'
    },
    { 
      path: '/op/suggestions', 
      icon: <Lightbulb size={20} />, 
      label: 'Manage Suggestions',
      description: 'User feedback and ideas'
    },
    { 
      path: '/op/reports', 
      icon: <Flag size={20} />, 
      label: 'Manage Reports',
      description: 'User reports and violations'
    },
    { 
      path: '/op/contacts', 
      icon: <Mail size={20} />, 
      label: 'Manage Contacts',
      description: 'User messages and inquiries'
    },
    { 
      path: '/op/config', 
      icon: <Settings size={20} />, 
      label: 'Manage Config',
      description: 'System settings and rules'
    }
  ];

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
                {localIsCollapsed && !isMobile ? 'OP' : 'ADMIN PANEL'}
              </span>
            </div>
          </div>
          
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
        <div className="py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 hover:bg-[#31333A] transition-colors relative
                ${isActive ? 'bg-[#31333A]' : ''}
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFF6E0] to-[#D8D9DA]"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`
                    ${isActive ? 'text-[#FFF6E0]' : 'text-[#FFF6E0]/70'} 
                    ${localIsCollapsed && !isMobile ? 'mx-auto' : 'mr-3'}
                  `}>
                    {item.icon}
                  </div>
                  
                  {/* Label and description */}
                  {(!localIsCollapsed || isMobile) && (
                    <div className="flex flex-col">
                      <span className={`font-medium ${isActive ? 'text-[#FFF6E0]' : 'text-[#FFF6E0]/90'}`}>
                        {item.label}
                      </span>
                      <span className="text-xs text-[#D8D9DA]/60">
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
              flex items-center px-4 py-3 hover:bg-[#31333A] rounded-xl transition-colors 
              bg-[#31333A]/50 border border-[#61677A]/30
              ${isActive ? 'bg-[#31333A]' : ''}
            `}
          >
            <div className={`text-[#FFF6E0]/70 ${localIsCollapsed && !isMobile ? 'mx-auto' : 'mr-3'}`}>
              <LogOut size={20} />
            </div>
            {(!localIsCollapsed || isMobile) && (
              <span className="font-medium">Exit Admin Panel</span>
            )}
          </NavLink>
        </div>
        
        
      </div>
    </>
  );
};

export default AdminPanelNavbar;