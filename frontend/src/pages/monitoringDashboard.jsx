import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useGeofence } from "../contexts/GeofenceContext";
import { useSafetyIndex } from "../contexts/SafetyIndexContext";
import { useGuardian } from "../contexts/GuardianContext";
import { useMeshRelay } from "../contexts/MeshRelayContext";
import AIDashboardSummary from "../components/ai/AIDashboardSummary";
import AIAnomalyDetection from "../components/ai/AIAnomalyDetection";
export default function MonitoringDashboard() {
  const navigate = useNavigate();
  const [risk, setRisk] = useState("low");
  const [location, setLocation] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map', 'heatmap', 'alerts'
  
  // Context hooks
  const { geozones, activeAlerts } = useGeofence();
  const { safetyIndex } = useSafetyIndex();
  const { guardians } = useGuardian();
  const { relayedAlerts } = useMeshRelay();
  
  // Mock real-time data
  const [realTimeAlerts, setRealTimeAlerts] = useState([
    {
      id: 'alert_001',
      type: 'emergency_sos',
      tourist: { name: 'Sarah Johnson', id: 'T001', digitalId: 'DID_001' },
      location: { lat: 26.1445, lng: 91.7362, address: 'Near Kamakhya Temple' },
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'active',
      priority: 'critical',
      message: 'Emergency SOS - Tourist requires immediate assistance',
      guardian: 'Hotel Brahmaputra Grand',
      responseTime: '< 2 minutes'
    },
    {
      id: 'alert_002', 
      type: 'geofence_violation',
      tourist: { name: 'Mike Chen', id: 'T002', digitalId: 'DID_002' },
      location: { lat: 26.1445, lng: 91.7362, address: 'High Crime Area' },
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'acknowledged',
      priority: 'high',
      message: 'Tourist entered dangerous zone',
      guardian: 'Kamakhya Tourist Center',
      responseTime: '< 5 minutes'
    },
    {
      id: 'alert_003',
      type: 'check_in_overdue',
      tourist: { name: 'Emma Wilson', id: 'T003', digitalId: 'DID_003' },
      location: { lat: 26.1350, lng: 91.7450, address: 'Last known: Fancy Bazar' },
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: 'investigating',
      priority: 'medium',
      message: 'Tourist missed scheduled check-in',
      guardian: 'Northeast Adventure Tours',
      responseTime: '< 10 minutes'
    }
  ]);
  
  const [dashboardStats, setDashboardStats] = useState({
    totalTourists: 157,
    activeTourists: 142,
    activeAlerts: 3,
    resolvedToday: 12,
    avgResponseTime: '4.2 min',
    guardianCoverage: '94%',
    systemUptime: '99.8%',
    meshRelayActive: 23
  });
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update dashboard stats
      setDashboardStats(prev => ({
        ...prev,
        activeTourists: prev.activeTourists + Math.floor(Math.random() * 3) - 1,
        avgResponseTime: `${(4.2 + (Math.random() - 0.5) * 2).toFixed(1)} min`
      }));
      
      // Simulate new alerts occasionally  
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const newAlert = {
          id: `alert_${Date.now()}`,
          type: ['geofence_violation', 'check_in_overdue', 'safety_concern'][Math.floor(Math.random() * 3)],
          tourist: { 
            name: ['Alex Kumar', 'Lisa Zhang', 'David Smith'][Math.floor(Math.random() * 3)], 
            id: `T${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
            digitalId: `DID_${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`
          },
          location: { 
            lat: 26.1445 + (Math.random() - 0.5) * 0.02, 
            lng: 91.7362 + (Math.random() - 0.5) * 0.02,
            address: 'Dynamic Location'
          },
          timestamp: new Date().toISOString(),
          status: 'active',
          priority: ['medium', 'high'][Math.floor(Math.random() * 2)],
          message: 'New alert detected',
          guardian: ['Hotel Brahmaputra Grand', 'Kamakhya Tourist Center'][Math.floor(Math.random() * 2)],
          responseTime: '< 5 minutes'
        };
        setRealTimeAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep only latest 10
      }
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-red-600';
      case 'acknowledged': return 'text-yellow-600';
      case 'investigating': return 'text-blue-600';
      case 'resolved': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Top Navbar */}
     

      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monitoring Dashboard</h1>
          <p className="text-gray-600">Real-time tourist safety monitoring and emergency response coordination</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tourists</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeTourists}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.avgResponseTime}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mesh Nodes</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.meshRelayActive}</p>
              </div>
            </div>
          </div>
        </div>

          {/* Map Section */}
          <div className="w-full h-[500px] bg-gray-100 rounded-lg mb-8 overflow-hidden relative">
            {/* Map Container */}
            <div className="absolute inset-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.265588856342!2d73.91455641541671!3d18.562061287384868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c147b8b3a3bf%3A0x6f7fdcc8e4d6c77a!2sPhoenix%20Marketcity%20Pune!5e0!3m2!1sen!2sin!4v1630231106784!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Interactive Map"
              ></iframe>
            </div>
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md z-10">
              <div className="flex flex-col space-y-2">
                <button className="p-2 hover:bg-gray-100 rounded" title="Zoom In">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Zoom Out">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button className="p-2 hover:bg-gray-100 rounded" title="My Location">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md text-sm z-10">
              <div className="font-medium mb-2">Legend</div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span>Safe Zone</span>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span>High Risk</span>
              </div>
            </div>
            
            {/* Risk Indicators */}
            <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md text-sm z-10">
              <div className="font-medium mb-2">Risk Indicators</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Low Risk (0-3)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Medium Risk (4-7)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-600"></div>
                  <span>High Risk (8-10)</span>
                </div>
              </div>
            </div>
            
            {/* AI-Powered Intelligence Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Dashboard Summary for Authorities */}
              <div className="bg-white rounded-lg shadow-md">
                <AIDashboardSummary 
                  enabled={true}
                  dashboardData={{
                    totalTourists: dashboardStats.activeTourists,
                    activeAlerts: dashboardStats.activeAlerts,
                    highRiskAreas: [
                      { name: 'Kamakhya Temple Area', riskLevel: 'medium', tourists: 34 },
                      { name: 'Fancy Bazaar', riskLevel: 'high', tourists: 67 },
                      { name: 'Railway Station', riskLevel: 'medium', tourists: 89 }
                    ],
                    recentIncidents: realTimeAlerts.map(alert => ({
                      type: alert.type,
                      location: alert.location.address,
                      time: formatTime(alert.timestamp),
                      severity: alert.priority
                    })),
                    weather: 'clear with occasional clouds',
                    specialEvents: [
                      { name: 'Durga Puja Festival', location: 'City Center', impact: 'high_crowd' }
                    ],
                    resourceDeployment: [
                      { type: 'patrol_units', count: 15, status: 'active' },
                      { type: 'emergency_responders', count: 8, status: 'standby' }
                    ]
                  }}
                  refreshInterval={30000}
                  showDetailedBreakdown={true}
                />
              </div>
            
              {/* AI Anomaly Detection */}
              <div className="bg-white rounded-lg shadow-md">
                <AIAnomalyDetection 
                  enabled={true}
                  touristData={{
                    touristId: 'tourist_monitoring_001',
                    locationHistory: [
                      { lat: 26.1445, lng: 91.7362, timestamp: new Date(Date.now() - 3600000).toISOString(), activity: 'temple_visit' },
                      { lat: 26.1425, lng: 91.7382, timestamp: new Date(Date.now() - 1800000).toISOString(), activity: 'shopping' }
                    ],
                    activityPattern: 'tourist_exploration',
                    inactivityDuration: Math.floor(Math.random() * 180),
                    expectedLocation: 'Tourist District',
                    actualLocation: 'Current Location',
                    communicationStatus: Math.random() > 0.8 ? 'poor' : 'normal',
                    previousPatterns: ['morning_temple_visits', 'afternoon_shopping', 'evening_dining']
                  }}
                />
              </div>
            </div>
            
            {/* AI Intelligence Banner */}
            <div className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="font-semibold text-purple-800">AI-Enhanced Monitoring</h3>
                    <p className="text-sm text-purple-600">
                      TourSafe leverages Gemini AI for intelligent threat analysis, predictive alerts, and real-time decision support
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-purple-600">System Status</div>
                  <div className="text-lg font-semibold text-green-600">🟢 AI Online</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow">
              {/* Pie chart SVG */}
              <svg className="w-20 h-20 mb-4" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#eee" />
                <path d="M20 20 L20 2 A18 18 0 0 1 38 20 Z" fill="#444" />
                <path d="M20 20 L38 20 A18 18 0 0 1 20 38 Z" fill="#999" />
                <path d="M20 20 L20 38 A18 18 0 0 1 2 20 Z" fill="#666" />
              </svg>
              <h3 className="font-bold text-lg mb-1">Location A</h3>
              <div className="text-center text-gray-700 mb-4 text-sm">Detailed report on Location A, including risk assessment and alerts.</div>
              <button className="w-full bg-black text-white rounded py-2 font-semibold hover:bg-gray-800 transition">View Report</button>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow">
              {/* Bar chart SVG */}
              <svg className="w-20 h-20 mb-4" viewBox="0 0 40 40">
                <rect x="6" y="30" width="4" height="10" fill="#222" />
                <rect x="14" y="20" width="4" height="20" fill="#444" />
                <rect x="22" y="15" width="4" height="25" fill="#666" />
                <rect x="30" y="5" width="4" height="35" fill="#111" />
              </svg>
              <h3 className="font-bold text-lg mb-1">Location B</h3>
              <div className="text-center text-gray-700 mb-4 text-sm">Detailed report on Location B, including risk assessment and alerts.</div>
              <button className="w-full bg-black text-white rounded py-2 font-semibold hover:bg-gray-800 transition">View Report</button>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow">
              {/* Line chart SVG */}
              <svg className="w-20 h-20 mb-4" viewBox="0 0 40 40">
                <polyline points="0,35 8,30 16,28 24,14 32,17 40,7" fill="none" stroke="#111" strokeWidth="2" />
                <polyline points="0,25 8,22 16,24 24,19 32,14 40,11" fill="none" stroke="#888" strokeWidth="2" />
              </svg>
              <h3 className="font-bold text-lg mb-1">Location C</h3>
              <div className="text-center text-gray-700 mb-4 text-sm">Detailed report on Location C, including risk assessment and alerts.</div>
              <button className="w-full bg-black text-white rounded py-2 font-semibold hover:bg-gray-800 transition">View Report</button>
            </div>
          </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 w-full bg-black text-white py-8 px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold text-lg mb-4">TourSafe</div>
          <p className="text-gray-400 text-sm">Ensuring your safety during travels with real-time monitoring and emergency response.</p>
        </div>
        <div>
          <div className="font-semibold mb-3">Quick Links</div>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
            <li><Link to="/monitoringDashboard" className="text-gray-400 hover:text-white transition">Monitoring Dashboard</Link></li>
            <li><Link to="/emergency-contacts" className="text-gray-400 hover:text-white transition">Emergency Contacts</Link></li>
            <li><Link to="/safety-tips" className="text-gray-400 hover:text-white transition">Safety Tips</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Emergency Contacts</div>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              <span>Police: 100</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              <span>Ambulance: 108</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              <span>Women Helpline: 1091</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              <span>Tourist Helpline: 1363</span>
            </li>
          </ul>
        </div>
      </footer>
      
      {/* Copyright */}
      <div className="bg-gray-900 text-gray-400 text-center py-4 text-sm">
        © {new Date().getFullYear()} TourSafe. All rights reserved.
      </div>
    </div>
  );
}
