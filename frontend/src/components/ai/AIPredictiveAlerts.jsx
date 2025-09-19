import React, { useState, useEffect, useCallback } from 'react';
import aiService from '../../services/AIService';
import { useSafety } from '../../contexts/SafetyContext';

const AIPredictiveAlerts = ({ enabled = true, location = null }) => {
  const [alerts, setAlerts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const { userLocation, addSafetyAlert } = useSafety();

  // Generate predictive alerts based on current context
  const generatePredictiveAlert = useCallback(async (customLocation = null) => {
    if (!enabled) return;

    setIsGenerating(true);
    try {
      const currentLocation = customLocation || location || userLocation || { lat: 26.1445, lng: 91.7362 };
      
      // Prepare location data for AI analysis
      const locationData = {
        location: getLocationName(currentLocation),
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        time: new Date().toLocaleString(),
        nearbyPOIs: getMockNearbyPOIs(currentLocation),
        historicalIncidents: Math.floor(Math.random() * 15), // Simulated
        currentEvents: getCurrentEvents(),
        touristBehavior: getTouristBehavior(),
        weather: getWeatherContext(),
        crowdLevel: getCrowdLevel(),
        timeOfDay: getTimeOfDay()
      };

      const aiAlert = await aiService.generatePredictiveAlert(locationData);
      
      if (aiAlert && aiAlert.riskLevel !== 'low') {
        const predictiveAlert = {
          id: `ai-alert-${Date.now()}`,
          type: 'predictive',
          riskLevel: aiAlert.riskLevel,
          message: aiAlert.message,
          specificRisks: aiAlert.specificRisks,
          preventiveMeasures: aiAlert.preventiveMeasures,
          alertPriority: aiAlert.alertPriority,
          location: currentLocation,
          locationName: locationData.location,
          timestamp: new Date().toISOString(),
          isAIGenerated: true,
          confidence: getConfidenceLevel(aiAlert),
          aiProvider: 'Gemini'
        };

        setAlerts(prev => [predictiveAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
        
        // Add to global safety alerts if high priority
        if (aiAlert.alertPriority === 'critical' || aiAlert.riskLevel === 'high') {
          addSafetyAlert({
            id: predictiveAlert.id,
            type: 'ai-predictive',
            message: `🤖 AI Alert: ${aiAlert.message}`,
            location: currentLocation,
            timestamp: predictiveAlert.timestamp,
            status: 'active',
            priority: aiAlert.alertPriority
          });
        }
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to generate predictive alert:', error);
      // Fallback to basic alert
      generateFallbackAlert(customLocation || location || userLocation);
    } finally {
      setIsGenerating(false);
    }
  }, [enabled, location, userLocation, addSafetyAlert]);

  // Generate fallback alert when AI fails
  const generateFallbackAlert = useCallback((currentLocation) => {
    const fallbackAlert = {
      id: `fallback-alert-${Date.now()}`,
      type: 'predictive',
      riskLevel: 'medium',
      message: 'General safety advisory for this area',
      specificRisks: ['Unknown area conditions', 'General safety concerns'],
      preventiveMeasures: ['Stay in well-lit areas', 'Keep emergency contacts ready'],
      alertPriority: 'info',
      location: currentLocation,
      locationName: getLocationName(currentLocation),
      timestamp: new Date().toISOString(),
      isAIGenerated: false,
      confidence: 30,
      aiProvider: 'Fallback System'
    };

    setAlerts(prev => [fallbackAlert, ...prev.slice(0, 9)]);
  }, []);

  // Auto-generate alerts based on location changes
  useEffect(() => {
    if (enabled && (location || userLocation)) {
      const timer = setTimeout(() => {
        generatePredictiveAlert();
      }, 2000); // Delay to avoid too frequent calls

      return () => clearTimeout(timer);
    }
  }, [location, userLocation, enabled, generatePredictiveAlert]);

  // Periodic alert generation (DISABLED to save quota)
  useEffect(() => {
    if (!enabled) return;

    // Disable automatic alert generation to save API quota
    // const interval = setInterval(() => {
    //   generatePredictiveAlert();
    // }, 10 * 60 * 1000); // 10 minutes

    // return () => clearInterval(interval);
  }, [enabled, generatePredictiveAlert]);

  // Helper functions
  const getLocationName = (loc) => {
    const locationNames = [
      'Kamakhya Temple Area', 'Guwahati Railway Station', 'Fancy Bazaar',
      'Pan Bazaar', 'Paltan Bazaar', 'Uzanbazar', 'Bharalumukh',
      'Khanapara', 'Beltola', 'Dispur'
    ];
    return locationNames[Math.floor(Math.random() * locationNames.length)];
  };

  const getMockNearbyPOIs = (loc) => {
    return [
      { name: 'Tourist Information Center', distance: '200m', type: 'safe' },
      { name: 'Local Market', distance: '500m', type: 'crowded' },
      { name: 'Police Station', distance: '1km', type: 'safe' },
      { name: 'Hotel District', distance: '800m', type: 'safe' }
    ];
  };

  const getCurrentEvents = () => {
    const events = ['Normal day', 'Local festival', 'Market day', 'Religious ceremony', 'Political gathering'];
    return events[Math.floor(Math.random() * events.length)];
  };

  const getTouristBehavior = () => {
    const behaviors = ['normal', 'exploring', 'shopping', 'sightseeing', 'dining'];
    return behaviors[Math.floor(Math.random() * behaviors.length)];
  };

  const getWeatherContext = () => {
    const weather = ['clear', 'cloudy', 'light rain', 'heavy rain', 'fog'];
    return weather[Math.floor(Math.random() * weather.length)];
  };

  const getCrowdLevel = () => {
    const levels = ['low', 'moderate', 'high'];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const getConfidenceLevel = (aiAlert) => {
    // Calculate confidence based on AI response quality
    if (aiAlert.specificRisks?.length > 1 && aiAlert.preventiveMeasures?.length > 1) {
      return Math.floor(Math.random() * 20) + 80; // 80-100%
    }
    return Math.floor(Math.random() * 30) + 60; // 60-90%
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskLevelIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '📍';
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (!enabled) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-center text-gray-500">
          <p className="font-medium">AI Predictive Alerts Disabled</p>
          <p className="text-sm">Enable AI features to receive predictive safety alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold">🤖 AI Predictive Alerts</h3>
          </div>
          <div className="flex items-center space-x-2">
            {isGenerating && (
              <div className="flex items-center space-x-1 text-sm text-blue-600">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span>Analyzing...</span>
              </div>
            )}
            <button
              onClick={() => generatePredictiveAlert()}
              disabled={isGenerating}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Generate Alert
            </button>
          </div>
        </div>
        {lastUpdate && (
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Alerts List */}
      <div className="max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="mb-2">🎯</div>
            <p className="font-medium">No predictive alerts</p>
            <p className="text-sm">AI is monitoring your location for potential risks</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${getPriorityColor(alert.alertPriority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getRiskLevelIcon(alert.riskLevel)}</span>
                      <span className="font-medium text-sm uppercase tracking-wide">
                        {alert.riskLevel} Risk • {alert.alertPriority}
                      </span>
                      <div className="flex items-center space-x-1 text-xs">
                        <span>🤖</span>
                        <span>{alert.aiProvider}</span>
                        <span>({alert.confidence}%)</span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium mb-2">{alert.message}</p>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      📍 {alert.locationName} • {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>

                    {/* Specific Risks */}
                    {alert.specificRisks?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Specific Risks:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {alert.specificRisks.map((risk, index) => (
                            <li key={index} className="flex items-center space-x-1">
                              <span>•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Preventive Measures */}
                    {alert.preventiveMeasures?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Recommendations:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {alert.preventiveMeasures.map((measure, index) => (
                            <li key={index} className="flex items-center space-x-1">
                              <span>✓</span>
                              <span>{measure}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Dismiss alert"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPredictiveAlerts;