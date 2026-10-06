// Offline storage and PWA offline caching service for My Paws Walks

const STORAGE_KEYS = {
  BUSINESSES: 'mypawswalks_cached_businesses_v1',
  BOOKINGS: 'mypawswalks_cached_bookings_v1',
  KENNEL_BOOKINGS: 'mypawswalks_cached_kennel_bookings_v1',
  RECORDED_WALKS: 'mypawswalks_cached_recorded_walks_v1',
  CUSTOM_WALK_DURATIONS: 'mypawswalks_custom_walk_durations_v1',
  OFFLINE_QUEUE: 'mypawswalks_offline_queue_v1',
};

export const offlineStorage = {
  // Save business directory to localStorage for offline access
  saveBusinesses: (businesses: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  },

  // Load business directory from cache
  loadBusinesses: (): any[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Save bookings
  saveBookings: (bookings: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {}
  },

  loadBookings: (): any[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Save kennel bookings
  saveKennelBookings: (kennelBookings: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.KENNEL_BOOKINGS, JSON.stringify(kennelBookings));
    } catch (e) {}
  },

  loadKennelBookings: (): any[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KENNEL_BOOKINGS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Custom walk durations
  saveCustomDurations: (durations: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_WALK_DURATIONS, JSON.stringify(durations));
    } catch (e) {}
  },

  loadCustomDurations: (): any[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_WALK_DURATIONS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
};
