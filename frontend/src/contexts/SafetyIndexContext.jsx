import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import aiService from '../services/AIService';

const SafetyIndexContext = createContext();

export const SafetyIndexProvider = ({ children }) => {
  const [safetyIndex, setSafetyIndex] = useState(null);
  const [indexHistory, setIndexHistory] = useState([]);
  const [factors, setFactors] = useState({
    geozoneRisk: 0,
    crowdLevel: 0,
    timeOfDay: 0,
    weatherConditions: 0,
    localEvents: 0,
    crimeStatistics: 0
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false); // Disabled by default to save quota
  const [aiInsights, setAiInsights] = useState(null);

  // Mock data for calculations
  const mockTimeZoneRisk = {
    'early-morning': 25, // 12am-6am
    'morning': 10,       // 6am-12pm
    'afternoon': 5,      // 12pm-6pm
    'evening': 15,       // 6pm-9pm
    'night': 30          // 9pm-12am
  };

  const mockWeatherRisk = {
    'clear': 0,
    'cloudy': 5,
    'rain': 15,
    'storm': 30,
    'fog': 20
  };

  const mockCrowdFactors = {
    'low': 0,      // Less crowd = safer
    'moderate': 10,
    'high': 25     // High crowd = higher risk
  };

  // Calculate time-based risk
  const getTimeRisk = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) return mockTimeZoneRisk['early-morning'];
    if (hour >= 6 && hour < 12) return mockTimeZoneRisk['morning'];
    if (hour >= 12 && hour < 18) return mockTimeZoneRisk['afternoon'];
    if (hour >= 18 && hour < 21) return mockTimeZoneRisk['evening'];
    return mockTimeZoneRisk['night'];
  }, []);

  // Calculate weather risk (simulated)
  const getWeatherRisk = useCallback(() => {
    const weatherConditions = ['clear', 'cloudy', 'rain', 'storm', 'fog'];
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    return mockWeatherRisk[randomWeather];
  }, []);

  // Calculate crowd risk
  const getCrowdRisk = useCallback((crowdLevel = 'moderate') => {
    return mockCrowdFactors[crowdLevel] || 10;
  }, []);

  // Get local events risk (simulated)
  const getLocalEventsRisk = useCallback(() => {
    // Simulate local events that might affect safety
    const events = [
      { name: 'No special events', risk: 0, probability: 0.7 },
      { name: 'Local festival', risk: 15, probability: 0.15 },
      { name: 'Political gathering', risk: 25, probability: 0.1 },
      { name: 'Emergency situation', risk: 40, probability: 0.05 }
    ];

    const random = Math.random();
    let cumulative = 0;
    
    for (const event of events) {
      cumulative += event.probability;
      if (random <= cumulative) {
        return { risk: event.risk, event: event.name };
      }
    }
    
    return { risk: 0, event: 'No special events' };
  }, []);

  // Helper functions for AI integration
  const getWeatherCondition = () => {
    const conditions = ['clear', 'cloudy', 'rain', 'storm', 'fog'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  const getCurrentTimeCategory = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) return 'early-morning';
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 21) return 'evening';
    return 'night';
  };

  const getLevelFromScore = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'moderate';
    if (score >= 20) return 'poor';
    return 'dangerous';
  };

  const getColorFromLevel = (level) => {
    const colorMap = {
      'excellent': 'green',
      'good': 'blue',
      'moderate': 'yellow',
      'poor': 'orange',
      'dangerous': 'red'
    };
    return colorMap[level] || 'gray';
  };

  // Traditional safety calculation (fallback)
  const calculateTraditionalSafetyIndex = useCallback(async (params, riskFactors) => {
    const { geozoneRisk, timeRisk, weatherRisk, crowdRisk, localEvents, crimeStats } = riskFactors;
    
    // Weight factors (can be adjusted based on importance)
    const weights = {
      geozone: 0.3,     // 30% - Most important
      time: 0.2,        // 20%
      weather: 0.15,    // 15%
      crowd: 0.15,      // 15%
      events: 0.1,      // 10%
      crime: 0.1        // 10%
    };
    
    // Calculate weighted risk score
    const totalRisk = 
      (geozoneRisk * weights.geozone) +
      (timeRisk * weights.time) +
      (weatherRisk * weights.weather) +
      (crowdRisk * weights.crowd) +
      (localEvents.risk * weights.events) +
      (crimeStats * weights.crime);
    
    // Convert to safety index (100 - risk = safety)
    const rawIndex = Math.max(0, 100 - totalRisk);
    const safetyIndex = Math.round(rawIndex);
    
    // Determine safety level
    let level, color, description;
    if (safetyIndex >= 80) {
      level = 'excellent';
      color = 'green';
      description = 'Very safe area with minimal risks';
    } else if (safetyIndex >= 60) {
      level = 'good';
      color = 'blue';
      description = 'Generally safe with normal precautions';
    } else if (safetyIndex >= 40) {
      level = 'moderate';
      color = 'yellow';
      description = 'Moderate risk - stay alert and cautious';
    } else if (safetyIndex >= 20) {
      level = 'poor';
      color = 'orange';
      description = 'High risk area - exercise extreme caution';
    } else {
      level = 'dangerous';
      color = 'red';
      description = 'Dangerous area - avoid if possible';
    }
    
    return {
      index: safetyIndex,
      level,
      color,
      description,
      timestamp: new Date().toISOString(),
      isAiPowered: false,
      factors: {
        geozoneRisk,
        timeRisk,
        weatherRisk,
        crowdRisk,
        localEventsRisk: localEvents.risk,
        crimeStats,
        localEvent: localEvents.event
      },
      breakdown: {
        'Geozone Risk': `${geozoneRisk.toFixed(1)}% (${(geozoneRisk * weights.geozone).toFixed(1)} weighted)`,
        'Time of Day': `${timeRisk.toFixed(1)}% (${(timeRisk * weights.time).toFixed(1)} weighted)`,
        'Weather': `${weatherRisk.toFixed(1)}% (${(weatherRisk * weights.weather).toFixed(1)} weighted)`,
        'Crowd Level': `${crowdRisk.toFixed(1)}% (${(crowdRisk * weights.crowd).toFixed(1)} weighted)`,
        'Local Events': `${localEvents.risk.toFixed(1)}% (${(localEvents.risk * weights.events).toFixed(1)} weighted)`,
        'Crime Statistics': `${crimeStats.toFixed(1)}% (${(crimeStats * weights.crime).toFixed(1)} weighted)`
      }
    };
  }, []);

  // Calculate comprehensive safety index
  const calculateSafetyIndex = useCallback(async (params = {}) => {
    setIsCalculating(true);
    
    try {
      // Get various risk factors
      const geozoneRisk = params.geozoneRisk || 0;
      const timeRisk = getTimeRisk();
      const weatherRisk = getWeatherRisk();
      const crowdRisk = getCrowdRisk(params.crowdLevel);
      const localEvents = getLocalEventsRisk();
      const crimeStats = params.crimeStatistics || Math.floor(Math.random() * 20); // Simulated
      
      let result;
      
      if (aiEnabled) {
        // AI-Enhanced Safety Calculation
        try {
          const touristData = {
            currentTime: new Date().toLocaleString(),
            areaName: params.areaName || 'Current Location',
            areaRiskLevel: geozoneRisk > 50 ? 'high' : geozoneRisk > 20 ? 'medium' : 'low',
            inactivityDuration: params.inactivityDuration || 0,
            pastIncidents: crimeStats,
            crowdDensity: params.crowdLevel || 'moderate',
            weather: getWeatherCondition(),
            touristProfile: params.touristProfile || 'solo traveler',
            timeOfDay: getCurrentTimeCategory(),
            localEvent: localEvents.event
          };
          
          const aiResult = await aiService.calculateSafetyScore(touristData);
          setAiInsights(aiResult);
          
          result = {
            index: aiResult.safetyScore,
            level: getLevelFromScore(aiResult.safetyScore),
            color: getColorFromLevel(getLevelFromScore(aiResult.safetyScore)),
            description: aiResult.reasoning,
            aiRecommendations: aiResult.recommendations,
            riskLevel: aiResult.riskLevel,
            timestamp: new Date().toISOString(),
            isAiPowered: true,
            factors: {
              geozoneRisk,
              timeRisk,
              weatherRisk,
              crowdRisk,
              localEventsRisk: localEvents.risk,
              crimeStats,
              localEvent: localEvents.event
            },
            aiInsights: {
              reasoning: aiResult.reasoning,
              recommendations: aiResult.recommendations,
              riskLevel: aiResult.riskLevel
            }
          };
        } catch (aiError) {
          console.warn('AI calculation failed, falling back to traditional method:', aiError);
          result = await calculateTraditionalSafetyIndex(params, { geozoneRisk, timeRisk, weatherRisk, crowdRisk, localEvents, crimeStats });
        }
      } else {
        // Traditional calculation
        result = await calculateTraditionalSafetyIndex(params, { geozoneRisk, timeRisk, weatherRisk, crowdRisk, localEvents, crimeStats });
      }
      
      setSafetyIndex(result);
      setFactors(result.factors);
      
      // Add to history
      setIndexHistory(prev => [result, ...prev.slice(0, 23)]); // Keep last 24 entries
      
      setTimeout(() => setIsCalculating(false), 1000);
      
      return result;
      
    } catch (error) {
      console.error('Safety index calculation failed:', error);
      setIsCalculating(false);
      throw error;
    }
  }, [getTimeRisk, getWeatherRisk, getCrowdRisk, getLocalEventsRisk, aiEnabled]);

  // Auto-update safety index every 5 minutes (DISABLED to save quota)
  useEffect(() => {
    calculateSafetyIndex();
    
    // Disable automatic updates to save API quota
    // const interval = setInterval(() => {
    //   calculateSafetyIndex();
    // }, 5 * 60 * 1000); // 5 minutes
    
    // return () => clearInterval(interval);
  }, [calculateSafetyIndex]);

  // Get safety recommendations based on current index
  const getSafetyRecommendations = useCallback(() => {
    if (!safetyIndex) return [];
    
    const recommendations = [];
    const factors = safetyIndex.factors;
    
    if (factors.geozoneRisk > 50) {
      recommendations.push({
        type: 'critical',
        message: 'You are in a high-risk area. Consider leaving or seeking safe shelter.',
        icon: '⚠️'
      });
    }
    
    if (factors.timeRisk > 20) {
      recommendations.push({
        type: 'warning',
        message: 'Current time poses elevated risks. Stay in well-lit, populated areas.',
        icon: '🌙'
      });
    }
    
    if (factors.weatherRisk > 15) {
      recommendations.push({
        type: 'info',
        message: 'Weather conditions may affect safety. Plan accordingly.',
        icon: '🌦️'
      });
    }
    
    if (factors.crowdRisk > 20) {
      recommendations.push({
        type: 'warning',
        message: 'High crowd density detected. Keep belongings secure and stay aware.',
        icon: '👥'
      });
    }
    
    if (factors.localEventsRisk > 20) {
      recommendations.push({
        type: 'warning',
        message: `Local event detected: ${factors.localEvent}. Monitor situation closely.`,
        icon: '📅'
      });
    }
    
    if (safetyIndex.index >= 80) {
      recommendations.push({
        type: 'success',
        message: 'Excellent safety conditions. Enjoy your visit!',
        icon: '✅'
      });
    }
    
    return recommendations;
  }, [safetyIndex]);

  // Force recalculation with new parameters
  const updateSafetyIndex = useCallback(async (params) => {
    return await calculateSafetyIndex(params);
  }, [calculateSafetyIndex]);

  // Toggle AI mode
  const toggleAI = useCallback((enabled) => {
    setAiEnabled(enabled);
    // Recalculate with new mode
    calculateSafetyIndex();
  }, [calculateSafetyIndex]);

  // Test AI connectivity
  const testAIConnection = useCallback(async () => {
    try {
      return await aiService.testConnection();
    } catch (error) {
      console.error('AI connection test failed:', error);
      return { connected: false, error: error.message };
    }
  }, []);

  return (
    <SafetyIndexContext.Provider
      value={{
        safetyIndex,
        indexHistory,
        factors,
        isCalculating,
        aiEnabled,
        aiInsights,
        calculateSafetyIndex,
        updateSafetyIndex,
        getSafetyRecommendations,
        toggleAI,
        testAIConnection
      }}
    >
      {children}
    </SafetyIndexContext.Provider>
  );
};

export const useSafetyIndex = () => {
  const context = useContext(SafetyIndexContext);
  if (!context) {
    throw new Error('useSafetyIndex must be used within a SafetyIndexProvider');
  }
  return context;
};

export default SafetyIndexContext;