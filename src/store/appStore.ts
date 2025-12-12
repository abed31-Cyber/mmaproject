/**
 * MMA Universe - App Store (Zustand)
 */

import { create } from 'zustand';
import type { Fighter, Event, Notification } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

interface AppState {
  // UI State
  isLoading: boolean;
  activeTab: 'home' | 'fighters' | 'events' | 'social' | 'profile';
  
  // Data Cache
  followedFighters: Fighter[];
  savedEvents: Event[];
  notifications: Notification[];
  unreadNotificationsCount: number;

  // Filter Preferences
  fightersFilter: {
    weightClass: string | null;
    organization: string | null;
    sortBy: string;
    showChampionsOnly: boolean;
  };

  eventsFilter: {
    organization: string | null;
    showPast: boolean;
  };

  // Actions
  setLoading: (isLoading: boolean) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  
  // Followed Fighters
  addFollowedFighter: (fighter: Fighter) => void;
  removeFollowedFighter: (fighterId: string) => void;
  setFollowedFighters: (fighters: Fighter[]) => void;
  
  // Saved Events
  addSavedEvent: (event: Event) => void;
  removeSavedEvent: (eventId: string) => void;
  setSavedEvents: (events: Event[]) => void;

  // Notifications
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;

  // Filters
  setFightersFilter: (filter: Partial<AppState['fightersFilter']>) => void;
  resetFightersFilter: () => void;
  setEventsFilter: (filter: Partial<AppState['eventsFilter']>) => void;
  resetEventsFilter: () => void;
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const DEFAULT_FIGHTERS_FILTER = {
  weightClass: null,
  organization: null,
  sortBy: 'ranking',
  showChampionsOnly: false,
};

const DEFAULT_EVENTS_FILTER = {
  organization: null,
  showPast: false,
};

// =============================================================================
// APP STORE
// =============================================================================

export const useAppStore = create<AppState>()((set, get) => ({
  // Initial State
  isLoading: false,
  activeTab: 'home',
  followedFighters: [],
  savedEvents: [],
  notifications: [],
  unreadNotificationsCount: 0,
  fightersFilter: DEFAULT_FIGHTERS_FILTER,
  eventsFilter: DEFAULT_EVENTS_FILTER,

  // UI Actions
  setLoading: (isLoading) => set({ isLoading }),
  setActiveTab: (activeTab) => set({ activeTab }),

  // Followed Fighters Actions
  addFollowedFighter: (fighter) => {
    const current = get().followedFighters;
    if (!current.find(f => f.id === fighter.id)) {
      set({ followedFighters: [...current, fighter] });
    }
  },

  removeFollowedFighter: (fighterId) => {
    set({
      followedFighters: get().followedFighters.filter(f => f.id !== fighterId),
    });
  },

  setFollowedFighters: (fighters) => set({ followedFighters: fighters }),

  // Saved Events Actions
  addSavedEvent: (event) => {
    const current = get().savedEvents;
    if (!current.find(e => e.id === event.id)) {
      set({ savedEvents: [...current, event] });
    }
  },

  removeSavedEvent: (eventId) => {
    set({
      savedEvents: get().savedEvents.filter(e => e.id !== eventId),
    });
  },

  setSavedEvents: (events) => set({ savedEvents: events }),

  // Notification Actions
  setNotifications: (notifications) => {
    const unread = notifications.filter(n => !n.isRead).length;
    set({ notifications, unreadNotificationsCount: unread });
  },

  addNotification: (notification) => {
    const current = get().notifications;
    const unread = get().unreadNotificationsCount;
    set({
      notifications: [notification, ...current],
      unreadNotificationsCount: notification.isRead ? unread : unread + 1,
    });
  },

  markNotificationRead: (notificationId) => {
    const notifications = get().notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    const unread = notifications.filter(n => !n.isRead).length;
    set({ notifications, unreadNotificationsCount: unread });
  },

  markAllNotificationsRead: () => {
    const notifications = get().notifications.map(n => ({ ...n, isRead: true }));
    set({ notifications, unreadNotificationsCount: 0 });
  },

  // Filter Actions
  setFightersFilter: (filter) => {
    set({
      fightersFilter: { ...get().fightersFilter, ...filter },
    });
  },

  resetFightersFilter: () => {
    set({ fightersFilter: DEFAULT_FIGHTERS_FILTER });
  },

  setEventsFilter: (filter) => {
    set({
      eventsFilter: { ...get().eventsFilter, ...filter },
    });
  },

  resetEventsFilter: () => {
    set({ eventsFilter: DEFAULT_EVENTS_FILTER });
  },
}));

export default useAppStore;
