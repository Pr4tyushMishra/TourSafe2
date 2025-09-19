import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  
  const navItems = [
    { path: '/profile', icon: 'person', label: 'Profile' },
    { path: '/digital-id', icon: 'id', label: 'Digital ID' },
    { path: '/monitoring-dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/activity', icon: 'activity', label: 'Activity' },
    { path: '/security', icon: 'security', label: 'Security' },
    { path: '/notifications', icon: 'notifications', label: 'Notifications' },
    { path: '/contacts', icon: 'contacts', label: 'Contacts' },
  ];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'dashboard':
        return (
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        );
      case 'activity':
        return (
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        );
      case 'security':
        return (
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        );
      case 'notifications':
        return (
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        );
      case 'contacts':
        return (
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        );
      case 'person':
        return (
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        );
      case 'id':
        return (
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        );
      default:
        return null;
    }
  };

  // Collapsed width is 20 (w-20), expanded is 64 (w-64)
  const sidebarWidth = isSidebarOpen ? 'w-64' : 'w-20';

  return (
    <aside 
      className={`${sidebarWidth} bg-gray-800 text-white h-screen fixed left-0 top-0 pt-16 transition-all duration-300 ease-in-out z-20`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 bg-gray-700 text-white p-1 rounded-full shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-10"
        aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isSidebarOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      <div className="p-4 overflow-hidden">
        <nav className="mt-6">
          {navItems.map((item) => (
            <div 
              key={item.path} 
              className={`flex items-center mb-2 rounded-lg overflow-hidden transition-colors ${
                location.pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center px-4 py-3 text-gray-300 w-full cursor-pointer">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {getIcon(item.icon)}
                  </svg>
                </div>
                <span 
                  className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
