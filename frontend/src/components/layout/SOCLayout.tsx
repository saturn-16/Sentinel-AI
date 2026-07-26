import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { CommandPalette } from './CommandPalette';
import { NotificationCenter } from './NotificationCenter';
import { StaggeredMenu } from '../common/StaggeredMenu';
import Plasma from '../common/Plasma';
import { wsClient } from '../../services/websocket';
import { useSOCStore } from '../../store/useSOCStore';

interface SOCLayoutProps {
  children: React.ReactNode;
}

const socMenuItems = [
  { label: 'Home', link: '/' },
  { label: 'SOC Dashboard', link: '/dashboard' },
  { label: 'Executive Dashboard', link: '/executive' },
  { label: 'Live Monitoring', link: '/live' },
  { label: 'Threat Explorer', link: '/explorer' },
  { label: 'Alerts', link: '/alerts' },
  { label: 'Incidents', link: '/incidents' },
  { label: 'Users', link: '/users' },
  { label: 'Devices', link: '/devices' },
  { label: 'Behavior Profiles', link: '/profiles' },
  { label: 'Analytics', link: '/analytics' },
  { label: 'Reports', link: '/reports' },
  { label: 'System Health', link: '/health' },
  { label: 'Settings', link: '/settings' },
];

const socSocialItems = [
  { label: 'GitHub', link: 'https://github.com/saturn-16/Sentinel-AI' },
  { label: 'Honeywell SOC', link: 'https://honeywell.com' }
];

export const SOCLayout: React.FC<SOCLayoutProps> = ({ children }) => {
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
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans flex flex-col relative selection:bg-red-600 selection:text-white">
      <div className="fixed inset-0 z-0 opacity-15 pointer-events-none">
        <Plasma
          color="#ef4444"
          speed={0.4}
          direction="forward"
          scale={1.1}
          opacity={0.3}
          mouseInteractive={true}
        />
      </div>

      <StaggeredMenu
        position="left"
        items={socMenuItems}
        socialItems={socSocialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#ef4444"
        openMenuButtonColor="#ef4444"
        accentColor="#ef4444"
        colors={['#f1f5f9', '#ffffff']}
      />

      <div className="flex-1 flex flex-col w-full relative z-10">
        <Navbar onOpenNotifications={() => setIsNotifOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto w-full max-w-7xl mx-auto">{children}</main>
      </div>

      <CommandPalette />
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </div>
  );
};
