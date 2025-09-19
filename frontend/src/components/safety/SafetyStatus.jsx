import React from 'react';
import { useSafety } from '../../contexts/SafetyContext';

const getSafetyColor = (rating) => {
  switch (rating) {
    case 'safe':
      return 'bg-green-100 text-green-800';
    case 'caution':
      return 'bg-yellow-100 text-yellow-800';
    case 'warning':
      return 'bg-orange-100 text-orange-800';
    case 'danger':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCrowdLabel = (level) => {
  switch (level) {
    case 'low':
      return 'Light';
    case 'moderate':
      return 'Moderate';
    case 'high':
      return 'Heavy';
    default:
      return 'Unknown';
  }
};

const SafetyStatus = () => {
  const { areaSafety } = useSafety();
  
  if (!areaSafety) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        </svg>
        Area Safety Status
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Safety Level</div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${getSafetyColor(areaSafety.rating)}`}>
            {areaSafety.rating.charAt(0).toUpperCase() + areaSafety.rating.slice(1)}
          </span>
        </div>
        
        <div>
          <div className="text-sm text-gray-500 mb-1">Crowd Level</div>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              areaSafety.crowdLevel === 'low' ? 'bg-green-500' : 
              areaSafety.crowdLevel === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium">
              {getCrowdLabel(areaSafety.crowdLevel)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        Last updated: {new Date(areaSafety.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SafetyStatus;
