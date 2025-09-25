import React, { createContext, useState, useEffect } from 'react';

export const SafetyContext = createContext();

export const SafetyProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [safetyAlerts, setSafetyAlerts] = useState([]);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState([
    { name: 'Priya Sharma', phone: '+91 98765 43210' },
    { name: 'Bhawesh Bhaskar', phone: '+91 98765 12345' }
  ]);
  const [areaSafety, setAreaSafety] = useState({
    rating: 'safe', // safe, caution, warning, danger
    crowdLevel: 'moderate', // low, moderate, high
    lastUpdated: new Date().toISOString()
  });

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation access denied or failed:', error.message);
          // Fallback to a default location (Guwahati for demo)
          setUserLocation({ lat: 26.1445, lng: 91.7362 });
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser');
      // Fallback to default location
      setUserLocation({ lat: 26.1445, lng: 91.7362 });
    }
  };

  // Toggle location sharing
  const toggleLocationSharing = () => {
    if (!isSharingLocation) {
      getCurrentLocation();
    }
    setIsSharingLocation(!isSharingLocation);
  };

  // Send SOS alert
  const sendSOS = () => {
    const newAlert = {
      id: Date.now(),
      type: 'emergency',
      message: 'SOS Alert! I need immediate assistance!',
      location: userLocation,
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    
    // In a real app, this would send the alert to your backend
    console.log('🚑 SOS Alert Generated:', newAlert);
    
    // Add to local state
    setSafetyAlerts(prev => [newAlert, ...prev]);
    
    // Notify trusted contacts
    notifyTrustedContacts(newAlert);
    
    // Create browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚑 SOS Alert Sent', {
        body: 'Emergency services have been notified. Help is on the way.',
        icon: '/favicon.ico',
        tag: 'sos-alert',
        requireInteraction: true
      });
    }
    
    return newAlert;
  };

  // Notify trusted contacts (mock implementation)
  const notifyTrustedContacts = (alert) => {
    console.log('📞 Notifying trusted contacts:', trustedContacts);
    
    // Simulate contact notifications with visual feedback
    trustedContacts.forEach((contact, index) => {
      setTimeout(() => {
        console.log(`✅ ${contact.name} (${contact.phone}) notified successfully`);
      }, (index + 1) * 500);
    });
    
    // In a real app, this would send SMS/email/notification to contacts
  };

  // Get safety tips based on current location
  const getSafetyTips = () => {
    const tips = [
      'Stay in well-lit areas at night',
      'Keep your belongings secure',
      'Be aware of your surroundings',
      'Save local emergency numbers',
      'Share your live location with trusted contacts'
    ];
    
    // Shuffle and return 2-3 random tips
    return [...tips].sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  // Update area safety status (mock implementation)
  const updateAreaSafety = () => {
    const ratings = ['safe', 'caution', 'warning', 'danger'];
    const crowds = ['low', 'moderate', 'high'];
    
    setAreaSafety({
      rating: ratings[Math.floor(Math.random() * ratings.length)],
      crowdLevel: crowds[Math.floor(Math.random() * crowds.length)],
      lastUpdated: new Date().toISOString()
    });
  };

  // Initial setup
  useEffect(() => {
    getCurrentLocation();
    updateAreaSafety();
    
    // Update area safety every 5 minutes
    const interval = setInterval(updateAreaSafety, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <SafetyContext.Provider
      value={{
        userLocation,
        safetyAlerts,
        isSharingLocation,
        trustedContacts,
        areaSafety,
        sendSOS,
        toggleLocationSharing,
        getSafetyTips,
        updateAreaSafety
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = React.useContext(SafetyContext);
  if (context === undefined) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
