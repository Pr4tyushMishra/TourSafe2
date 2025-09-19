import React from 'react';

const ActivityPage = () => {
  const activities = [
    { 
      id: 1, 
      type: 'check-in', 
      location: 'New York, USA', 
      time: '2 hours ago',
      message: 'You checked in at your destination.'
    },
    { 
      id: 2, 
      type: 'alert', 
      message: 'Severe weather warning in your area. Stay indoors if possible.', 
      time: '5 hours ago',
      location: 'New York, USA'
    },
    { 
      id: 3, 
      type: 'message', 
      from: 'Safety Team', 
      time: '1 day ago',
      message: 'Your safety check-in has been received. We\'re here if you need assistance.'
    },
    { 
      id: 4, 
      type: 'check-in', 
      location: 'JFK International Airport', 
      time: '1 day ago',
      message: 'You checked in at the airport.'
    },
    { 
      id: 5, 
      type: 'alert', 
      message: 'High traffic area detected. Stay alert!', 
      time: '2 days ago',
      location: 'Times Square, New York'
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Activity Log</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Activities</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Track all your recent activities and notifications</p>
        </div>
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                    activity.type === 'check-in' ? 'bg-blue-100 text-blue-600' : 
                    activity.type === 'alert' ? 'bg-red-100 text-red-600' : 
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    {activity.type === 'check-in' ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : activity.type === 'alert' ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {activity.type === 'check-in' && 'Check-in completed'}
                      {activity.type === 'alert' && 'Security Alert'}
                      {activity.type === 'message' && `Message from ${activity.from}`}
                    </div>
                    {activity.message && (
                      <p className="text-sm text-gray-500">{activity.message}</p>
                    )}
                    {activity.location && (
                      <div className="mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {activity.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
