import { create } from 'zustand';
import { LiveStreamEvent, Alert } from '../types';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  read: boolean;
}

interface SOCState {
  liveEvents: LiveStreamEvent[];
  isStreamPaused: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
  isCommandPaletteOpen: boolean;
  addLiveEvent: (event: LiveStreamEvent) => void;
  toggleStreamPause: () => void;
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useSOCStore = create<SOCState>((set, get) => ({
  liveEvents: [],
  isStreamPaused: false,
  notifications: [],
  unreadCount: 0,
  isCommandPaletteOpen: false,

  addLiveEvent: (event: LiveStreamEvent) => {
    if (get().isStreamPaused) return;

    set((state) => {
      const updatedEvents = [event, ...state.liveEvents].slice(0, 100);
      let updatedNotifs = state.notifications;
      let newUnread = state.unreadCount;

      if (event.risk_level === 'High' || event.risk_level === 'Critical' || event.is_anomaly) {
        const notif: NotificationItem = {
          id: Math.random().toString(36).substring(7),
          title: `${event.attack_type} Detected`,
          message: `${event.user_name} from ${event.country} (${event.ip_address}) - Risk: ${event.risk_score}`,
          timestamp: new Date().toLocaleTimeString(),
          severity: event.risk_level as any,
          read: false,
        };
        updatedNotifs = [notif, ...state.notifications].slice(0, 30);
        newUnread += 1;
      }

      return {
        liveEvents: updatedEvents,
        notifications: updatedNotifs,
        unreadCount: newUnread,
      };
    });
  },

  toggleStreamPause: () => set((state) => ({ isStreamPaused: !state.isStreamPaused })),

  markNotificationRead: (id: string) => set((state) => ({
    notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),

  dismissNotification: (id: string) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),

  setCommandPaletteOpen: (open: boolean) => set({ isCommandPaletteOpen: open }),
}));
