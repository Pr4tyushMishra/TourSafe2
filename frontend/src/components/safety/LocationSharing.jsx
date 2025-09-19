import React, { useState } from 'react';
import { useSafety } from '../../contexts/SafetyContext';

const LocationSharing = () => {
  const { 
    isSharingLocation, 
    toggleLocationSharing, 
    userLocation,
    trustedContacts 
  } = useSafety();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [duration, setDuration] = useState('1'); // in hours
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const handleContactToggle = (contact) => {
    setSelectedContacts(prev => 
      prev.includes(contact.phone)
        ? prev.filter(phone => phone !== contact.phone)
        : [...prev, contact.phone]
    );
  };

  const handleStartSharing = () => {
    if (selectedContacts.length === 0) return;
    
    setIsSharing(true);
    toggleLocationSharing();
    
    // In a real app, this would generate a secure shareable link
    const link = `https://safetourist.app/share/${Math.random().toString(36).substr(2, 9)}`;
    setShareLink(link);
    
    // In a real app, this would send the link to the selected contacts
    console.log('Sharing location with:', selectedContacts, 'for', duration, 'hours');
    console.log('Share link:', link);
    
    // Auto-stop after the selected duration
    setTimeout(() => {
      if (isSharing) {
        handleStopSharing();
      }
    }, duration * 60 * 60 * 1000);
  };

  const handleStopSharing = () => {
    setIsSharing(false);
    setShareLink('');
    toggleLocationSharing();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
        Share My Location
      </h3>
      
      {!isSharing ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Share with trusted contacts:
            </label>
            <div className="space-y-2 mt-2">
              {trustedContacts.map((contact) => (
                <label key={contact.phone} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.phone)}
                    onChange={() => handleContactToggle(contact)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">
                    {contact.name} ({contact.phone})
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration: {duration} {duration === '1' ? 'hour' : 'hours'}
            </label>
            <input
              type="range"
              min="1"
              max="24"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1h</span>
              <span>24h</span>
            </div>
          </div>
          
          <button
            onClick={handleStartSharing}
            disabled={selectedContacts.length === 0}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              selectedContacts.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Start Sharing Location
          </button>
        </>
      ) : (
        <div className="text-center">
          <div className="text-green-500 mb-3">
            <svg 
              className="w-12 h-12 mx-auto mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <p className="font-medium">Location Sharing Active</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md mb-4 text-left">
            <p className="text-sm text-gray-600 mb-1">Shareable link:</p>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 text-xs p-2 border rounded-l-md focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  // Show copied tooltip
                }}
                className="bg-gray-200 hover:bg-gray-300 px-3 rounded-r-md text-sm font-medium"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Will expire in {duration} {duration === '1' ? 'hour' : 'hours'}
            </p>
          </div>
          
          <button
            onClick={handleStopSharing}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Stop Sharing Location
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationSharing;
