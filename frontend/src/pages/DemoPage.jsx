import React, { useState, useEffect } from 'react';
import { useDemoMode } from '../contexts/DemoModeContext';
import { useDigitalID } from '../contexts/DigitalIDContext';
import { useGeofence } from '../contexts/GeofenceContext';
import { useGuardian } from '../contexts/GuardianContext';
import { useMeshRelay } from '../contexts/MeshRelayContext';
import { useSafetyIndex } from '../contexts/SafetyIndexContext';
import { useSafety } from '../contexts/SafetyContext';
import DigitalIDCard from '../components/safety/DigitalIDCard';
import SafetyIndexWidget from '../components/safety/SafetyIndexWidget';
import GeofenceAlerts from '../components/safety/GeofenceAlerts';
import GuardianMode from '../components/safety/GuardianMode';
import MeshRelayControl from '../components/safety/MeshRelayControl';
import AIControlPanel from '../components/ai/AIControlPanel';
import AIPredictiveAlerts from '../components/ai/AIPredictiveAlerts';
import AIAnomalyDetection from '../components/ai/AIAnomalyDetection';
import AIMultilingualSupport from '../components/ai/AIMultilingualSupport';
import AIDashboardSummary from '../components/ai/AIDashboardSummary';

const DemoPage = () => {
  const { isDemoMode, demoScenario, enableDemoMode } = useDemoMode();
  const { digitalID, generateDigitalID } = useDigitalID();
  const { currentZone, simulateLocationUpdate } = useGeofence();
  const { assignedGuardian, assignGuardian } = useGuardian();
  const { isOfflineMode, relayHistory } = useMeshRelay();
  const { safetyScore } = useSafetyIndex();
  const { sendSOS } = useSafety();

  const [currentDemo, setCurrentDemo] = useState('overview');
  const [demoProgress, setDemoProgress] = useState(0);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('I need help, where is the nearest hospital?');
  
  // Demo SOS states
  const [demoSOSCountdown, setDemoSOSCountdown] = useState(null);
  const [isDemoSOSActive, setIsDemoSOSActive] = useState(false);
  const [lastDemoSOS, setLastDemoSOS] = useState(null);
  
  // Handle demo SOS activation
  const handleDemoSOS = () => {
    if (isDemoSOSActive || demoSOSCountdown !== null) return;
    
    setDemoSOSCountdown(3);
    
    const timer = setInterval(() => {
      setDemoSOSCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerDemoSOS();
          setDemoSOSCountdown(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const cancelDemoSOS = () => {
    setDemoSOSCountdown(null);
  };
  
  const triggerDemoSOS = () => {
    setIsDemoSOSActive(true);
    
    // Use setTimeout to avoid calling sendSOS during render
    setTimeout(() => {
      try {
        // Simulate SOS alert (demo mode only)
        const demoAlert = sendSOS();
        console.log('🎬 DEMO SOS Alert:', demoAlert);
        console.log('📍 Demo Location: Guwahati Tourist Area');
        console.log('🔔 Demo Notification: Emergency services notified (SIMULATION)');
        console.log('👮 Demo Guardian: Hotel Taj assigned as guardian');
        console.log('📱 Demo Contacts: Priya Sharma and Bhawesh Bhaskar notified (SIMULATION)');
      } catch (error) {
        console.error('Demo SOS failed:', error);
      }
    }, 0);
    
    // Audio feedback - simple and reliable approach
    try {
      // Create a simple beep using HTML5 Audio with a data URL
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // Create a short beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure the beep
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      console.log('🔊 Beep sound played successfully');
    } catch (error) {
      console.log('Audio context failed, trying alternative:', error);
      
      // Fallback: try to play a system sound
      try {
        // Create an HTML audio element with a simple tone
        const audio = document.createElement('audio');
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8tmQQAoUXrTp66hVFApGn+DyvmMYBTyLj-ngnZ5NFAhVqOX1uWkdBD2S2dPXGZINJxhEJwI5JgQdZa/s5sBUEAlKotv5unQgBz-X2PPZHZ0NGk4KQCH2x2omBAhPpen2vWkdB';
        audio.volume = 0.3;
        audio.play().catch(e => console.log('HTML audio fallback also failed:', e));
      } catch (e) {
        console.log('All audio methods failed');
      }
    }
    
    // Vibration feedback if available
    if ('vibrator' in navigator || 'vibrate' in navigator) {
      navigator.vibrate?.([200, 100, 200, 100, 200]); // SOS pattern in morse code
    }
    
    // Browser notification
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🎬 Demo SOS Alert', {
          body: 'Demo emergency alert sent successfully!',
          icon: '/favicon.ico',
          tag: 'demo-sos-alert',
          requireInteraction: false
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('🎬 Demo SOS Alert', {
              body: 'Demo emergency alert sent successfully!',
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
    
    setLastDemoSOS(new Date());
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsDemoSOSActive(false);
    }, 3000);
  };
  
  const getDemoSOSButtonText = () => {
    if (isDemoSOSActive) return '✓ DEMO';
    if (demoSOSCountdown !== null) return demoSOSCountdown;
    return '🎬 TEST SOS';
  };
  
  const getDemoSOSButtonClass = () => {
    if (isDemoSOSActive) {
      return 'bg-green-500 text-white';
    }
    if (demoSOSCountdown !== null) {
      return 'bg-yellow-500 text-white animate-pulse';
    }
    return 'bg-orange-600 hover:bg-orange-700 text-white';
  };

  useEffect(() => {
    if (!isDemoMode) {
      enableDemoMode();
    }
  }, [isDemoMode, enableDemoMode]);

  const demoSections = [
    {
      id: 'overview',
      title: 'TourSafe Overview',
      description: 'Complete tourist safety ecosystem'
    },
    {
      id: 'digital-id',
      title: 'Digital ID System',
      description: 'Blockchain-anchored time-bound tourist identification'
    },
    {
      id: 'safety-monitoring',
      title: 'Safety Monitoring',
      description: 'Real-time location tracking and risk assessment'
    },
    {
      id: 'guardian-mode',
      title: 'Guardian Network',
      description: 'Community-based safety support system'
    },
    {
      id: 'emergency-response',
      title: 'Emergency Response',
      description: 'Multi-modal panic alerts and SOS system'
    },
    {
      id: 'mesh-relay',
      title: 'Mesh Network',
      description: 'Offline communication and relay capabilities'
    },
    {
      id: 'ai-features',
      title: 'AI Features',
      description: 'Gemini-powered intelligent safety analysis'
    }
  ];

  const demoData = {
    stats: [
      { label: 'Active Tourists', value: '1,247', icon: '👥' },
      { label: 'Safety Zones', value: '89', icon: '🛡️' },
      { label: 'Guardian Partners', value: '156', icon: '🤝' },
      { label: 'Emergency Alerts', value: '23', icon: '🚨' }
    ],
    features: [
      {
        title: 'Time-bound Digital IDs',
        description: 'Cryptographically secured tourist identification with blockchain anchoring',
        status: 'Active',
        color: 'green'
      },
      {
        title: 'Geofence Detection',
        description: 'Real-time monitoring of tourist locations with risk-zone alerts',
        status: 'Monitoring',
        color: 'blue'
      },
      {
        title: 'Guardian Network',
        description: 'Hotel and local business partnership for tourist assistance',
        status: 'Connected',
        color: 'purple'
      },
      {
        title: 'Silent SOS',
        description: 'Discrete emergency alerts via volume buttons and shake detection',
        status: 'Ready',
        color: 'orange'
      },
      {
        title: 'Mesh Relay',
        description: 'Offline emergency communication through device-to-device relay',
        status: 'Simulated',
        color: 'indigo'
      },
      {
        title: 'Real-time Dashboard',
        description: 'Live monitoring and response coordination for authorities',
        status: 'Online',
        color: 'green'
      },
      {
        title: 'AI Safety Scoring',
        description: 'Gemini-powered dynamic safety assessment with reasoning',
        status: 'Active',
        color: 'purple'
      },
      {
        title: 'Predictive Alerts',
        description: 'AI-powered risk prediction based on location and context',
        status: 'Learning',
        color: 'blue'
      },
      {
        title: 'Multilingual Support',
        description: 'Real-time translation for 10+ Indian languages via AI',
        status: 'Ready',
        color: 'orange'
      }
    ]
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-4">🌍 TourSafe Safety Ecosystem</h1>
        <p className="text-xl mb-6">
          Complete digital safety infrastructure for tourists and authorities
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {demoData.stats.map((stat, index) => (
            <div key={index} className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoData.features.map((feature, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{feature.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${feature.color}-100 text-${feature.color}-800`}>
                {feature.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🚀 Quick Demo Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setCurrentDemo('digital-id')}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <div className="text-2xl mb-2">🆔</div>
            <div className="text-sm">Generate ID</div>
          </button>
          <button
            onClick={() => setCurrentDemo('safety-monitoring')}
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            <div className="text-2xl mb-2">📍</div>
            <div className="text-sm">Monitor Safety</div>
          </button>
          <button
            onClick={() => setCurrentDemo('emergency-response')}
            className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            <div className="text-2xl mb-2">🚨</div>
            <div className="text-sm">Test SOS</div>
          </button>
          <button
            onClick={() => setCurrentDemo('mesh-relay')}
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <div className="text-2xl mb-2">📡</div>
            <div className="text-sm">Mesh Demo</div>
          </button>
          <button
            onClick={() => setCurrentDemo('ai-features')}
            className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm">AI Features</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDigitalID = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">🆔 Digital ID System</h2>
        <p className="text-gray-600 mb-6">
          Secure, time-bound digital identification for tourists with blockchain anchoring
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <DigitalIDCard />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">System Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> SHA-256 hash anchoring</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Time-bound validity</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> QR code generation</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Tamper detection</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Privacy protection</li>
            </ul>
            
            {!digitalID && (
              <button
                onClick={() => generateDigitalID({
                  name: 'Demo Tourist',
                  passport: 'P123456789',
                  itinerary: [{ place: 'Guwahati', from: '2024-01-15', to: '2024-01-20' }]
                })}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Demo ID
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSafetyMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">🛡️ Safety Monitoring</h2>
        <p className="text-gray-600 mb-6">
          Real-time location monitoring with dynamic risk assessment
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <SafetyIndexWidget />
            <div className="mt-4">
              <GeofenceAlerts />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Monitoring Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Real-time location tracking</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Geofence boundary detection</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Dynamic safety scoring</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Risk zone alerts</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Crowd density analysis</li>
            </ul>
            
            <button
              onClick={() => simulateLocationUpdate({
                lat: 26.1445,
                lng: 91.7362,
                name: 'High Risk Zone'
              })}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Simulate Zone Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGuardianMode = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">🤝 Guardian Network</h2>
        <p className="text-gray-600 mb-6">
          Community-based safety support through local partnerships
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <GuardianMode />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Guardian Network</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Hotel partnerships</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Tourism centers</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Local businesses</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Emergency contacts</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Instant notifications</li>
            </ul>
            
            {!assignedGuardian && (
              <button
                onClick={() => assignGuardian({ lat: 26.1445, lng: 91.7362 })}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Find Guardian
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyResponse = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">🚨 Emergency Response</h2>
        <p className="text-gray-600 mb-6">
          Multi-modal emergency alert system with silent SOS capabilities
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Alert Methods</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><span className="text-red-500 mr-2">🚨</span> Panic button</li>
              <li className="flex items-center"><span className="text-blue-500 mr-2">🔉</span> Volume key SOS</li>
              <li className="flex items-center"><span className="text-orange-500 mr-2">📳</span> Shake detection</li>
              <li className="flex items-center"><span className="text-purple-500 mr-2">🤫</span> Silent mode</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">📱</span> Guardian notification</li>
            </ul>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Demo SOS Test</h4>
              <p className="text-sm text-red-600 mb-3">
                Experience the emergency alert system with realistic audio and vibration feedback.
              </p>
              
              {/* Demo SOS Button */}
              <div className="flex flex-col items-center space-y-3">
                <button
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm shadow-lg transition-all transform hover:scale-105 ${
                    getDemoSOSButtonClass()
                  }`}
                  onClick={handleDemoSOS}
                  disabled={isDemoSOSActive}
                  aria-label="Demo SOS Button"
                  title="Demo emergency alert - click to test with sound"
                  onMouseDown={() => {
                    // Pre-enable audio context on user interaction
                    try {
                      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                      if (audioContext.state === 'suspended') {
                        audioContext.resume();
                      }
                    } catch (e) {
                      // Ignore if audio context fails
                    }
                  }}
                >
                  {getDemoSOSButtonText()}
                </button>
                
                {/* Demo controls */}
                {demoSOSCountdown !== null && (
                  <button
                    onClick={cancelDemoSOS}
                    className="text-xs px-3 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                  >
                    Cancel Demo
                  </button>
                )}
                
                {/* Demo status */}
                <div className="text-center space-y-1">
                  {demoSOSCountdown !== null && (
                    <div className="text-xs text-yellow-600 font-medium animate-pulse">
                      Demo SOS in {demoSOSCountdown}... Click Cancel to stop
                    </div>
                  )}
                  {lastDemoSOS && (
                    <div className="text-xs text-green-600">
                      ✓ Last Demo: {new Date(lastDemoSOS).toLocaleTimeString()}
                    </div>
                  )}
                  {isDemoSOSActive && (
                    <div className="text-xs text-green-600 font-medium">
                      🎬 Emergency alert sent! Help is on the way.
                    </div>
                  )}
                </div>
                
                {/* Demo disclaimer */}
                <div className="text-xs text-gray-600 text-center max-w-xs">
                  <p className="mb-1">⚠️ <strong>Demo Mode Active</strong></p>
                  <p>Emergency alert simulation with audio/vibration feedback</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Response Flow</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                <div className="text-sm">Alert triggered by tourist</div>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                <div className="text-sm">Guardian receives notification</div>
              </div>
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                <div className="text-sm">Dashboard shows real-time alert</div>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                <div className="text-sm">Authorities coordinated response</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMeshRelay = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">📡 Mesh Network Relay</h2>
        <p className="text-gray-600 mb-6">
          Offline emergency communication through device-to-device relay
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <MeshRelayControl />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mesh Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Offline communication</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Device-to-device relay</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Message routing</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Network resilience</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Fallback connectivity</li>
            </ul>
            
            {relayHistory.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Recent Relay Activity</h4>
                <div className="space-y-2">
                  {relayHistory.slice(-3).map((relay, index) => (
                    <div key={index} className="text-xs bg-white p-2 rounded border">
                      <div className="font-mono">{relay.id}</div>
                      <div className="text-gray-500">{relay.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIFeatures = () => (
    <div className="space-y-6">
      {/* AI Control Panel */}
      <AIControlPanel onAIStatusChange={setAiEnabled} />
      
      {/* AI Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Safety Scoring with Enhanced Widget */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            AI-Powered Safety Scoring
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Dynamic safety assessment with AI reasoning instead of static rules
          </p>
          <SafetyIndexWidget />
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>AI Enhancement:</strong> Unlike traditional rule-based scoring, 
              this uses Gemini to analyze contextual factors and provide reasoning for safety scores.
            </p>
          </div>
        </div>

        {/* Predictive Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">⚠️</span>
            Predictive Risk Alerts
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            AI predicts potential risks based on location, time, and behavioral patterns
          </p>
          <AIPredictiveAlerts 
            enabled={aiEnabled} 
            location={{ lat: 26.1445, lng: 91.7362 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Detection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">🔍</span>
            AI Anomaly Detection
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Detects unusual tourist behavior patterns that might indicate emergencies
          </p>
          <AIAnomalyDetection enabled={aiEnabled} />
        </div>

        {/* Multilingual Support */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">🌐</span>
            AI Translation Support
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Real-time translation for emergency messages in 10+ Indian languages
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Message:
            </label>
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <AIMultilingualSupport 
            message={currentMessage}
            enabled={aiEnabled}
            showLanguageSelector={true}
            autoDetectLanguage={false}
          />
        </div>
      </div>

      {/* Dashboard Summary for Authorities */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">📊</span>
          AI Command Summary for Authorities
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Intelligent dashboard summarization helps authorities quickly understand the current situation
        </p>
        <AIDashboardSummary 
          enabled={aiEnabled}
          refreshInterval={60000}
          showDetailedBreakdown={true}
        />
      </div>

      {/* AI Demo Benefits */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">✨</span>
          Why AI Makes TourSafe Different
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Traditional Approach:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Static rule-based safety scoring</li>
              <li>• Manual risk assessment</li>
              <li>• Limited language support</li>
              <li>• Generic alert messages</li>
              <li>• Time-consuming incident analysis</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">TourSafe AI Approach:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• 🤖 Dynamic AI-powered safety reasoning</li>
              <li>• 🎯 Predictive risk analysis</li>
              <li>• 🌐 Real-time multilingual support</li>
              <li>• ⚡ Context-aware personalized alerts</li>
              <li>• 📊 Intelligent situation summarization</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white bg-opacity-60 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Demo Impact:</strong> The AI integration makes TourSafe appear as an actual 
            intelligent agent analyzing tourist behavior and providing contextual insights, 
            rather than just another location tracking app.
          </p>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentDemo) {
      case 'digital-id': return renderDigitalID();
      case 'safety-monitoring': return renderSafetyMonitoring();
      case 'guardian-mode': return renderGuardianMode();
      case 'emergency-response': return renderEmergencyResponse();
      case 'mesh-relay': return renderMeshRelay();
      case 'ai-features': return renderAIFeatures();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">TourSafe Demo</h1>
              {isDemoMode && (
                <span className="ml-3 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                  🎬 Demo Mode
                </span>
              )}
            </div>
            
            <nav className="flex space-x-4">
              {demoSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentDemo(section.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentDemo === section.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentSection()}
      </div>
    </div>
  );
};

export default DemoPage;