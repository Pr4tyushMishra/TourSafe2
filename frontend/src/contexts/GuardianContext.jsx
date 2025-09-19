import React, { createContext, useContext, useState, useCallback } from 'react';

const GuardianContext = createContext();

export const GuardianProvider = ({ children }) => {
  const [guardians, setGuardians] = useState([]);
  const [activeGuardian, setActiveGuardian] = useState(null);
  const [guardianRequests, setGuardianRequests] = useState([]);
  const [isGuardianModeActive, setIsGuardianModeActive] = useState(false);

  // Mock guardians for demonstration
  const mockGuardians = [
    {
      id: 'guardian_1',
      name: 'Hotel Brahmaputra Grand',
      type: 'hotel',
      contact: '+91 361 2345678',
      email: 'safety@brahmaputragrand.com',
      location: { lat: 26.1445, lng: 91.7362 },
      address: 'G.S. Road, Guwahati, Assam 781001',
      services: ['24/7 Reception', 'Tourist Police Contact', 'Emergency Medical Kit', 'Safe Transportation'],
      rating: 4.5,
      verified: true,
      responseTime: '< 5 minutes',
      description: 'Premium hotel offering comprehensive tourist safety services'
    },
    {
      id: 'guardian_2',
      name: 'Kamakhya Tourist Information Center',
      type: 'tourism_office',
      contact: '+91 361 2987654',
      email: 'help@kamakhyatourism.gov.in',
      location: { lat: 26.1665, lng: 91.7062 },
      address: 'Kamakhya Temple Complex, Guwahati, Assam',
      services: ['Tourist Information', 'Emergency Assistance', 'Local Guide Services', 'Safety Alerts'],
      rating: 4.8,
      verified: true,
      responseTime: '< 3 minutes',
      description: 'Government-certified tourist assistance center'
    },
    {
      id: 'guardian_3',
      name: 'Northeast Adventure Tours',
      type: 'tour_operator',
      contact: '+91 361 2876543',
      email: 'support@neatours.com',
      location: { lat: 26.1350, lng: 91.7450 },
      address: 'Fancy Bazar, Guwahati, Assam 781001',
      services: ['Tour Guide Services', 'Emergency Contact', 'Local Transportation', 'Cultural Support'],
      rating: 4.3,
      verified: true,
      responseTime: '< 10 minutes',
      description: 'Specialized in Northeast India cultural and adventure tours'
    }
  ];

  // Initialize guardians
  React.useEffect(() => {
    setGuardians(mockGuardians);
  }, []);

  // Request guardian assignment
  const requestGuardian = useCallback(async (guardianId, touristData, duration = 24) => {
    const guardian = guardians.find(g => g.id === guardianId);
    if (!guardian) return { success: false, error: 'Guardian not found' };

    const request = {
      id: `request_${Date.now()}`,
      touristId: touristData.id || `tourist_${Date.now()}`,
      guardianId,
      guardian,
      tourist: touristData,
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + duration * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      duration: duration
    };

    setGuardianRequests(prev => [request, ...prev]);

    // Simulate guardian response after a short delay
    setTimeout(() => {
      setGuardianRequests(prev =>
        prev.map(req =>
          req.id === request.id
            ? { ...req, status: 'accepted', acceptedAt: new Date().toISOString() }
            : req
        )
      );
      setActiveGuardian({ ...request, status: 'accepted', acceptedAt: new Date().toISOString() });
      setIsGuardianModeActive(true);
    }, 2000);

    return { success: true, request };
  }, [guardians]);

  // Cancel guardian assignment
  const cancelGuardianAssignment = useCallback(() => {
    if (activeGuardian) {
      setGuardianRequests(prev =>
        prev.map(req =>
          req.id === activeGuardian.id
            ? { ...req, status: 'cancelled', cancelledAt: new Date().toISOString() }
            : req
        )
      );
    }
    setActiveGuardian(null);
    setIsGuardianModeActive(false);
  }, [activeGuardian]);

  // Notify guardian of emergency
  const notifyGuardian = useCallback(async (emergencyData) => {
    if (!activeGuardian) return { success: false, error: 'No active guardian' };

    const notification = {
      id: `notification_${Date.now()}`,
      type: 'emergency',
      touristId: emergencyData.touristId,
      guardianId: activeGuardian.guardianId,
      message: emergencyData.message || 'Tourist needs immediate assistance',
      location: emergencyData.location,
      timestamp: new Date().toISOString(),
      priority: emergencyData.priority || 'high',
      alertType: emergencyData.alertType || 'sos'
    };

    // In a real app, this would send notifications via SMS, email, push notifications, etc.
    console.log('Emergency notification sent to guardian:', notification);

    // Simulate guardian acknowledgment
    setTimeout(() => {
      console.log('Guardian acknowledged emergency:', {
        notificationId: notification.id,
        acknowledgedAt: new Date().toISOString(),
        estimatedArrival: '5-10 minutes',
        message: 'Help is on the way. Stay calm and stay where you are.'
      });
    }, 1000);

    return { success: true, notification };
  }, [activeGuardian]);

  // Get nearby guardians
  const getNearbyGuardians = useCallback((userLocation, radiusKm = 10) => {
    if (!userLocation) return guardians;

    return guardians.filter(guardian => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        guardian.location.lat,
        guardian.location.lng
      );
      return distance <= radiusKm;
    }).sort((a, b) => {
      const distanceA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.location.lat,
        a.location.lng
      );
      const distanceB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.location.lat,
        b.location.lng
      );
      return distanceA - distanceB;
    });
  }, [guardians]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get guardian status
  const getGuardianStatus = useCallback(() => {
    if (!activeGuardian) return { active: false };

    const now = new Date();
    const expiresAt = new Date(activeGuardian.expiresAt);
    const hoursRemaining = Math.max(0, (expiresAt - now) / (1000 * 60 * 60));

    return {
      active: true,
      guardian: activeGuardian.guardian,
      hoursRemaining: Math.round(hoursRemaining * 10) / 10,
      expiresAt: activeGuardian.expiresAt,
      assignedAt: activeGuardian.acceptedAt || activeGuardian.requestedAt
    };
  }, [activeGuardian]);

  return (
    <GuardianContext.Provider
      value={{
        guardians,
        activeGuardian,
        guardianRequests,
        isGuardianModeActive,
        requestGuardian,
        cancelGuardianAssignment,
        notifyGuardian,
        getNearbyGuardians,
        getGuardianStatus,
        calculateDistance
      }}
    >
      {children}
    </GuardianContext.Provider>
  );
};

export const useGuardian = () => {
  const context = useContext(GuardianContext);
  if (!context) {
    throw new Error('useGuardian must be used within a GuardianProvider');
  }
  return context;
};

export default GuardianContext;