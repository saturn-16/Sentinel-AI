import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/useAuthStore';
import { SOCLayout } from './components/layout/SOCLayout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { ThreatExplorer } from './pages/ThreatExplorer';
import { Alerts } from './pages/Alerts';
import { AlertDetail } from './pages/AlertDetail';
import { Incidents } from './pages/Incidents';
import { UsersPage } from './pages/Users';
import { UserDetail } from './pages/UserDetail';
import { DevicesPage } from './pages/Devices';
import { DeviceDetail } from './pages/DeviceDetail';
import { BehaviorProfiles } from './pages/BehaviorProfiles';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { SystemHealth } from './pages/SystemHealth';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { AIEvaluationReport } from './pages/AIEvaluationReport';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedAppRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-xs font-mono text-slate-900">Loading SentinelAI Session...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <SOCLayout>{children}</SOCLayout>;
};

const ProtectedStandaloneRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-xs font-mono text-slate-900">Loading SentinelAI Session...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedStandaloneRoute><LandingPage /></ProtectedStandaloneRoute>} />
          <Route path="/landing" element={<ProtectedStandaloneRoute><LandingPage /></ProtectedStandaloneRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedAppRoute><Dashboard /></ProtectedAppRoute>} />
          <Route path="/executive" element={<ProtectedAppRoute><ExecutiveDashboard /></ProtectedAppRoute>} />
          <Route path="/live" element={<ProtectedAppRoute><LiveMonitoring /></ProtectedAppRoute>} />
          <Route path="/explorer" element={<ProtectedAppRoute><ThreatExplorer /></ProtectedAppRoute>} />
          <Route path="/alerts" element={<ProtectedAppRoute><Alerts /></ProtectedAppRoute>} />
          <Route path="/alerts/:id" element={<ProtectedAppRoute><AlertDetail /></ProtectedAppRoute>} />
          <Route path="/incidents" element={<ProtectedAppRoute><Incidents /></ProtectedAppRoute>} />
          <Route path="/users" element={<ProtectedAppRoute><UsersPage /></ProtectedAppRoute>} />
          <Route path="/users/:id" element={<ProtectedAppRoute><UserDetail /></ProtectedAppRoute>} />
          <Route path="/devices" element={<ProtectedAppRoute><DevicesPage /></ProtectedAppRoute>} />
          <Route path="/devices/:id" element={<ProtectedAppRoute><DeviceDetail /></ProtectedAppRoute>} />
          <Route path="/profiles" element={<ProtectedAppRoute><BehaviorProfiles /></ProtectedAppRoute>} />
          <Route path="/analytics" element={<ProtectedAppRoute><Analytics /></ProtectedAppRoute>} />
          <Route path="/reports" element={<ProtectedAppRoute><Reports /></ProtectedAppRoute>} />
          <Route path="/health" element={<ProtectedAppRoute><SystemHealth /></ProtectedAppRoute>} />
          <Route path="/settings" element={<ProtectedAppRoute><Settings /></ProtectedAppRoute>} />
          <Route path="/evaluation" element={<ProtectedAppRoute><AIEvaluationReport /></ProtectedAppRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
