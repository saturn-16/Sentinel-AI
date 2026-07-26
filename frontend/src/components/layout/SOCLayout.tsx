import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CommandPalette } from './CommandPalette';
import { NotificationCenter } from './NotificationCenter';
import { wsClient } from '../../services/websocket';
import { useSOCStore } from '../../store/useSOCStore';

interface SOCLayoutProps {
  children: React.ReactNode;
}

export const SOCLayout: React.FC<SOCLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { addLiveEvent } = useSOCStore();

  useEffect(() => {
    wsClient.connect();
    const unsubscribe = wsClient.subscribe((event) => {
      addLiveEvent(event);
    });
    return () => unsubscribe();
  }, [addLiveEvent]);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <Navbar onOpenNotifications={() => setIsNotifOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      <CommandPalette />
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </div>
  );
};
