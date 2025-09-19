import React, { useState, useEffect } from 'react';
import { useDigitalID } from '../../contexts/DigitalIDContext';

const DigitalIDCard = () => {
  const { 
    currentID, 
    digitalIDs, 
    isGenerating, 
    generateDigitalID, 
    verifyDigitalID,
    getActiveDigitalID,
    setCurrentID 
  } = useDigitalID();
  
  const [verification, setVerification] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    nationality: 'Indian',
    passport: 'P1234567',
    duration: 7
  });

  useEffect(() => {
    const activeID = getActiveDigitalID();
    if (activeID && !currentID) {
      setCurrentID(activeID);
    }
  }, [digitalIDs, currentID, getActiveDigitalID, setCurrentID]);

  useEffect(() => {
    if (currentID) {
      verifyDigitalID(currentID).then(setVerification);
    }
  }, [currentID, verifyDigitalID]);

  const handleGenerate = async () => {
    try {
      const itinerary = [
        {
          place: "Guwahati, Assam",
          from: new Date().toISOString().split('T')[0],
          to: new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ];
      
      await generateDigitalID({ ...formData, id: `user_${Date.now()}` }, itinerary);
      setShowGenerateForm(false);
    } catch (error) {
      console.error('Failed to generate Digital ID:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!currentID) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No Digital ID</h3>
          <p className="text-gray-600 mb-4">Generate your tourist digital ID to access TourSafe services</p>
          
          {!showGenerateForm ? (
            <button
              onClick={() => setShowGenerateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Digital ID
            </button>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="font-semibold mb-3">Tourist Information</h4>
              <div className="space-y-3 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Indian">Indian</option>
                    <option value="American">American</option>
                    <option value="British">British</option>
                    <option value="Canadian">Canadian</option>
                    <option value="Australian">Australian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                  <input
                    type="text"
                    value={formData.passport}
                    onChange={(e) => setFormData({...formData, passport: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? 'Generating...' : 'Generate ID'}
                </button>
                <button
                  onClick={() => setShowGenerateForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* ID Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Tourist Digital ID</h2>
            <p className="text-blue-100">Government of India • TourSafe</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              verification?.isExpired ? 'bg-red-500' : 'bg-green-500'
            }`}>
              {verification?.isExpired ? 'EXPIRED' : 'ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* ID Card Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{currentID.name}</h3>
                <p className="text-gray-600">Tourist ID: {currentID.id}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Nationality</p>
                  <p className="font-medium">{currentID.nationality || 'Indian'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Valid Until</p>
                  <p className="font-medium">{formatDate(currentID.validTo)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Issued Date</p>
                  <p className="font-medium">{formatDate(currentID.issuedAt)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Days Remaining</p>
                  <p className={`font-medium ${verification?.daysRemaining <= 3 ? 'text-red-600' : 'text-green-600'}`}>
                    {verification?.daysRemaining || 0}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Blockchain Anchor Hash</p>
                <p className="text-xs font-mono text-gray-800 break-all">
                  {currentID.anchorHash}
                </p>
              </div>

              {currentID.itinerary && currentID.itinerary.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Itinerary</p>
                  {currentID.itinerary.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      📍 {item.place} ({formatDate(item.from)} - {formatDate(item.to)})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => setShowQR(!showQR)}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>
            
            {showQR && (
              <div className="text-center">
                <img 
                  src={currentID.qrCode} 
                  alt="Digital ID QR Code"
                  className="w-48 h-48 border-2 border-gray-200 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Scan to verify identity
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={() => setShowGenerateForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate New ID
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'My Tourist Digital ID',
                  text: `Verify my identity: Tourist ID ${currentID.id}`,
                  url: `https://safetourist.app/verify/${currentID.id}`
                });
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Share ID
          </button>
          <button
            onClick={() => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const img = new Image();
              img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const link = document.createElement('a');
                link.download = `tourist_id_${currentID.id}.png`;
                link.href = canvas.toDataURL();
                link.click();
              };
              img.src = currentID.qrCode;
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalIDCard;