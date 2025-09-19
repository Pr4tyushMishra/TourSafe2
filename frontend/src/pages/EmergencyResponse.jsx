import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SafetyStatus from "../components/safety/SafetyStatus";
import SafetyTips from "../components/safety/SafetyTips";
import LocationSharing from "../components/safety/LocationSharing";
import GeofenceAlerts from "../components/safety/GeofenceAlerts";
import LocationSimulator from "../components/safety/LocationSimulator";
import GuardianMode from "../components/safety/GuardianMode";
import MeshRelayControl from "../components/safety/MeshRelayControl";
export default function EmergencyResponse() {
  const navigate = useNavigate();
  // State for emergency number and location form
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Dummy image URL for safe zones
  const mapImg = "https://maps.wikimedia.org/img/osm-intl,16,48.8566,2.3522,600x400.png";
  
  // Emergency contacts data
  const emergencyContacts = [
    { name: "Police", number: "100", icon: "👮" },
    { name: "Ambulance", number: "102", icon: "🚑" },
    { name: "Fire", number: "101", icon: "🚒" },
    { name: "Women's Helpline", number: "1091", icon: "♀️" },
    { name: "Tourist Helpline", number: "1363", icon: "🏨" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar */}
    

      {/* Safety Status and Top Controls */}
      <div className="px-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Emergency services are experiencing high call volumes. Response times may be longer than usual.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4">
            <button 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-1 flex items-center justify-center"
              onClick={() => window.open('tel:112', '_self')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call 112 (Emergency)
            </button>
            
            <button 
              className="bg-white border border-red-600 text-red-600 hover:bg-red-50 font-bold py-2 px-4 rounded flex-1 flex items-center justify-center"
              onClick={() => window.open('tel:1091', '_self')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Women's Helpline
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Emergency Contacts Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                      {contact.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{contact.name}</p>
                    <p className="text-lg font-mono text-blue-600">{contact.number}</p>
                  </div>
                  <a 
                    href={`tel:${contact.number}`}
                    className="ml-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                    aria-label={`Call ${contact.name}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Status & Guide Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Safety Status</h2>
            </div>

            <div className="mb-6">
              <SafetyStatus />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold text-blue-800 mb-2">If you feel unsafe:</h3>
                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                  <li>Move to a well-lit, public area immediately</li>
                  <li>Call emergency services (112) if needed</li>
                  <li>Share your live location with trusted contacts</li>
                  <li>Use the SOS button for immediate help</li>
                </ol>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <h3 className="font-semibold text-yellow-800 mb-2">Local Emergency Info:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-yellow-700">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Nearest Police: 1.2km
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Nearest Hospital: 2.5km
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Tourist Police: 100
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Embassy: +91-XXX-XXX
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Navigation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Safe Zones Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Nearby Safe Zones
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Safe Zone</span>
                    <div className="w-3 h-3 bg-red-500 rounded-full ml-4"></div>
                    <span className="text-sm text-gray-600">Current Location</span>
                  </div>
                </div>
              </div>
              
              <div className="relative h-80 bg-gray-100">
                <img 
                  src={mapImg} 
                  alt="Safe zones map" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md">
                  <div className="text-xs text-gray-600 mb-1">Distance to safety:</div>
                  <div className="text-lg font-bold text-green-600">500m</div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white rounded-lg p-3 shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress to nearest safe zone</span>
                      <span className="text-sm font-bold text-blue-600">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{width: '75%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Sharing */}
          <div>
            <LocationSharing />
            <div className="mt-6">
              <SafetyTips maxTips={3} />
            </div>
          </div>
        </div>

        {/* Advanced Safety Features */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Advanced Safety Features</h2>
            <p className="text-gray-600 text-lg">Comprehensive safety tools and monitoring systems for enhanced protection</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Geofence Alerts Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Geofence Protection</h3>
                  <p className="text-gray-600">Smart location-based alerts and zone monitoring</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <GeofenceAlerts />
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Automatically monitors your location and sends alerts when entering risk zones
              </div>
            </div>

            {/* Guardian Network Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Guardian Network</h3>
                  <p className="text-gray-600">Connect with local safety partners</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <GuardianMode />
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Assigns nearby hotels and businesses as safety guardians for assistance
              </div>
            </div>

            {/* Location Testing Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Location Testing</h3>
                  <p className="text-gray-600">Simulate and test safety scenarios</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <LocationSimulator />
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test safety features by simulating different locations and scenarios
              </div>
            </div>

            {/* Mesh Relay Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Mesh Network</h3>
                  <p className="text-gray-600">Offline emergency communication</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <MeshRelayControl />
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Enables emergency communication even when cellular networks are unavailable
              </div>
            </div>
          </div>

          {/* Feature Benefits */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Why These Features Matter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Real-time</h4>
                <p className="text-sm text-gray-600">Instant alerts and notifications</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Reliable</h4>
                <p className="text-sm text-gray-600">Multiple backup systems</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Smart</h4>
                <p className="text-sm text-gray-600">AI-powered risk assessment</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Connected</h4>
                <p className="text-sm text-gray-600">Community-based support</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="mt-12 bg-gray-50 border-t border-gray-200 py-6 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">TourSafe</h3>
              <p className="text-sm text-gray-600">Your trusted travel companion for safe and secure journeys.</p>
            </div>
            <div>
              <h4 className="font-medium mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                <li><Link to="/monitoringDashboard" className="hover:text-blue-600">Dashboard</Link></li>
                <li><Link to="/emergencyResponse" className="hover:text-blue-600">Emergency</Link></li>
                <li><Link to="/safety-tips" className="hover:text-blue-600">Safety Tips</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Emergency</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/emergency-contacts" className="hover:text-blue-600">Emergency Contacts</Link></li>
                <li><Link to="/sos" className="hover:text-blue-600">SOS Services</Link></li>
                <li><Link to="/nearest-help" className="hover:text-blue-600">Find Help Nearby</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TourSafe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
