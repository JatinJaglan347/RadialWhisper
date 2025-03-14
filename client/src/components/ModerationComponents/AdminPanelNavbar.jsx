import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';

const AdminPanelNavbar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check if the current route starts with "/op"
  const isAdminRoute = location.pathname.startsWith('/op');

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Don't render if not on admin route
  if (!isAdminRoute) return null;

  const navItems = [
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

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* Mobile menu toggle */}
      {isMobile && (
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="fixed top-4 left-4 z-50 bg-[#31333A] p-2 rounded-full text-[#FFF6E0] shadow-lg"
        >
          {showMobileMenu ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      )}

      {/* Desktop sidebar or mobile menu */}
      <div 
        className={`fixed top-0 left-0 h-full bg-[#272829] text-[#FFF6E0] shadow-xl transition-all duration-300 z-40
                    ${isMobile 
                      ? showMobileMenu 
                        ? 'w-64 translate-x-0' 
                        : 'w-64 -translate-x-full'
                      : isCollapsed 
                        ? 'w-16' 
                        : 'w-64'}`}
      >
        {/* Admin panel logo/header */}
        <div className="h-16 flex items-center justify-between px-4 bg-[#31333A] border-b border-[#61677A]/30">
          <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center w-full' : ''}`}>
            <div className="bg-gradient-to-r from-[#FFF6E0]/10 to-transparent p-1 rounded-full">
              <span className="bg-gradient-to-r from-[#FFF6E0] to-[#D8D9DA] text-[#272829] px-2 py-1 rounded-full text-sm font-medium">
                {isCollapsed && !isMobile ? 'OP' : 'ADMIN PANEL'}
              </span>
            </div>
          </div>
          
          {/* Collapse toggle button (desktop only) */}
          {!isMobile && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-[#FFF6E0]/70 hover:text-[#FFF6E0] transition-colors"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
        </div>

        {/* Navigation items */}
        <div className="py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-4 py-3 hover:bg-[#31333A] transition-colors relative
                ${isActiveRoute(item.path) ? 'bg-[#31333A]' : ''}
              `}
            >
              {/* Active indicator */}
              {isActiveRoute(item.path) && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFF6E0] to-[#D8D9DA]"></div>
              )}
              
              {/* Icon */}
              <div className={`
                ${isActiveRoute(item.path) ? 'text-[#FFF6E0]' : 'text-[#FFF6E0]/70'} 
                ${isCollapsed && !isMobile ? 'mx-auto' : 'mr-3'}
              `}>
                {item.icon}
              </div>
              
              {/* Label and description */}
              {(!isCollapsed || isMobile) && (
                <div className="flex flex-col">
                  <span className={`font-medium ${isActiveRoute(item.path) ? 'text-[#FFF6E0]' : 'text-[#FFF6E0]/90'}`}>
                    {item.label}
                  </span>
                  <span className="text-xs text-[#D8D9DA]/60">
                    {item.description}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Logout option at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link
            to="/"
            className="flex items-center px-4 py-3 hover:bg-[#31333A] rounded-xl transition-colors bg-[#31333A]/50 border border-[#61677A]/30"
          >
            <div className={`text-[#FFF6E0]/70 ${isCollapsed && !isMobile ? 'mx-auto' : 'mr-3'}`}>
              <LogOut size={20} />
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="font-medium">Exit Admin Panel</span>
            )}
          </Link>
        </div>
        
        {/* Background elements */}
        <div className="absolute bottom-0 right-0 w-full h-64 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#31333A]/30 to-transparent"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#61677A] blur-[80px] opacity-10 animate-pulse" style={{animationDuration: '10s'}}></div>
        </div>
      </div>
    </>
  );
};

export default AdminPanelNavbar;