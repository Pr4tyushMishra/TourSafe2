import React, { useState, useEffect, useContext } from 'react';
import { DigitalIDProvider, useDigitalID } from '../../contexts/DigitalIDContext';
import { GeofenceProvider, useGeofence } from '../../contexts/GeofenceContext';
import { GuardianProvider, useGuardian } from '../../contexts/GuardianContext';
import { MeshRelayProvider, useMeshRelay } from '../../contexts/MeshRelayContext';
import { SafetyIndexProvider, useSafetyIndex } from '../../contexts/SafetyIndexContext';

const DemoScript = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [stepStatus, setStepStatus] = useState({});
  const [demoLogs, setDemoLogs] = useState([]);

  const { generateDigitalID, digitalID } = useDigitalID();
  const { simulateLocationUpdate, currentZone } = useGeofence();
  const { assignGuardian, notifyGuardian } = useGuardian();
  const { sendAlertViaMesh, isOfflineMode, setOfflineMode } = useMeshRelay();
  const { safetyScore } = useSafetyIndex();

  const demoSteps = [
    {
      id: 1,
      title: 'User Registration & Digital ID Creation',
      description: 'Simulate user registration and generate time-bound digital ID with blockchain anchor',
      duration: 3000,
      action: async () => {
        addLog('🔐 Starting user registration...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog('✅ Mock KYC verification completed');
        
        await generateDigitalID({
          name: 'Demo Tourist',
          passport: 'P123456789',
          itinerary: [
            { place: 'Guwahati City Center', from: '2024-01-15', to: '2024-01-20' }
          ]
        });
        
        addLog('🆔 Digital ID generated with QR code');
        addLog('🔗 Blockchain anchor hash created');
        return true;
      }
    },
    {
      id: 2,
      title: 'Location Update & Geofence Detection',
      description: 'Simulate entering a monitored geozone and trigger safety alerts',
      duration: 2000,
      action: async () => {
        addLog('📍 Updating location to enter monitored zone...');
        
        // Simulate entering Guwahati Restricted Zone
        await simulateLocationUpdate({
          lat: 26.1445,
          lng: 91.7362,
          name: 'Guwahati Restricted Zone'
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog('⚠️ Geofence alert triggered - entered high-risk zone');
        addLog(`📊 Safety Index updated: ${safetyScore}/100`);
        return true;
      }
    },
    {
      id: 3,
      title: 'Guardian Mode Assignment',
      description: 'Assign nearby guardian and establish communication channel',
      duration: 2000,
      action: async () => {
        addLog('🤝 Searching for nearby guardians...');
        
        const guardian = await assignGuardian({
          lat: 26.1445,
          lng: 91.7362
        });
        
        addLog(`👮 Guardian assigned: ${guardian.name}`);
        addLog(`📞 Contact: ${guardian.contact}`);
        addLog('✅ Guardian Mode activated');
        return true;
      }
    },
    {
      id: 4,
      title: 'Panic Alert Trigger',
      description: 'Simulate panic button press and alert dispatch',
      duration: 2000,
      action: async () => {
        addLog('🚨 PANIC BUTTON PRESSED!');
        addLog('📤 Dispatching emergency alert...');
        
        const alertData = {
          type: 'PANIC',
          location: { lat: 26.1445, lng: 91.7362 },
          timestamp: new Date().toISOString(),
          touristId: 'demo-tourist-123'
        };
        
        await notifyGuardian(alertData);
        addLog('👮 Guardian notified immediately');
        addLog('🏥 Emergency services contacted');
        return true;
      }
    },
    {
      id: 5,
      title: 'Offline Mesh Relay Simulation',
      description: 'Test mesh relay when primary connection fails',
      duration: 3000,
      action: async () => {
        addLog('📶 Simulating network connectivity loss...');
        setOfflineMode(true);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog('🔄 Activating mesh relay protocol...');
        
        const meshAlert = {
          type: 'MESH_RELAY',
          originalAlert: {
            type: 'PANIC',
            location: { lat: 26.1445, lng: 91.7362 },
            timestamp: new Date().toISOString()
          },
          relayPath: []
        };
        
        await sendAlertViaMesh(meshAlert);
        addLog('📡 Alert relayed via mesh network');
        addLog('✅ Message reached dashboard via relay');
        
        // Restore connection
        setOfflineMode(false);
        addLog('📶 Connection restored');
        return true;
      }
    },
    {
      id: 6,
      title: 'Dashboard Alert Reception',
      description: 'Verify real-time dashboard updates and e-FIR draft',
      duration: 2000,
      action: async () => {
        addLog('🖥️ Dashboard receiving real-time updates...');
        addLog('📊 Alert markers updated on map');
        addLog('🔥 Heatmap visualization refreshed');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog('📋 e-FIR draft generated automatically');
        addLog('🎯 Alert marked as acknowledged');
        addLog('✅ Full demonstration cycle completed!');
        return true;
      }
    }
  ];

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDemoLogs(prev => [...prev, { timestamp, message }]);
  };

  const runStep = async (stepIndex) => {
    const step = demoSteps[stepIndex];
    setStepStatus(prev => ({ ...prev, [step.id]: 'running' }));
    
    try {
      const success = await step.action();
      setStepStatus(prev => ({ ...prev, [step.id]: success ? 'completed' : 'failed' }));
      return success;
    } catch (error) {
      console.error(`Step ${step.id} failed:`, error);
      addLog(`❌ Step failed: ${error.message}`);
      setStepStatus(prev => ({ ...prev, [step.id]: 'failed' }));
      return false;
    }
  };

  const runFullDemo = async () => {
    setIsRunning(true);
    setDemoLogs([]);
    setStepStatus({});
    setCurrentStep(0);
    
    addLog('🚀 Starting TourPal Demo Scenario...');
    addLog('📱 Simulating complete tourist safety workflow');
    
    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      const success = await runStep(i);
      
      if (!success) {
        addLog('🛑 Demo stopped due to step failure');
        break;
      }
      
      // Brief pause between steps
      if (i < demoSteps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    addLog('🎉 Demo completed successfully!');
    setIsRunning(false);
  };

  const runSingleStep = async (stepIndex) => {
    setCurrentStep(stepIndex);
    await runStep(stepIndex);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsRunning(false);
    setStepStatus({});
    setDemoLogs([]);
    setOfflineMode(false);
  };

  const getStepIcon = (stepId) => {
    const status = stepStatus[stepId];
    if (status === 'running') return '🔄';
    if (status === 'completed') return '✅';
    if (status === 'failed') return '❌';
    return '⭕';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">TourSafe Demo Script</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Demo Steps */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-4">Demo Scenario Steps</h3>
              
              <div className="flex gap-2 mb-6">
                <button
                  onClick={runFullDemo}
                  disabled={isRunning}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? '🔄 Running...' : '▶️ Run Full Demo'}
                </button>
                <button
                  onClick={resetDemo}
                  disabled={isRunning}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {demoSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    currentStep === index
                      ? 'border-blue-500 bg-blue-50'
                      : stepStatus[step.id] === 'completed'
                      ? 'border-green-500 bg-green-50'
                      : stepStatus[step.id] === 'failed'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">
                      {getStepIcon(step.id)} Step {step.id}: {step.title}
                    </h4>
                    <button
                      onClick={() => runSingleStep(index)}
                      disabled={isRunning}
                      className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                    >
                      ▶️ Run
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    Duration: {step.duration / 1000}s
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Demo Logs */}
          <div className="w-1/2 p-6 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Demo Execution Log</h3>
            
            <div className="bg-black text-green-400 p-4 rounded-lg h-full overflow-y-auto font-mono text-sm">
              {demoLogs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  🎬 Click "Run Full Demo" to start the scenario
                </div>
              ) : (
                demoLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <strong>Demo Overview:</strong> This script demonstrates the complete TourSafe workflow including
            digital ID creation, geofence detection, guardian assignment, panic alerts, mesh relay simulation,
            and real-time dashboard updates. Each step simulates real-world interactions with the safety system.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoScript;