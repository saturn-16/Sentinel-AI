import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/useAuthStore';
import { SOCLayout } from './components/layout/SOCLayout';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) {
    return <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-xs font-mono text-slate-400">Loading SentinelAI Session...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <SOCLayout>{children}</SOCLayout>;
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
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/executive" element={<ProtectedRoute><ExecutiveDashboard /></ProtectedRoute>} />
          <Route path="/live" element={<ProtectedRoute><LiveMonitoring /></ProtectedRoute>} />
          <Route path="/explorer" element={<ProtectedRoute><ThreatExplorer /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          <Route path="/alerts/:id" element={<ProtectedRoute><AlertDetail /></ProtectedRoute>} />
          <Route path="/incidents" element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/users/:id" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
          <Route path="/devices" element={<ProtectedRoute><DevicesPage /></ProtectedRoute>} />
          <Route path="/devices/:id" element={<ProtectedRoute><DeviceDetail /></ProtectedRoute>} />
          <Route path="/profiles" element={<ProtectedRoute><BehaviorProfiles /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/health" element={<ProtectedRoute><SystemHealth /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
