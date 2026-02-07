import { defineStore } from 'pinia';

// Pinia store replacing Vuex Counter module
export const useCounterStore = defineStore('counter', {
  state: () => ({
    main: 0
  }),

  actions: {
    decrementMainCounter() {
      this.main--;
    },
    incrementMainCounter() {
      this.main++;
    },
    someAsyncTask() {
      // do something async
      this.incrementMainCounter();
    }
  },

  // Persist state to localStorage (replaces vuex-electron persistence)
  persist: true
});

// Helper to restore state from localStorage on app init
export function initStoreFromStorage() {
  const STORAGE_KEY = 'pinia-state';
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (e) {
    console.warn('Failed to restore persisted state:', e);
  }
  return null;
}
