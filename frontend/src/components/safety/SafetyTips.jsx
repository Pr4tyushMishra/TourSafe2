import React from 'react';
import { useSafety } from '../../contexts/SafetyContext';

const SafetyTips = ({ maxTips = 3, showTitle = true }) => {
  const { getSafetyTips } = useSafety();
  const tips = getSafetyTips().slice(0, maxTips);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {showTitle && (
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <svg 
            className="w-5 h-5 mr-2 text-blue-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          Safety Tips
        </h3>
      )}
      
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
              {index + 1}
            </span>
            <span className="text-gray-700">{tip}</span>
          </li>
        ))}
      </ul>
      
      <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
        View more safety tips
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default SafetyTips;
