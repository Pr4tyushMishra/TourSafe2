import React, { useState } from 'react';
import { useGeofence } from '../../contexts/GeofenceContext';

const LocationSimulator = () => {
  const { simulateLocationChange, geozones, currentLocation } = useGeofence();
  const [selectedZone, setSelectedZone] = useState('');

  // Predefined test locations
  const testLocations = [
    { name: 'Guwahati Airport (Safe)', lat: 26.1062, lng: 91.5862 },
    { name: 'Kamakhya Temple (Safe)', lat: 26.1665, lng: 91.7062 },
    { name: 'High Crime Area (Danger)', lat: 26.1445, lng: 91.7362 },
    { name: 'Riverbank (Caution)', lat: 26.1345, lng: 91.7362 },
    { name: 'Neutral Area (No Zone)', lat: 26.1200, lng: 91.7500 }
  ];

  const handleLocationSelect = (location) => {
    simulateLocationChange(location.lat, location.lng);
  };

  const handleZoneCenter = () => {
    if (selectedZone) {
      const zone = geozones.find(z => z.id === selectedZone);
      if (zone) {
        // Calculate center of polygon
        const polygon = zone.polygon;
        const centerLat = polygon.reduce((sum, coord) => sum + coord[1], 0) / polygon.length;
        const centerLng = polygon.reduce((sum, coord) => sum + coord[0], 0) / polygon.length;
        simulateLocationChange(centerLat, centerLng);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Location Simulator (Demo Mode)</h3>
      
      {/* Current Location Display */}
      {currentLocation && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium">Current Location</p>
          <p className="text-xs text-gray-600">
            Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
          </p>
        </div>
      )}

      {/* Quick Test Locations */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Quick Test Locations:</p>
        <div className="grid grid-cols-1 gap-2">
          {testLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(location)}
              className="text-left p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">{location.name}</span>
              <span className="text-xs text-gray-500 block">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Zone Center Navigation */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Go to Zone Center:</p>
        <div className="flex space-x-2">
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select a zone...</option>
            {geozones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name} ({zone.type})
              </option>
            ))}
          </select>
          <button
            onClick={handleZoneCenter}
            disabled={!selectedZone}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Go
          </button>
        </div>
      </div>

      {/* Zone Information */}
      <div className="mt-4">
        <p className="text-sm font-medium mb-2">Available Geozones:</p>
        <div className="space-y-2">
          {geozones.map((zone) => (
            <div key={zone.id} className="text-xs p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-between">
                <span className="font-medium">{zone.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  zone.type === 'danger' ? 'bg-red-100 text-red-800' :
                  zone.type === 'caution' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {zone.type.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 mt-1">Risk Score: {zone.riskScore}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>Demo Mode:</strong> Use this simulator to test geofence functionality. 
          In a real deployment, location would be automatically detected via GPS.
        </p>
      </div>
    </div>
  );
};

export default LocationSimulator;