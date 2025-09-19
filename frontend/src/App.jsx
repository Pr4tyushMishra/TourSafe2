import { Routes, Route, useLocation } from 'react-router-dom';
import { SafetyProvider } from './contexts/SafetyContext';
import { DemoModeProvider } from './contexts/DemoModeContext';
import { DigitalIDProvider } from './contexts/DigitalIDContext';
import { GeofenceProvider } from './contexts/GeofenceContext';
import { GuardianProvider } from './contexts/GuardianContext';
import { SafetyIndexProvider } from './contexts/SafetyIndexContext';
import { MeshRelayProvider } from './contexts/MeshRelayContext';
import { SidebarProvider } from './contexts/SidebarContext';
import Layout from './components/Layout';
import HomePage from './pages/homePage';
import ProfilePage from './pages/profilePage';
import DashboardPage from './pages/DashboardPage';
import ActivityPage from './pages/ActivityPage';
import SecurityPage from './pages/SecurityPage';
import NotificationsPage from './pages/NotificationsPage';
import ContactsPage from './pages/ContactsPage';
import MonitoringDashboard from './pages/monitoringDashboard';
import EmergencyResponse from './pages/EmergencyResponse';
import DigitalIDPage from './pages/DigitalIDPage';
import AuthPage from './pages/AuthPage';
import DemoPage from './pages/DemoPage';
import SOSButton from './components/safety/SOSButton';
import DemoControlPanel from './components/demo/DemoControlPanel';

function App() {
  const location = useLocation();
  
  // Don't show SOS button on landing page and demo page to prevent UI conflicts
  const showSOSButton = location.pathname !== '/' && location.pathname !== '/demo';

  return (
    <DemoModeProvider>
      <SafetyProvider>
        <DigitalIDProvider>
          <GeofenceProvider>
            <GuardianProvider>
              <SafetyIndexProvider>
                <MeshRelayProvider>
                  <SidebarProvider>
                    <div className="App">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/demo" element={<DemoPage />} />
                        <Route element={<Layout />}>
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/dashboard" element={<DashboardPage />} />
                          <Route path="/activity" element={<ActivityPage />} />
                          <Route path="/security" element={<SecurityPage />} />
                          <Route path="/notifications" element={<NotificationsPage />} />
                          <Route path="/contacts" element={<ContactsPage />} />
                          <Route path="/digital-id" element={<DigitalIDPage />} />
                          <Route path="/monitoring-dashboard" element={<MonitoringDashboard />} />
                          <Route path="/emergency-response" element={<EmergencyResponse />} />
                        </Route>
                      </Routes>
                      
                      {/* Global SOS Button - Hidden on landing page */}
                      {showSOSButton && <SOSButton />}
                      
                      {/* Demo Control Panel */}
                      <DemoControlPanel />
                    </div>
                  </SidebarProvider>
                </MeshRelayProvider>
              </SafetyIndexProvider>
            </GuardianProvider>
          </GeofenceProvider>
        </DigitalIDProvider>
      </SafetyProvider>
    </DemoModeProvider>
  );
}

export default App;
