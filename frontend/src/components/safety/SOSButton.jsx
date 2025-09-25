import React, { useState, useEffect, useRef } from 'react';
import { useSafety } from '../../contexts/SafetyContext';
import { useMeshRelay } from '../../contexts/MeshRelayContext';
import { useGuardian } from '../../contexts/GuardianContext';

const SOSButton = ({ className = '' }) => {
  const { sendSOS, userLocation, safetyAlerts } = useSafety();
  const { sendEmergencySOSViaMesh, isOfflineMode } = useMeshRelay();
  const { notifyGuardian, isGuardianModeActive } = useGuardian();
  const [isActivating, setIsActivating] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [silentMode, setSilentMode] = useState(false);
  const [shakeDetectionEnabled, setShakeDetectionEnabled] = useState(true);
  const [volumeKeysEnabled, setVolumeKeysEnabled] = useState(true);
  const [lastActivation, setLastActivation] = useState(null);
  const lastShakeTime = useRef(0);
  const countdownTimer = useRef(null);
  const shakeThreshold = 15; // Acceleration threshold for shake detection

  // Enhanced SOS function with multiple dispatch methods
  const triggerSOS = async (mode = 'normal') => {
    try {
      setIsActivating(true);
      
      // Create comprehensive SOS data
      const sosData = {
        touristId: 'tourist_demo_123',
        location: userLocation || { lat: 0, lng: 0 },
        message: mode === 'silent' ? 'Silent SOS - Covert assistance needed' : 'Emergency SOS - Immediate assistance required',
        priority: 'critical',
        alertType: 'sos',
        mode: mode,
        timestamp: new Date().toISOString()
      };

      // 1. Send through main safety system
      const mainAlert = sendSOS();
      console.log('🚨 SOS Alert sent through main system:', mainAlert);
      
      // 2. Notify Guardian if active
      if (isGuardianModeActive) {
        try {
          await notifyGuardian(sosData);
          console.log('👮 Guardian notified successfully');
        } catch (error) {
          console.error('Failed to notify guardian:', error);
        }
      }
      
      // 3. Try mesh relay if offline or as backup
      if (isOfflineMode || mode === 'mesh') {
        try {
          await sendEmergencySOSViaMesh(sosData.location, sosData.message);
          console.log('📡 SOS sent via mesh network');
        } catch (error) {
          console.error('Failed to send via mesh:', error);
        }
      }
      
      // 4. Browser notification if available
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('🚨 SOS Alert Sent', {
            body: 'Emergency services have been notified. Help is on the way.',
            icon: '/favicon.ico',
            tag: 'sos-alert',
            requireInteraction: true
          });
        } else if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            new Notification('🚨 SOS Alert Sent', {
              body: 'Emergency services have been notified.',
              icon: '/favicon.ico'
            });
          }
        }
      }
      
      // 5. Vibrate if available (mobile devices)
      if ('vibrator' in navigator || 'vibrate' in navigator) {
        navigator.vibrate?.([200, 100, 200, 100, 200]); // SOS pattern in morse code
      }
      
      // 6. Audio alert (if not silent mode)
      if (mode !== 'silent') {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800; // High frequency for alert
          gainNode.gain.value = 0.1;
          
          oscillator.start();
          setTimeout(() => oscillator.stop(), 200);
        } catch (error) {
          console.log('Audio alert not available');
        }
      }
      
      setLastActivation(new Date());
      
      // Show success feedback
      setTimeout(() => {
        setIsActivating(false);
      }, 2000);
      
      return mainAlert;
    } catch (error) {
      console.error('SOS activation failed:', error);
      setIsActivating(false);
      throw error;
    }
  };

  // Shake detection for silent SOS
  useEffect(() => {
    if (!shakeDetectionEnabled) return;

    const handleDeviceMotion = (event) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      
      const now = Date.now();
      if (acceleration > shakeThreshold && now - lastShakeTime.current > 1000) {
        lastShakeTime.current = now;
        // Double shake detection within 2 seconds
        setTimeout(() => {
          if (now - lastShakeTime.current < 2000) {
            console.log('🤳 Shake detected - triggering silent SOS');
            triggerSOS('silent');
          }
        }, 500);
      }
    };

    if ('DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleDeviceMotion);
      return () => window.removeEventListener('devicemotion', handleDeviceMotion);
    }
  }, [shakeDetectionEnabled]);

  // Volume key detection for silent SOS
  useEffect(() => {
    if (!volumeKeysEnabled) return;

    let volumeKeyPressCount = 0;
    let volumeKeyTimer;

    const handleKeyDown = (event) => {
      // Volume up/down keys (browser dependent)
      if (event.keyCode === 187 || event.keyCode === 189 || 
          event.key === 'VolumeUp' || event.key === 'VolumeDown' ||
          event.keyCode === 175 || event.keyCode === 174) {
        event.preventDefault();
        volumeKeyPressCount++;
        
        if (volumeKeyPressCount === 1) {
          volumeKeyTimer = setTimeout(() => {
            volumeKeyPressCount = 0;
          }, 3000); // Reset after 3 seconds
        }
        
        if (volumeKeyPressCount >= 5) { // 5 rapid volume key presses
          clearTimeout(volumeKeyTimer);
          volumeKeyPressCount = 0;
          console.log('🔊 Volume keys detected - triggering silent SOS');
          triggerSOS('silent');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(volumeKeyTimer);
    };
  }, [volumeKeysEnabled]);

  // Handle button press with countdown
  const handleButtonPress = () => {
    if (isActivating || countdown !== null) return;
    
    setCountdown(3);
    
    countdownTimer.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer.current);
          triggerSOS(silentMode ? 'silent' : 'normal');
          setCountdown(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cancel countdown if user clicks elsewhere or presses escape
  const cancelCountdown = () => {
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
      setCountdown(null);
    }
  };

  // ESC key to cancel
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && countdown !== null) {
        cancelCountdown();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [countdown]);

  // Auto-cancel countdown if user clicks elsewhere
  useEffect(() => {
    if (countdown !== null) {
      const handleClickOutside = () => cancelCountdown();
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [countdown]);

  const getButtonText = () => {
    if (isActivating) return '✓';
    if (countdown !== null) return countdown;
    return 'SOS';
  };

  const getButtonClass = () => {
    if (isActivating) {
      return 'bg-green-500 text-white';
    }
    if (countdown !== null) {
      return 'bg-yellow-500 text-white animate-pulse';
    }
    if (silentMode) {
      return 'bg-purple-600 hover:bg-purple-700 text-white';
    }
    return 'bg-red-500 hover:bg-red-600 text-white';
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {/* Silent Mode Toggle */}
      <div className="mb-2 text-left">
        <button
          onClick={() => setSilentMode(!silentMode)}
          className={`text-xs px-3 py-1 rounded-full transition-all ${
            silentMode 
              ? 'bg-purple-500 text-white shadow-md' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          title="Toggle Silent SOS Mode - No sound or visible alerts"
        >
          {silentMode ? '🔇 Silent' : '🔊 Normal'}
        </button>
      </div>
      
      {/* Main SOS Button */}
      <button
        className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${
          getButtonClass()
        } ${className}`}
        onClick={handleButtonPress}
        disabled={isActivating}
        aria-label={silentMode ? "Silent SOS Emergency Button" : "SOS Emergency Button"}
        title={countdown !== null ? "Click elsewhere to cancel" : "Click to send SOS alert"}
      >
        {getButtonText()}
      </button>
      
      {/* Status indicators */}
      <div className="mt-2 text-left space-y-1">
        {countdown !== null && (
          <div className="text-xs text-yellow-600 font-medium animate-pulse">
            Click elsewhere to cancel
          </div>
        )}
        {lastActivation && (
          <div className="text-xs text-green-600" title="Last SOS sent">
            ✓ {new Date(lastActivation).toLocaleTimeString()}
          </div>
        )}
        {shakeDetectionEnabled && (
          <div className="text-xs text-gray-600" title="Shake detection enabled">
            📱 Shake to activate
          </div>
        )}
        {volumeKeysEnabled && (
          <div className="text-xs text-gray-600" title="Volume key detection enabled">
            🔊 5x Vol keys
          </div>
        )}
        {isOfflineMode && (
          <div className="text-xs text-blue-600" title="Mesh relay available">
            📶 Mesh available
          </div>
        )}
        {isGuardianModeActive && (
          <div className="text-xs text-green-600" title="Guardian will be notified">
            🛡️ Guardian active
          </div>
        )}
        {safetyAlerts.filter(alert => alert.type === 'emergency').length > 0 && (
          <div className="text-xs text-red-600" title="Active emergency alerts">
            🚨 {safetyAlerts.filter(alert => alert.type === 'emergency').length} alerts
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSButton;
