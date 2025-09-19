import React, { useState } from 'react';
import { useMeshRelay } from '../../contexts/MeshRelayContext';
import { useSafety } from '../../contexts/SafetyContext';

const MeshRelayControl = () => {
  const {
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
    sendEmergencySOSViaMesh,
    getMeshStatus
  } = useMeshRelay();

  const { userLocation } = useSafety();
  const [showDetails, setShowDetails] = useState(false);
  const [testMessage, setTestMessage] = useState('Test emergency alert via mesh network');

  const meshStatus = getMeshStatus();

  const handleTestEmergency = async () => {
    if (!userLocation) {
      alert('Location not available. Please enable location services.');
      return;
    }

    try {
      const result = await sendEmergencySOSViaMesh(userLocation, testMessage);
      if (result.success) {
        alert('Emergency SOS sent via mesh network!');
      } else {
        alert(`Failed to send SOS: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const getDeviceTypeIcon = (type) => {
    switch (type) {
      case 'hotel_device': return '🏨';
      case 'tourist_device': return '📱';
      case 'guide_device': return '🗺️';
      case 'emergency_device': return '🚨';
      default: return '📡';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'discovering': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100';
      case 'discovering': return 'bg-yellow-100';
      case 'disconnected': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Mesh Relay Network</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBgColor(relayStatus)} ${getStatusColor(relayStatus)}`}>
          {relayStatus.toUpperCase()}
        </div>
      </div>

      {/* Demo Mode Banner */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>🔬 Demo Mode:</strong> This simulates mesh relay functionality for offline emergency communication. 
          In real deployment, this would use Bluetooth, WiFi Direct, or LoRa technology.
        </p>
      </div>

      {/* Control Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Offline Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isOfflineMode}
                onChange={toggleOfflineMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-xs text-gray-600">
            Simulate no internet connectivity and enable mesh networking
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Relay Device</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isRelayDevice}
                onChange={toggleRelayMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          <p className="text-xs text-gray-600">
            Allow this device to relay messages for others
          </p>
        </div>
      </div>

      {/* Network Status */}
      {isOfflineMode && (
        <div className="mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Network Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{meshStatus.connectedDevices}</div>
                <div className="text-gray-600">Devices</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{meshStatus.signalStrength}%</div>
                <div className="text-gray-600">Avg Signal</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">{meshStatus.pendingAlerts}</div>
                <div className="text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{meshStatus.relayedAlerts}</div>
                <div className="text-gray-600">Relayed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 mb-4">
        {!isOfflineMode ? (
          <button
            onClick={toggleOfflineMode}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enable Offline Mode
          </button>
        ) : (
          <>
            {relayStatus === 'disconnected' && (
              <button
                onClick={discoverNearbyDevices}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Discover Devices
              </button>
            )}
            
            {relayStatus === 'discovering' && (
              <div className="text-center py-2">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600">Discovering devices...</span>
                </div>
              </div>
            )}

            {relayStatus === 'connected' && (
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Test message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleTestEmergency}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  🚨 Test Emergency SOS via Mesh
                </button>
              </div>
            )}
          </>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Detailed Information */}
      {showDetails && isOfflineMode && (
        <div className="space-y-4">
          {/* Nearby Devices */}
          {nearbyDevices.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Nearby Devices ({nearbyDevices.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {nearbyDevices.map((device) => (
                  <div key={device.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getDeviceTypeIcon(device.type)}</span>
                        <span className="font-medium">{device.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${device.signalStrength > 70 ? 'text-green-600' : device.signalStrength > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          📶 {device.signalStrength}%
                        </span>
                        <span className={`text-xs ${device.batteryLevel > 50 ? 'text-green-600' : device.batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                          🔋 {device.batteryLevel}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{device.distance}m away</span>
                      <span>Last seen: {formatTime(device.lastSeen)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Alerts */}
          {pendingAlerts.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Pending Alerts ({pendingAlerts.length})</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {pendingAlerts.map((alert) => (
                  <div key={alert.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{alert.type}</span>
                      <span className="text-xs text-gray-500">Attempt {alert.attempts}/{alert.maxAttempts}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relayed Alerts */}
          {relayedAlerts.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Successfully Relayed ({relayedAlerts.length})</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {relayedAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="bg-green-50 border border-green-200 rounded-lg p-2 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{alert.type}</span>
                      <span className="text-xs text-green-600">✓ Delivered</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Via: {alert.finalRelayDevice?.name} ({alert.relayPath.length} hops)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relay History */}
          {relayHistory.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Relay History</h4>
              <div className="space-y-1 max-h-24 overflow-y-auto text-xs">
                {relayHistory.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex justify-between text-gray-600">
                    <span>{entry.relayDevice || entry.fromDevice}</span>
                    <span>{formatTime(entry.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MeshRelayControl;