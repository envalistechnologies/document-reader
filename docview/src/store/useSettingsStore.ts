import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../theme';

export type PageTurnAnimation = 'Slide' | 'Curl' | 'None';

interface SettingsState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  
  defaultFontFamily: string;
  setDefaultFontFamily: (font: string) => void;
  
  defaultFontSize: number;
  setDefaultFontSize: (size: number) => void;
  
  pageTurnAnimation: PageTurnAnimation;
  setPageTurnAnimation: (anim: PageTurnAnimation) => void;
  
  language: string;
  setLanguage: (lang: string) => void;
  
  adFreeUntil: number | null;
  grantAdFreeHours: (hours: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      defaultFontFamily: 'System',
      setDefaultFontFamily: (font) => set({ defaultFontFamily: font }),
      
      defaultFontSize: 16,
      setDefaultFontSize: (size) => set({ defaultFontSize: size }),
      
      pageTurnAnimation: 'Slide',
      setPageTurnAnimation: (anim) => set({ pageTurnAnimation: anim }),
      
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      
      adFreeUntil: null,
      grantAdFreeHours: (hours: number) => {
        const now = Date.now();
        const current = get().adFreeUntil;
        const start = (current && current > now) ? current : now;
        set({ adFreeUntil: start + hours * 60 * 60 * 1000 });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
