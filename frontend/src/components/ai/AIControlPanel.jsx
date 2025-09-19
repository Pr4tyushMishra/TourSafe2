import React, { useState, useEffect } from 'react';
import aiService from '../../services/AIService';
import { useSafetyIndex } from '../../contexts/SafetyIndexContext';

const AIControlPanel = ({ onAIStatusChange = null }) => {
  const [isAIEnabled, setIsAIEnabled] = useState(false); // Disabled by default to save quota
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [connectionError, setConnectionError] = useState(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [features, setFeatures] = useState({
    safetyScoring: true,
    predictiveAlerts: true,
    anomalyDetection: true,
    multilingual: true,
    dashboardSummary: true
  });

  const { toggleAI, testAIConnection, aiEnabled } = useSafetyIndex();

  // Test AI connection
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionError(null);
    setIsQuotaExceeded(false);
    
    try {
      const result = await testAIConnection();
      setConnectionStatus(result.connected ? 'connected' : 'failed');
      
      if (!result.connected) {
        setConnectionError(result.error);
        setIsQuotaExceeded(result.isQuotaExceeded || false);
        console.error('AI connection test failed:', result.error);
      }
    } catch (error) {
      setConnectionStatus('failed');
      setConnectionError(error.message);
      console.error('Connection test error:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Toggle AI features
  const handleToggleAI = (enabled) => {
    setIsAIEnabled(enabled);
    toggleAI(enabled);
    if (onAIStatusChange) {
      onAIStatusChange(enabled);
    }
  };

  // Toggle individual features
  const handleFeatureToggle = (feature, enabled) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: enabled
    }));
  };

  // Save API key
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      // In a real app, this would securely save the API key
      localStorage.setItem('gemini_api_key', apiKey);
      alert('API key saved successfully! Please refresh the page to apply changes.');
      setShowApiKeyInput(false);
    }
  };

  // Load saved API key
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Initial connection test (DISABLED to save quota)
  useEffect(() => {
    // Disable automatic connection test to save quota
    // if (isAIEnabled) {
    //   handleTestConnection();
    // }
  }, [isAIEnabled]);

  const getConnectionStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return isQuotaExceeded ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-red-600 bg-red-50 border-red-200';
      case 'testing': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConnectionStatusIcon = (status) => {
    switch (status) {
      case 'connected': return '✅';
      case 'failed': return isQuotaExceeded ? '⏸️' : '❌';
      case 'testing': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <h3 className="text-lg font-semibold text-gray-800">AI Control Panel</h3>
            <span className="text-sm text-gray-500">Powered by Gemini</span>
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Quota Preserved</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">AI Features:</span>
              <button
                onClick={() => handleToggleAI(!isAIEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAIEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAIEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Connection Status:</span>
            <div className={`px-3 py-1 rounded-full text-sm border ${getConnectionStatusColor(
              isTestingConnection ? 'testing' : connectionStatus
            )}`}>
              <span className="mr-1">
                {getConnectionStatusIcon(isTestingConnection ? 'testing' : connectionStatus)}
              </span>
              {isTestingConnection ? 'Testing...' : 
               connectionStatus === 'failed' && isQuotaExceeded ? 'Quota Exceeded' : 
               connectionStatus}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTestConnection}
              disabled={isTestingConnection || !isAIEnabled}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Test Connection
            </button>
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              API Key
            </button>
          </div>
        </div>

        {/* API Key Input */}
        {showApiKeyInput && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gemini API Key:
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Get your API key from{' '}
              <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Google AI Studio
              </a>
            </p>
          </div>
        )}

        {/* Connection Error Details */}
        {connectionStatus === 'failed' && connectionError && (
          <div className={`mt-3 p-3 rounded-md ${
            isQuotaExceeded 
              ? 'bg-orange-50 border border-orange-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`text-sm ${
              isQuotaExceeded ? 'text-orange-800' : 'text-red-800'
            }`}>
              <div className="font-medium mb-1">
                {isQuotaExceeded ? '⏸️ API Quota Exceeded' : '❌ Connection Failed'}
              </div>
              <div className="text-xs">{connectionError}</div>
              {isQuotaExceeded && (
                <div className="mt-2 text-xs">
                  <p>• Free tier daily limit reached (50 requests/day)</p>
                  <p>• Service will resume tomorrow automatically</p>
                  <p>• Consider upgrading to paid plan for higher limits</p>
                  <p>• Fallback mode: Basic safety features still available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI Features Control */}
      {isAIEnabled && (
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">AI Features:</h4>
          <div className="space-y-3">
            {[
              { key: 'safetyScoring', label: 'AI Safety Scoring', description: 'Dynamic safety score calculation with AI reasoning', icon: '🎯' },
              { key: 'predictiveAlerts', label: 'Predictive Alerts', description: 'AI-powered risk prediction and alerts', icon: '⚠️' },
              { key: 'anomalyDetection', label: 'Anomaly Detection', description: 'Unusual behavior pattern detection', icon: '🔍' },
              { key: 'multilingual', label: 'Multilingual Support', description: 'Real-time translation for 10+ Indian languages', icon: '🌐' },
              { key: 'dashboardSummary', label: 'Dashboard Summary', description: 'AI-powered insights for authorities', icon: '📊' }
            ].map((feature) => (
              <div key={feature.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{feature.icon}</span>
                  <div>
                    <div className="font-medium text-sm text-gray-800">{feature.label}</div>
                    <div className="text-xs text-gray-600">{feature.description}</div>
                  </div>
                </div>
                <label className="flex items-center">
                  <button
                    onClick={() => handleFeatureToggle(feature.key, !features[feature.key])}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      features[feature.key] ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        features[feature.key] ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Summary */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <span>
              Status: {isAIEnabled ? (
                <span className="text-green-600 font-medium">AI Features Enabled</span>
              ) : (
                <span className="text-gray-500 font-medium">AI Features Disabled</span>
              )}
            </span>
            <span>
              Active Features: {Object.values(features).filter(Boolean).length}/{Object.keys(features).length}
            </span>
          </div>
          {!isAIEnabled && (
            <p className="text-xs text-yellow-600 mt-1">
              ⚠️ Enable AI features to access intelligent safety analysis and multilingual support
            </p>
          )}
          {isAIEnabled && connectionStatus === 'failed' && !isQuotaExceeded && (
            <p className="text-xs text-red-600 mt-1">
              ❌ Connection failed. Check your API key and internet connection.
            </p>
          )}
          {isAIEnabled && isQuotaExceeded && (
            <p className="text-xs text-orange-600 mt-1">
              ⏸️ AI quota exceeded. Basic safety features remain active. Full AI features resume tomorrow.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIControlPanel;