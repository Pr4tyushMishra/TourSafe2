import React from 'react';
import DigitalIDCard from '../components/safety/DigitalIDCard';

const DigitalIDPage = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Tourist ID</h1>
          <p className="text-gray-600">
            Your secure, blockchain-anchored digital identity for safe travel. 
            This ID provides time-bound verification and can be used by authorities 
            and emergency services to identify you during your trip.
          </p>
        </div>
        
        <DigitalIDCard />
        
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">About Digital Tourist IDs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">🔒 Security Features</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Blockchain-anchored hash for tamper-proof verification</li>
                <li>Time-bound validity prevents misuse</li>
                <li>QR code for instant identity verification</li>
                <li>Encrypted personal data storage</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🌍 Usage Benefits</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Quick identity verification by authorities</li>
                <li>Emergency contact and medical info access</li>
                <li>Tourist service eligibility verification</li>
                <li>Seamless integration with TourSafe services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalIDPage;