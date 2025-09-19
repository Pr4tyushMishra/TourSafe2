import React from 'react';

const NotificationsPage = () => {
  const notifications = [
    { id: 1, type: 'alert', message: 'Severe weather warning in your area', time: '2 hours ago', read: false },
    { id: 2, type: 'update', message: 'New safety feature available', time: '1 day ago', read: true },
    { id: 3, type: 'alert', message: 'Emergency contact checked your status', time: '2 days ago', read: true },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Recent Alerts</h2>
          </div>
          <div className="divide-y">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className={`w-2 h-2 mt-2 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                  <div className="ml-3">
                    <p className="text-gray-800">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
