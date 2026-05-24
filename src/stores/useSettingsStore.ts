import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, Mode } from '@/types';

interface SettingsState {
  locale: Locale;
  showFingering: boolean;
  mode: Mode;
  selectedKey: string | null;
  setLocale: (locale: Locale) => void;
  toggleFingering: () => void;
  setMode: (mode: Mode) => void;
  setSelectedKey: (key: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      locale: 'es',
      showFingering: true,
      mode: 'major',
      selectedKey: null,
      setLocale: (locale) => set({ locale }),
      toggleFingering: () => set((s) => ({ showFingering: !s.showFingering })),
      setMode: (mode) => set({ mode }),
      setSelectedKey: (key) => set({ selectedKey: key }),
    }),
    { name: 'guitar-harmony-settings' }
  )
);
