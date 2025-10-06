import { create } from 'zustand';
import { getMyProfile } from '../api/users';
import { queryClient } from '../queryClient';
import { useOpenMyPage } from './useOpenMypage';
import { useOpenAdminPage } from './useOpenAdminPage';

export const useUser = create((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  getUser: async () => {
    // set({ isLoading: true });
    try {
      const userProfile = await queryClient.fetchQuery({
        queryKey: ['myProfile'],
        queryFn: getMyProfile,
      });
      set({ user: userProfile, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ user: null, isLoading: false });
    }
  },

  clearUser: () => {
    set({ user: null });
    useOpenMyPage.getState().setOpenMyPage(false);
    useOpenAdminPage.getState().setOpenAdminPage(false);
  },
}));
