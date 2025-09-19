import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const MeshRelayContext = createContext();

export const MeshRelayProvider = ({ children }) => {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isRelayDevice, setIsRelayDevice] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState([]);
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const [relayedAlerts, setRelayedAlerts] = useState([]);
  const [relayStatus, setRelayStatus] = useState('disconnected'); // disconnected, discovering, connected
  const [relayHistory, setRelayHistory] = useState([]);

  // Mock nearby devices for simulation
  const mockNearbyDevices = [
    {
      id: 'device_hotel_1',
      name: 'Hotel Reception Tablet',
      type: 'hotel_device',
      distance: 25, // meters
      signalStrength: 85,
      lastSeen: new Date().toISOString(),
      canRelay: true,
      batteryLevel: 78
    },
    {
      id: 'device_tourist_2',
      name: 'Tourist Phone (Sarah)',
      type: 'tourist_device',
      distance: 15,
      signalStrength: 92,
      lastSeen: new Date().toISOString(),
      canRelay: true,
      batteryLevel: 45
    },
    {
      id: 'device_guide_3',
      name: 'Tour Guide Device',
      type: 'guide_device',
      distance: 30,
      signalStrength: 72,
      lastSeen: new Date().toISOString(),
      canRelay: true,
      batteryLevel: 88
    },
    {
      id: 'device_emergency_4',
      name: 'Emergency Response Unit',
      type: 'emergency_device',
      distance: 45,
      signalStrength: 68,
      lastSeen: new Date().toISOString(),
      canRelay: true,
      batteryLevel: 95,
      priority: 'high'
    }
  ];

  // Simulate device discovery
  const discoverNearbyDevices = useCallback(() => {
    setRelayStatus('discovering');
    
    // Simulate discovery delay
    setTimeout(() => {
      const availableDevices = mockNearbyDevices.filter(device => 
        device.canRelay && 
        device.signalStrength > 60 &&
        device.batteryLevel > 20
      );
      
      setNearbyDevices(availableDevices);
      setRelayStatus(availableDevices.length > 0 ? 'connected' : 'disconnected');
    }, 2000);
  }, []);

  // Toggle offline mode
  const toggleOfflineMode = useCallback(() => {
    const newOfflineMode = !isOfflineMode;
    setIsOfflineMode(newOfflineMode);
    
    if (newOfflineMode) {
      discoverNearbyDevices();
    } else {
      setNearbyDevices([]);
      setRelayStatus('disconnected');
      setPendingAlerts([]);
    }
  }, [isOfflineMode, discoverNearbyDevices]);

  // Toggle relay device mode
  const toggleRelayMode = useCallback(() => {
    setIsRelayDevice(!isRelayDevice);
  }, [isRelayDevice]);

  // Send alert through mesh network
  const sendAlertViaMesh = useCallback(async (alertData) => {
    if (!isOfflineMode || nearbyDevices.length === 0) {
      return { success: false, error: 'No mesh network available' };
    }

    const alert = {
      id: `mesh_alert_${Date.now()}`,
      ...alertData,
      timestamp: new Date().toISOString(),
      relayPath: [],
      attempts: 0,
      maxAttempts: 3,
      status: 'pending'
    };

    setPendingAlerts(prev => [alert, ...prev]);

    // Simulate relay process
    const relayAlert = async (alert, attempt = 1) => {
      if (attempt > alert.maxAttempts) {
        setPendingAlerts(prev => 
          prev.map(a => a.id === alert.id ? { ...a, status: 'failed' } : a)
        );
        return { success: false, error: 'Max relay attempts exceeded' };
      }

      // Select best relay device (highest priority, signal strength, battery)
      const sortedDevices = [...nearbyDevices].sort((a, b) => {
        const priorityScore = (device) => {
          let score = device.signalStrength + device.batteryLevel;
          if (device.priority === 'high') score += 50;
          if (device.type === 'emergency_device') score += 30;
          if (device.type === 'hotel_device') score += 20;
          return score;
        };
        return priorityScore(b) - priorityScore(a);
      });

      const relayDevice = sortedDevices[0];
      
      if (!relayDevice) {
        return { success: false, error: 'No suitable relay device found' };
      }

      // Simulate relay delay and possible failures
      const relaySuccess = Math.random() > 0.2; // 80% success rate
      const relayDelay = 1000 + (attempt * 500); // Increasing delay per attempt

      await new Promise(resolve => setTimeout(resolve, relayDelay));

      if (relaySuccess) {
        const relayedAlert = {
          ...alert,
          relayPath: [...alert.relayPath, {
            deviceId: relayDevice.id,
            deviceName: relayDevice.name,
            timestamp: new Date().toISOString(),
            attempt
          }],
          status: 'relayed',
          relayedAt: new Date().toISOString(),
          finalRelayDevice: relayDevice
        };

        setPendingAlerts(prev => prev.filter(a => a.id !== alert.id));
        setRelayedAlerts(prev => [relayedAlert, ...prev]);
        setRelayHistory(prev => [
          {
            id: `relay_${Date.now()}`,
            alertId: relayedAlert.id,
            relayDevice: relayDevice.name,
            timestamp: new Date().toISOString(),
            success: true,
            attempts: attempt
          },
          ...prev.slice(0, 19) // Keep last 20 entries
        ]);

        // Simulate final delivery to backend/authorities
        setTimeout(() => {
          console.log('Alert successfully delivered to authorities via mesh relay:', relayedAlert);
        }, 1000);

        return { success: true, alert: relayedAlert };
      } else {
        // Retry with next attempt
        const updatedAlert = { ...alert, attempts: attempt };
        setPendingAlerts(prev => 
          prev.map(a => a.id === alert.id ? updatedAlert : a)
        );
        return relayAlert(updatedAlert, attempt + 1);
      }
    };

    return relayAlert(alert);
  }, [isOfflineMode, nearbyDevices]);

  // Receive relay request (when acting as relay device)
  const handleRelayRequest = useCallback((incomingAlert) => {
    if (!isRelayDevice) return false;

    console.log('Received relay request:', incomingAlert);
    
    // Simulate processing and forwarding
    setTimeout(() => {
      console.log('Forwarding alert to next hop or destination');
      setRelayHistory(prev => [
        {
          id: `relay_received_${Date.now()}`,
          alertId: incomingAlert.id,
          action: 'forwarded',
          timestamp: new Date().toISOString(),
          fromDevice: incomingAlert.sourceDevice || 'unknown'
        },
        ...prev.slice(0, 19)
      ]);
    }, 500);

    return true;
  }, [isRelayDevice]);

  // Get mesh network status
  const getMeshStatus = useCallback(() => {
    return {
      isOfflineMode,
      isRelayDevice,
      relayStatus,
      connectedDevices: nearbyDevices.length,
      pendingAlerts: pendingAlerts.length,
      relayedAlerts: relayedAlerts.length,
      batteryOptimal: nearbyDevices.filter(d => d.batteryLevel > 50).length,
      signalStrength: nearbyDevices.length > 0 
        ? Math.round(nearbyDevices.reduce((sum, d) => sum + d.signalStrength, 0) / nearbyDevices.length)
        : 0
    };
  }, [isOfflineMode, isRelayDevice, relayStatus, nearbyDevices, pendingAlerts, relayedAlerts]);

  // Auto-refresh nearby devices when in offline mode
  useEffect(() => {
    if (isOfflineMode) {
      const interval = setInterval(() => {
        // Simulate device movement and availability changes
        setNearbyDevices(prev => prev.map(device => ({
          ...device,
          signalStrength: Math.max(30, Math.min(100, device.signalStrength + (Math.random() - 0.5) * 10)),
          batteryLevel: Math.max(0, device.batteryLevel - Math.random() * 2),
          lastSeen: new Date().toISOString()
        })));
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isOfflineMode]);

  // Simulate emergency SOS via mesh
  const sendEmergencySOSViaMesh = useCallback(async (location, message = 'Emergency SOS - Immediate assistance required') => {
    const sosAlert = {
      type: 'emergency_sos',
      priority: 'critical',
      message,
      location,
      touristId: 'tourist_demo_123',
      sourceDevice: 'my_device',
      requiresResponse: true
    };

    return sendAlertViaMesh(sosAlert);
  }, [sendAlertViaMesh]);

  return (
    <MeshRelayContext.Provider
      value={{
        isOfflineMode,
        isRelayDevice,
        nearbyDevices,
        pendingAlerts,
        relayedAlerts,
        relayStatus,
        relayHistory,
        toggleOfflineMode,
        toggleRelayMode,
        discoverNearbyDevices,
        sendAlertViaMesh,
        sendEmergencySOSViaMesh,
        handleRelayRequest,
        getMeshStatus
      }}
    >
      {children}
    </MeshRelayContext.Provider>
  );
};

export const useMeshRelay = () => {
  const context = useContext(MeshRelayContext);
  if (!context) {
    throw new Error('useMeshRelay must be used within a MeshRelayProvider');
  }
  return context;
};

export default MeshRelayContext;