import React, { createContext, useContext, useState, useEffect } from 'react';

const DemoModeContext = createContext();

export const DemoModeProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoScenario, setDemoScenario] = useState(null);
  const [demoData, setDemoData] = useState({
    tourist: {
      id: 'demo-tourist-123',
      name: 'Demo Tourist',
      email: 'demo@tourSafe.com',
      phone: '+91-9876543210',
      passport: 'P123456789'
    },
    guardians: [
      {
        id: 'guardian-1',
        name: 'Hotel Paradise',
        type: 'HOTEL',
        contact: '+91-9876543211',
        location: { lat: 26.1445, lng: 91.7362 }
      },
      {
        id: 'guardian-2', 
        name: 'Tourism Help Center',
        type: 'TOURISM_CENTER',
        contact: '+91-9876543212',
        location: { lat: 26.1490, lng: 91.7390 }
      }
    ],
    geozones: [
      {
        id: 'demo-zone-1',
        name: 'Guwahati Restricted Zone',
        polygon: [
          [91.7300, 26.1400],
          [91.7400, 26.1400], 
          [91.7400, 26.1500],
          [91.7300, 26.1500],
          [91.7300, 26.1400]
        ],
        riskScore: 85
      }
    ]
  });

  const enableDemoMode = () => {
    setIsDemoMode(true);
    // Initialize demo data and scenarios
    localStorage.setItem('tourpal_demo_mode', 'true');
    console.log('🎬 Demo Mode Activated - Using simulated data');
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    setDemoScenario(null);
    localStorage.removeItem('tourpal_demo_mode');
    console.log('🎬 Demo Mode Deactivated - Using real data');
  };

  const startScenario = (scenarioName) => {
    setDemoScenario(scenarioName);
    console.log(`🎭 Starting demo scenario: ${scenarioName}`);
  };

  const stopScenario = () => {
    setDemoScenario(null);
    console.log('🎭 Demo scenario stopped');
  };

  // Check if demo mode was previously enabled
  useEffect(() => {
    const savedDemoMode = localStorage.getItem('tourpal_demo_mode');
    if (savedDemoMode === 'true') {
      setIsDemoMode(true);
    }
  }, []);

  const value = {
    isDemoMode,
    demoScenario,
    demoData,
    enableDemoMode,
    disableDemoMode,
    startScenario,
    stopScenario,
    setDemoData
  };

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};

export default DemoModeContext;