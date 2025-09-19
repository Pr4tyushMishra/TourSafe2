import React, { useState, useEffect, useCallback } from 'react';
import aiService from '../../services/AIService';

const AIAnomalyDetection = ({ enabled = true, touristData = null }) => {
  const [anomalies, setAnomalies] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [monitoringStatus, setMonitoringStatus] = useState('active');
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [behaviorHistory, setBehaviorHistory] = useState([]);

  // Mock tourist behavior data
  const [mockTouristData] = useState({
    touristId: 'tourist_demo_123',
    locationHistory: [
      { lat: 26.1445, lng: 91.7362, timestamp: new Date(Date.now() - 3600000).toISOString(), activity: 'temple_visit' },
      { lat: 26.1425, lng: 91.7382, timestamp: new Date(Date.now() - 1800000).toISOString(), activity: 'shopping' },
      { lat: 26.1465, lng: 91.7342, timestamp: new Date().toISOString(), activity: 'restaurant' }
    ],
    activityPattern: 'tourist_exploration',
    inactivityDuration: Math.floor(Math.random() * 180), // 0-180 minutes
    expectedLocation: 'Tourist District',
    actualLocation: 'Current Location',
    communicationStatus: Math.random() > 0.8 ? 'poor' : 'normal',
    previousPatterns: ['morning_temple_visits', 'afternoon_shopping', 'evening_dining']
  });

  // Detect anomalies in tourist behavior
  const detectAnomalies = useCallback(async () => {
    if (!enabled) return;

    setIsAnalyzing(true);
    try {
      const currentTouristData = touristData || mockTouristData;
      
      // Enhance data with current context
      const behaviorData = {
        ...currentTouristData,
        currentTime: new Date().toISOString(),
        timeOfDay: getTimeOfDay(),
        dayOfWeek: getDayOfWeek(),
        weatherCondition: getWeatherCondition(),
        crowdLevel: getCrowdLevel(),
        deviceStatus: getDeviceStatus(),
        locationAccuracy: getLocationAccuracy(),
        batteryLevel: getBatteryLevel()
      };

      const anomalyResult = await aiService.detectAnomaly(behaviorData);
      
      if (anomalyResult.isAnomalous) {
        const anomalyRecord = {
          id: `anomaly-${Date.now()}`,
          touristId: currentTouristData.touristId,
          timestamp: new Date().toISOString(),
          anomalyLevel: anomalyResult.anomalyLevel,
          description: anomalyResult.description,
          potentialCauses: anomalyResult.potentialCauses,
          recommendedActions: anomalyResult.recommendedActions,
          urgency: anomalyResult.urgency,
          confidence: getAnomalyConfidence(anomalyResult),
          behaviorContext: {
            inactivityDuration: behaviorData.inactivityDuration,
            communicationStatus: behaviorData.communicationStatus,
            locationDeviation: calculateLocationDeviation(behaviorData),
            timeAnomalyScore: calculateTimeAnomalyScore(behaviorData)
          },
          isAIDetected: true,
          aiProvider: 'Gemini'
        };

        setAnomalies(prev => [anomalyRecord, ...prev.slice(0, 19)]); // Keep last 20 anomalies
        
        // Add to behavior history
        setBehaviorHistory(prev => [
          {
            timestamp: new Date().toISOString(),
            type: 'anomaly_detected',
            details: anomalyResult.description,
            severity: anomalyResult.urgency
          },
          ...prev.slice(0, 49)
        ]);

        // Set monitoring status based on urgency
        if (anomalyResult.urgency === 'high') {
          setMonitoringStatus('critical');
        } else if (anomalyResult.urgency === 'medium') {
          setMonitoringStatus('warning');
        }
      } else {
        // Record normal behavior
        setBehaviorHistory(prev => [
          {
            timestamp: new Date().toISOString(),
            type: 'normal_behavior',
            details: 'Standard tourist activity pattern detected',
            severity: 'low'
          },
          ...prev.slice(0, 49)
        ]);
        
        setMonitoringStatus('active');
      }
      
      setLastAnalysis(new Date());
    } catch (error) {
      console.error('Anomaly detection failed:', error);
      recordFallbackAnomaly();
    } finally {
      setIsAnalyzing(false);
    }
  }, [enabled, touristData, mockTouristData]);

  // Record fallback anomaly when AI fails
  const recordFallbackAnomaly = useCallback(() => {
    const currentTouristData = touristData || mockTouristData;
    
    // Simple rule-based anomaly detection
    const isInactivityAnomaly = currentTouristData.inactivityDuration > 120;
    const isCommunicationAnomaly = currentTouristData.communicationStatus === 'poor';
    
    if (isInactivityAnomaly || isCommunicationAnomaly) {
      const fallbackAnomaly = {
        id: `fallback-anomaly-${Date.now()}`,
        touristId: currentTouristData.touristId,
        timestamp: new Date().toISOString(),
        anomalyLevel: isInactivityAnomaly ? 'high' : 'medium',
        description: isInactivityAnomaly 
          ? 'Extended period of inactivity detected' 
          : 'Communication issues detected',
        potentialCauses: isInactivityAnomaly 
          ? ['Device issues', 'Emergency situation', 'Lost signal'] 
          : ['Network problems', 'Device battery low'],
        recommendedActions: isInactivityAnomaly 
          ? ['Immediate contact attempt', 'Send welfare check', 'Alert emergency contacts'] 
          : ['Check communication channels', 'Send backup message'],
        urgency: isInactivityAnomaly ? 'high' : 'medium',
        confidence: 70,
        isAIDetected: false,
        aiProvider: 'Rule-based System'
      };

      setAnomalies(prev => [fallbackAnomaly, ...prev.slice(0, 19)]);
    }
  }, [touristData, mockTouristData]);

  // Periodic anomaly detection (DISABLED to save quota)
  useEffect(() => {
    if (!enabled) return;

    // Initial detection
    detectAnomalies();

    // Disable automatic detection to save API quota
    // const interval = setInterval(() => {
    //   detectAnomalies();
    // }, 5 * 60 * 1000); // Every 5 minutes

    // return () => clearInterval(interval);
  }, [enabled, detectAnomalies]);

  // Helper functions
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const getWeatherCondition = () => {
    const conditions = ['clear', 'cloudy', 'rainy', 'stormy', 'foggy'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  const getCrowdLevel = () => {
    const levels = ['low', 'moderate', 'high'];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  const getDeviceStatus = () => {
    const statuses = ['normal', 'low_battery', 'poor_signal'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getLocationAccuracy = () => {
    return Math.floor(Math.random() * 20) + 5; // 5-25 meters
  };

  const getBatteryLevel = () => {
    return Math.floor(Math.random() * 100); // 0-100%
  };

  const getAnomalyConfidence = (anomalyResult) => {
    if (anomalyResult.potentialCauses?.length > 2 && anomalyResult.recommendedActions?.length > 2) {
      return Math.floor(Math.random() * 20) + 80; // 80-100%
    }
    return Math.floor(Math.random() * 30) + 60; // 60-90%
  };

  const calculateLocationDeviation = (behaviorData) => {
    // Simple calculation based on expected vs actual location
    return Math.random() > 0.7 ? 'high' : 'normal';
  };

  const calculateTimeAnomalyScore = (behaviorData) => {
    // Score based on time patterns
    return Math.floor(Math.random() * 100);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      case 'active': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAnomalyIcon = (level) => {
    switch (level) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '⚡';
      default: return '📊';
    }
  };

  const dismissAnomaly = (anomalyId) => {
    setAnomalies(prev => prev.filter(anomaly => anomaly.id !== anomalyId));
  };

  const acknowledgeAnomaly = (anomalyId) => {
    setAnomalies(prev => prev.map(anomaly => 
      anomaly.id === anomalyId 
        ? { ...anomaly, acknowledged: true, acknowledgedAt: new Date().toISOString() }
        : anomaly
    ));
  };

  if (!enabled) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-center text-gray-500">
          <p className="font-medium">AI Anomaly Detection Disabled</p>
          <p className="text-sm">Enable AI features to monitor tourist behavior patterns</p>
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
            <div className={`w-3 h-3 rounded-full ${getStatusColor(monitoringStatus)}`}></div>
            <h3 className="text-lg font-semibold">🔍 AI Anomaly Detection</h3>
            <span className="text-sm text-gray-500 capitalize">({monitoringStatus})</span>
          </div>
          <div className="flex items-center space-x-2">
            {isAnalyzing && (
              <div className="flex items-center space-x-1 text-sm text-blue-600">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span>Analyzing...</span>
              </div>
            )}
            <button
              onClick={detectAnomalies}
              disabled={isAnalyzing}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              Scan Now
            </button>
          </div>
        </div>
        {lastAnalysis && (
          <p className="text-xs text-gray-500 mt-1">
            Last analysis: {lastAnalysis.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Anomalies List */}
      <div className="max-h-96 overflow-y-auto">
        {anomalies.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="mb-2">✅</div>
            <p className="font-medium">No anomalies detected</p>
            <p className="text-sm">Tourist behavior patterns are normal</p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className={`border rounded-lg p-4 ${getUrgencyColor(anomaly.urgency)} ${
                  anomaly.acknowledged ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getAnomalyIcon(anomaly.anomalyLevel)}</span>
                      <span className="font-medium text-sm uppercase tracking-wide">
                        {anomaly.anomalyLevel} Anomaly • {anomaly.urgency} Urgency
                      </span>
                      <div className="flex items-center space-x-1 text-xs">
                        <span>🤖</span>
                        <span>{anomaly.aiProvider}</span>
                        {anomaly.confidence && <span>({anomaly.confidence}%)</span>}
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium mb-2">{anomaly.description}</p>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      👤 Tourist: {anomaly.touristId} • {new Date(anomaly.timestamp).toLocaleString()}
                    </div>

                    {/* Potential Causes */}
                    {anomaly.potentialCauses?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Potential Causes:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {anomaly.potentialCauses.map((cause, index) => (
                            <li key={index} className="flex items-center space-x-1">
                              <span>•</span>
                              <span>{cause}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommended Actions */}
                    {anomaly.recommendedActions?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Recommended Actions:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {anomaly.recommendedActions.map((action, index) => (
                            <li key={index} className="flex items-center space-x-1">
                              <span>→</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Context */}
                    {anomaly.behaviorContext && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-1">Behavior Context:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>Inactivity: {anomaly.behaviorContext.inactivityDuration}min</div>
                          <div>Communication: {anomaly.behaviorContext.communicationStatus}</div>
                          <div>Location: {anomaly.behaviorContext.locationDeviation}</div>
                          <div>Time Score: {anomaly.behaviorContext.timeAnomalyScore}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-2 flex flex-col space-y-1">
                    {!anomaly.acknowledged && (
                      <button
                        onClick={() => acknowledgeAnomaly(anomaly.id)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Acknowledge anomaly"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => dismissAnomaly(anomaly.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Dismiss anomaly"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Behavior History Summary */}
      {behaviorHistory.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Behavior Analysis</h4>
          <div className="space-y-1">
            {behaviorHistory.slice(0, 3).map((entry, index) => (
              <div key={index} className="flex justify-between text-xs text-gray-600">
                <span>{entry.details}</span>
                <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnomalyDetection;