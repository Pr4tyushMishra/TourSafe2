import React, { useState } from 'react';

const SecurityPage = () => {
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Security Settings</h1>
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Security Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={twoFactor}
                  onChange={() => setTwoFactor(!twoFactor)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <h3 className="font-medium">Login Alerts</h3>
                <p className="text-sm text-gray-600">Get notified for new logins</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={loginAlerts}
                  onChange={() => setLoginAlerts(!loginAlerts)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
          <div className="text-sm text-gray-600">
            <div className="flex items-center justify-between py-2 border-b">
              <span>Windows 10 • Chrome • New Delhi, IN</span>
              <span className="text-green-500">Current Session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
