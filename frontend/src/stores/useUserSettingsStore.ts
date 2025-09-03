import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserSettings {
  dateFormat: string;
  setDateFormat: (format: string) => void;
}

export const useUserSettings = create<UserSettings>()(
  persist(
    (set) => ({
      dateFormat: 'YYYY-MM-DD',
      setDateFormat: (format) => set({ dateFormat: format }),
    }),
    { name: 'user-settings' } // localStorage key
  )
);
