import React, { useState } from 'react';
import { useDemoMode } from '../../contexts/DemoModeContext';
import DemoScript from './DemoScript';

const DemoControlPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDemoScript, setShowDemoScript] = useState(false);
  const { 
    isDemoMode, 
    enableDemoMode, 
    disableDemoMode, 
    demoScenario, 
    startScenario, 
    stopScenario 
  } = useDemoMode();

  const quickScenarios = [
    {
      id: 'tourist_journey',
      name: 'Tourist Journey',
      description: 'Complete tourist experience from registration to emergency',
      duration: '5 min'
    },
    {
      id: 'emergency_response',
      name: 'Emergency Response',
      description: 'Panic alert → Guardian notification → Dashboard response',
      duration: '2 min'
    },
    {
      id: 'mesh_relay_test',
      name: 'Mesh Relay Test',
      description: 'Offline communication via mesh network simulation',
      duration: '3 min'
    },
    {
      id: 'geofence_demo',
      name: 'Geofence Demo',
      description: 'Location-based safety alerts and zone detection',
      duration: '2 min'
    }
  ];

  if (!isOpen) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-4 right-4 z-40 px-4 py-2 rounded-full shadow-lg transition-all ${
            isDemoMode 
              ? 'bg-orange-600 text-white animate-pulse' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isDemoMode ? '🎬 DEMO MODE' : '🎭 Demo'}
        </button>
        
        {showDemoScript && (
          <DemoScript 
            isOpen={showDemoScript} 
            onClose={() => setShowDemoScript(false)} 
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-hidden">
        {/* Header */}
        <div className={`p-4 ${isDemoMode ? 'bg-orange-100' : 'bg-blue-100'} border-b border-gray-200`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              {isDemoMode ? '🎬 Demo Mode Active' : '🎭 Demo Control'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-80 overflow-y-auto">
          {/* Demo Mode Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Demo Mode</span>
              <button
                onClick={isDemoMode ? disableDemoMode : enableDemoMode}
                className={`w-12 h-6 rounded-full transition-colors ${
                  isDemoMode ? 'bg-orange-500' : 'bg-gray-300'
                } relative`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    isDemoMode ? 'translate-x-6' : 'translate-x-0.5'
                  } absolute top-0.5`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              {isDemoMode 
                ? 'Using simulated data and mock services' 
                : 'Using real data and live services'
              }
            </p>
          </div>

          {/* Demo Script Button */}
          <div className="mb-4">
            <button
              onClick={() => setShowDemoScript(true)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              🚀 Run Full Demo Script
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Complete 6-step demonstration workflow
            </p>
          </div>

          {/* Quick Scenarios */}
          {isDemoMode && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Scenarios</h4>
              <div className="space-y-2">
                {quickScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`p-3 rounded-lg border transition-all ${
                      demoScenario === scenario.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-medium text-gray-800">
                        {scenario.name}
                      </h5>
                      <span className="text-xs text-gray-500">{scenario.duration}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{scenario.description}</p>
                    <div className="flex gap-2">
                      {demoScenario === scenario.id ? (
                        <button
                          onClick={stopScenario}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          ⏹️ Stop
                        </button>
                      ) : (
                        <button
                          onClick={() => startScenario(scenario.id)}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                          ▶️ Start
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demo Status */}
          {isDemoMode && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-xs text-yellow-800">
                <strong>⚠️ Demo Mode Active</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Mock blockchain service</li>
                  <li>Simulated mesh network</li>
                  <li>Test user accounts</li>
                  <li>Mock geofence zones</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Demo Script Modal */}
      {showDemoScript && (
        <DemoScript 
          isOpen={showDemoScript} 
          onClose={() => setShowDemoScript(false)} 
        />
      )}
    </>
  );
};

export default DemoControlPanel;