import React, { useState } from 'react';
import { useSafetyIndex } from '../../contexts/SafetyIndexContext';
import { useGeofence } from '../../contexts/GeofenceContext';

const SafetyIndexWidget = () => {
  const { 
    safetyIndex, 
    isCalculating, 
    updateSafetyIndex, 
    getSafetyRecommendations,
    indexHistory 
  } = useSafetyIndex();
  
  const { getCurrentZoneInfo } = useGeofence();
  const [showDetails, setShowDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleRefresh = () => {
    const currentZone = getCurrentZoneInfo();
    const params = {
      geozoneRisk: currentZone?.riskScore || 0,
      crowdLevel: 'moderate' // This could come from crowd detection API
    };
    updateSafetyIndex(params);
  };

  const getIndexColor = (index) => {
    if (index >= 80) return 'text-green-600';
    if (index >= 60) return 'text-blue-600';
    if (index >= 40) return 'text-yellow-600';
    if (index >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const getIndexBgColor = (index) => {
    if (index >= 80) return 'bg-green-100';
    if (index >= 60) return 'bg-blue-100';
    if (index >= 40) return 'bg-yellow-100';
    if (index >= 20) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getProgressColor = (index) => {
    if (index >= 80) return 'bg-green-500';
    if (index >= 60) return 'bg-blue-500';
    if (index >= 40) return 'bg-yellow-500';
    if (index >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const recommendations = getSafetyRecommendations();

  if (!safetyIndex) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Safety Index</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isCalculating}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Refresh Safety Index"
          >
            <svg className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Toggle Details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Index Display */}
      <div className={`text-center p-4 rounded-lg mb-4 ${getIndexBgColor(safetyIndex.index)}`}>
        <div className={`text-4xl font-bold ${getIndexColor(safetyIndex.index)}`}>
          {safetyIndex.index}
        </div>
        <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {safetyIndex.level}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {safetyIndex.description}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Dangerous</span>
          <span>Safe</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(safetyIndex.index)}`}
            style={{ width: `${safetyIndex.index}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Last updated: {formatTime(safetyIndex.timestamp)}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
          <div className="space-y-2">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className={`p-2 rounded-lg text-xs ${
                rec.type === 'critical' ? 'bg-red-50 text-red-800' :
                rec.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                rec.type === 'info' ? 'bg-blue-50 text-blue-800' :
                'bg-green-50 text-green-800'
              }`}>
                <span className="mr-2">{rec.icon}</span>
                {rec.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm transition-colors"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm transition-colors"
        >
          {showHistory ? 'Hide' : 'Show'} History
        </button>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Safety Factor Breakdown</h4>
          <div className="space-y-2 text-xs">
            {Object.entries(safetyIndex.breakdown).map(([factor, value]) => (
              <div key={factor} className="flex justify-between">
                <span className="text-gray-600">{factor}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
          
          {safetyIndex.factors.localEvent && safetyIndex.factors.localEvent !== 'No special events' && (
            <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-xs text-yellow-800">
                <strong>Active Event:</strong> {safetyIndex.factors.localEvent}
              </p>
            </div>
          )}
        </div>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent History</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {indexHistory.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{formatTime(entry.timestamp)}</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getProgressColor(entry.index)}`}></div>
                  <span className={`font-medium ${getIndexColor(entry.index)}`}>
                    {entry.index}
                  </span>
                  <span className="text-gray-500 capitalize">{entry.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyIndexWidget;