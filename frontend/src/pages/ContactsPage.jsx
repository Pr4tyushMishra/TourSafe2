import React from 'react';

const ContactsPage = () => {
  const contacts = [
    { 
      id: 1, 
      name: 'John Doe', 
      role: 'Primary Contact',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    { 
      id: 2, 
      name: 'Emily Smith', 
      role: 'Backup Contact',
      phone: '+1 (555) 987-6543',
      email: 'emily.smith@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    { 
      id: 3, 
      name: 'Mark Johnson', 
      role: 'Emergency Contact',
      phone: '+1 (555) 456-7890',
      email: 'mark.johnson@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/17.jpg'
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Emergency Contacts</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add New Contact
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map(contact => (
          <div key={contact.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  className="w-16 h-16 rounded-full object-cover" 
                  src={contact.avatar} 
                  alt={contact.name} 
                />
                <div>
                  <h3 className="text-xl font-semibold">{contact.name}</h3>
                  <span className="text-blue-600 text-sm font-medium">{contact.role}</span>
                </div>
              </div>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {contact.phone}
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {contact.email}
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors">
                  Message
                </button>
                <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg transition-colors">
                  Call
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsPage;
