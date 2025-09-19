import React, { useState, useEffect } from 'react';
import { useGuardian } from '../../contexts/GuardianContext';
import { useSafety } from '../../contexts/SafetyContext';

const GuardianMode = () => {
  const { 
    guardians, 
    activeGuardian, 
    isGuardianModeActive, 
    requestGuardian, 
    cancelGuardianAssignment,
    getNearbyGuardians,
    getGuardianStatus,
    calculateDistance
  } = useGuardian();
  
  const { userLocation } = useSafety();
  const [isRequesting, setIsRequesting] = useState(false);
  const [showGuardianSelection, setShowGuardianSelection] = useState(false);
  const [nearbyGuardians, setNearbyGuardians] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(24);

  useEffect(() => {
    if (userLocation) {
      setNearbyGuardians(getNearbyGuardians(userLocation, 20));
    }
  }, [userLocation, getNearbyGuardians]);

  const handleRequestGuardian = async (guardianId) => {
    setIsRequesting(true);
    try {
      const touristData = {
        id: 'tourist_demo_123',
        name: 'Alex Johnson',
        phone: '+91 98765 43210',
        nationality: 'Indian',
        currentLocation: userLocation
      };

      const result = await requestGuardian(guardianId, touristData, selectedDuration);
      if (result.success) {
        setShowGuardianSelection(false);
      }
    } catch (error) {
      console.error('Error requesting guardian:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getDistanceText = (guardian) => {
    if (!userLocation) return 'Distance unknown';
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      guardian.location.lat,
      guardian.location.lng
    );
    return `${distance.toFixed(1)} km away`;
  };

  const guardianStatus = getGuardianStatus();

  const getGuardianTypeIcon = (type) => {
    switch (type) {
      case 'hotel':
        return '🏨';
      case 'tourism_office':
        return '🏛️';
      case 'tour_operator':
        return '🗺️';
      default:
        return '🛡️';
    }
  };

  if (isGuardianModeActive && guardianStatus.active) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-green-800">Guardian Mode Active</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600">Protected</span>
          </div>
        </div>

        {/* Active Guardian Info */}
        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">
              {getGuardianTypeIcon(guardianStatus.guardian.type)}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{guardianStatus.guardian.name}</h4>
              <p className="text-gray-600 text-sm mb-2">{guardianStatus.guardian.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Contact</p>
                  <p className="font-medium">{guardianStatus.guardian.contact}</p>
                </div>
                <div>
                  <p className="text-gray-500">Response Time</p>
                  <p className="font-medium">{guardianStatus.guardian.responseTime}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">{getDistanceText(guardianStatus.guardian)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expires In</p>
                  <p className={`font-medium ${guardianStatus.hoursRemaining <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                    {guardianStatus.hoursRemaining.toFixed(1)} hours
                  </p>
                </div>
              </div>

              {/* Services */}
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-1">Available Services</p>
                <div className="flex flex-wrap gap-1">
                  {guardianStatus.guardian.services.map((service, index) => (
                    <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => window.open(`tel:${guardianStatus.guardian.contact}`, '_self')}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Guardian
          </button>
          <button
            onClick={() => window.open(`mailto:${guardianStatus.guardian.email}`, '_self')}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Email
          </button>
        </div>

        {/* Cancel Assignment */}
        <button
          onClick={cancelGuardianAssignment}
          className="w-full bg-red-100 text-red-800 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
        >
          Cancel Guardian Assignment
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Guardian Mode</h3>
        <p className="text-gray-600 text-sm">
          Assign a local guardian to provide assistance and emergency support during your stay.
        </p>
      </div>

      {!showGuardianSelection ? (
        <div className="text-center">
          <button
            onClick={() => setShowGuardianSelection(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Find Guardian
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Protection Duration
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={6}>6 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours (1 day)</option>
              <option value={72}>72 hours (3 days)</option>
              <option value={168}>1 week</option>
            </select>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            <h4 className="font-medium text-gray-900">Available Guardians</h4>
            {nearbyGuardians.map((guardian) => (
              <div key={guardian.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {getGuardianTypeIcon(guardian.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-semibold">{guardian.name}</h5>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600">{guardian.rating}</span>
                        {guardian.verified && (
                          <span className="text-green-600">✓</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{guardian.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{getDistanceText(guardian)}</span>
                      <span className="text-blue-600">Response: {guardian.responseTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {guardian.services.slice(0, 3).map((service, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                      {guardian.services.length > 3 && (
                        <span className="text-xs text-gray-500">+{guardian.services.length - 3} more</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRequestGuardian(guardian.id)}
                      disabled={isRequesting}
                      className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isRequesting ? 'Requesting...' : 'Select Guardian'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowGuardianSelection(false)}
            className="w-full mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default GuardianMode;