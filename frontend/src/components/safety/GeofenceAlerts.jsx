import React from 'react';
import { useGeofence } from '../../contexts/GeofenceContext';

const GeofenceAlerts = () => {
  const { 
    activeAlerts, 
    acknowledgeAlert, 
    dismissAlert, 
    getCurrentZoneInfo,
    isMonitoring,
    startMonitoring,
    stopMonitoring 
  } = useGeofence();

  const currentZone = getCurrentZoneInfo();

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-500 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-4">
      {/* Monitoring Control */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Geofence Monitoring</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm">{isMonitoring ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {!isMonitoring ? (
            <button
              onClick={startMonitoring}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Monitoring
            </button>
          ) : (
            <button
              onClick={stopMonitoring}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Stop Monitoring
            </button>
          )}
        </div>

        {/* Current Zone Info */}
        {currentZone && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">Current Zone</p>
            <p className="text-lg font-semibold">{currentZone.name}</p>
            <p className="text-sm text-gray-600">{currentZone.description}</p>
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                currentZone.type === 'danger' ? 'bg-red-100 text-red-800' :
                currentZone.type === 'caution' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {currentZone.type.toUpperCase()} - Risk Score: {currentZone.riskScore}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Active Alerts</h3>
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 rounded-lg p-4 ${getSeverityColor(alert.severity)} ${
                alert.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{alert.title}</h4>
                    <p className="text-sm mt-1">{alert.message}</p>
                    
                    {alert.description && (
                      <p className="text-sm mt-2 font-medium">{alert.description}</p>
                    )}
                    
                    {alert.recommendations && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Safety Recommendations:</p>
                        <ul className="text-sm space-y-1">
                          {alert.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-current rounded-full mr-2"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <p className="text-xs mt-2 opacity-75">
                      {formatTime(alert.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  {alert.requiresAcknowledgment && !alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-xs bg-white px-3 py-1 rounded-full border border-current hover:bg-current hover:text-white transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Alerts Message */}
      {activeAlerts.length === 0 && isMonitoring && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-800 font-medium">All Clear</p>
          <p className="text-green-600 text-sm">No active geofence alerts</p>
        </div>
      )}
    </div>
  );
};

export default GeofenceAlerts;