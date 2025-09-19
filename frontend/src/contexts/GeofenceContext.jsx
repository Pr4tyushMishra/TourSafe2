import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';

const GeofenceContext = createContext();

export const GeofenceProvider = ({ children }) => {
  const [geozones, setGeozones] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastKnownZone, setLastKnownZone] = useState(null);

  // Mock geozones for demonstration (in a real app, these would come from a backend)
  const mockGeozones = [
    {
      id: 'zone_1',
      name: 'Guwahati High Crime Area',
      type: 'danger',
      riskScore: 85,
      polygon: [
        [91.7362, 26.1445], // Guwahati coordinates
        [91.7462, 26.1445],
        [91.7462, 26.1545],
        [91.7362, 26.1545],
        [91.7362, 26.1445]
      ],
      description: 'High crime rate area. Exercise extreme caution.',
      recommendations: [
        'Travel in groups',
        'Avoid after dark',
        'Keep valuables secure',
        'Stay in main roads'
      ]
    },
    {
      id: 'zone_2',
      name: 'Kamakhya Temple Safe Zone',
      type: 'safe',
      riskScore: 15,
      polygon: [
        [91.7062, 26.1665],
        [91.7162, 26.1665],
        [91.7162, 26.1765],
        [91.7062, 26.1765],
        [91.7062, 26.1665]
      ],
      description: 'Well-patrolled tourist area with security.',
      recommendations: [
        'Safe for solo travelers',
        'Tourist police nearby',
        'Multiple exit routes available'
      ]
    },
    {
      id: 'zone_3',
      name: 'Brahmaputra Riverbank Caution',
      type: 'caution',
      riskScore: 55,
      polygon: [
        [91.7262, 26.1345],
        [91.7562, 26.1345],
        [91.7562, 26.1445],
        [91.7262, 26.1445],
        [91.7262, 26.1345]
      ],
      description: 'Moderate risk area. Stay alert and follow guidelines.',
      recommendations: [
        'Be aware of surroundings',
        'Avoid isolated areas',
        'Keep emergency contacts ready'
      ]
    },
    {
      id: 'zone_4',
      name: 'Guwahati Airport Safe Zone',
      type: 'safe',
      riskScore: 10,
      polygon: [
        [91.5862, 26.1062],
        [91.5962, 26.1062],
        [91.5962, 26.1162],
        [91.5862, 26.1162],
        [91.5862, 26.1062]
      ],
      description: 'Highly secure airport area with 24/7 monitoring.',
      recommendations: [
        'Follow airport security protocols',
        'Safe for all travelers',
        'Emergency services on site'
      ]
    }
  ];

  // Initialize geozones
  useEffect(() => {
    setGeozones(mockGeozones);
  }, []);

  // Check if point is in any geozone
  const checkGeofences = useCallback((location) => {
    if (!location || !geozones.length) return null;

    const userPoint = point([location.lng, location.lat]);
    
    for (const zone of geozones) {
      const zonePolygon = polygon([zone.polygon]);
      
      if (booleanPointInPolygon(userPoint, zonePolygon)) {
        return zone;
      }
    }
    
    return null;
  }, [geozones]);

  // Handle geofence entry/exit
  const handleGeofenceChange = useCallback((newZone, oldZone, location) => {
    const now = new Date().toISOString();
    
    // Zone exit
    if (oldZone && !newZone) {
      const exitAlert = {
        id: `exit_${oldZone.id}_${Date.now()}`,
        type: 'zone_exit',
        title: `Left ${oldZone.name}`,
        message: `You have exited the ${oldZone.type} zone: ${oldZone.name}`,
        zone: oldZone,
        location,
        timestamp: now,
        severity: 'info'
      };
      setActiveAlerts(prev => [exitAlert, ...prev]);
    }
    
    // Zone entry
    if (newZone && newZone.id !== oldZone?.id) {
      const severity = newZone.type === 'danger' ? 'high' : 
                     newZone.type === 'caution' ? 'medium' : 'low';
      
      const entryAlert = {
        id: `entry_${newZone.id}_${Date.now()}`,
        type: 'zone_entry',
        title: `Entered ${newZone.name}`,
        message: `You have entered a ${newZone.type} zone: ${newZone.name}`,
        description: newZone.description,
        recommendations: newZone.recommendations,
        zone: newZone,
        location,
        timestamp: now,
        severity,
        requiresAcknowledgment: newZone.type === 'danger'
      };
      
      setActiveAlerts(prev => [entryAlert, ...prev]);
      
      // Trigger browser notification for danger zones
      if (newZone.type === 'danger' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('⚠️ Danger Zone Alert', {
            body: `You have entered ${newZone.name}. Exercise extreme caution.`,
            icon: '/favicon.ico',
            tag: 'danger-zone'
          });
        }
      }
    }
  }, []);

  // Update location and check geofences
  const updateLocation = useCallback((location) => {
    setCurrentLocation(location);
    
    if (isMonitoring) {
      const currentZone = checkGeofences(location);
      
      if (currentZone?.id !== lastKnownZone?.id) {
        handleGeofenceChange(currentZone, lastKnownZone, location);
        setLastKnownZone(currentZone);
      }
    }
  }, [isMonitoring, checkGeofences, handleGeofenceChange, lastKnownZone]);

  // Start geofence monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Get initial location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          updateLocation(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Guwahati coordinates for demo
          updateLocation({ lat: 26.1445, lng: 91.7362 });
        }
      );
      
      // Watch position changes
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          updateLocation(location);
        },
        (error) => console.error('Error watching location:', error),
        { enableHighAccuracy: true, timeout: 60000, maximumAge: 30000 }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [updateLocation]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    setLastKnownZone(null);
  }, []);

  // Acknowledge alert
  const acknowledgeAlert = useCallback((alertId) => {
    setActiveAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true, acknowledgedAt: new Date().toISOString() }
          : alert
      )
    );
  }, []);

  // Dismiss alert
  const dismissAlert = useCallback((alertId) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  // Get current zone info
  const getCurrentZoneInfo = useCallback(() => {
    if (!currentLocation) return null;
    return checkGeofences(currentLocation);
  }, [currentLocation, checkGeofences]);

  // Simulate location for demo purposes
  const simulateLocationChange = useCallback((lat, lng) => {
    updateLocation({ lat, lng });
  }, [updateLocation]);

  return (
    <GeofenceContext.Provider
      value={{
        geozones,
        currentLocation,
        activeAlerts,
        isMonitoring,
        lastKnownZone,
        startMonitoring,
        stopMonitoring,
        updateLocation,
        acknowledgeAlert,
        dismissAlert,
        getCurrentZoneInfo,
        simulateLocationChange,
        checkGeofences
      }}
    >
      {children}
    </GeofenceContext.Provider>
  );
};

export const useGeofence = () => {
  const context = useContext(GeofenceContext);
  if (!context) {
    throw new Error('useGeofence must be used within a GeofenceProvider');
  }
  return context;
};

export default GeofenceContext;