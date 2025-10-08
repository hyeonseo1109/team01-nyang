// src/store/useTicketsStore.js
import { create } from 'zustand';

export const useTicketsStore = create((set) => ({
  tickets: [],
  setTickets: (updater) =>
    set((state) => ({
      tickets: typeof updater === 'function' ? updater(state.tickets) : updater,
    })),
}));
