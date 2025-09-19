import React from 'react';
import SafetyIndexWidget from '../components/safety/SafetyIndexWidget';
import DigitalIDCard from '../components/safety/DigitalIDCard';
import SafetyStatus from '../components/safety/SafetyStatus';
import GeofenceAlerts from '../components/safety/GeofenceAlerts';

const DashboardPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tourist Safety Dashboard</h1>
      
      {/* Top Row - Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {/* Safety Index */}
        <div className="md:col-span-1">
          <SafetyIndexWidget />
        </div>
        
        {/* Safety Status */}
        <div className="md:col-span-1">
          <SafetyStatus />
        </div>
        
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Trip Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Days Remaining</span>
              <span className="font-medium text-green-600">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-ins Today</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guardian Status</span>
              <span className="font-medium text-blue-600">Active</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors">
              Share Location
            </button>
            <button className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors">
              I'm Safe Check-in
            </button>
            <button className="w-full bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600 transition-colors">
              Find Nearby Help
            </button>
          </div>
        </div>
      </div>
      
      {/* Middle Row - Digital ID and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Digital Tourist ID</h2>
          <DigitalIDCard />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Location Alerts</h2>
          <GeofenceAlerts />
        </div>
      </div>
      
      {/* Bottom Row - Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium">Safe Check-in Completed</p>
              <p className="text-sm text-gray-500">Kamakhya Temple - 2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium">Entered Safe Zone</p>
              <p className="text-sm text-gray-500">Guwahati Airport Area - 4 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium">Digital ID Generated</p>
              <p className="text-sm text-gray-500">Valid for 7 days - 6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
