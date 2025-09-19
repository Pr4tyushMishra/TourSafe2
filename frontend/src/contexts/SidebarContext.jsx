import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Get the initial state from localStorage if available
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved !== 'true'; // Default to open if no preference saved
  });

  // Save preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', !isSidebarOpen);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default SidebarContext;
