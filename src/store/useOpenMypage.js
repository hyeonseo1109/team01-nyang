import { create } from 'zustand';

export const useOpenMyPage = create((set) => ({
  openMyPage: false,
  setOpenMyPage: (value) => set({ openMyPage: value }),
  toggleMyPage: () => set((state) => ({ openMyPage: !state.openMyPage })),
}));
