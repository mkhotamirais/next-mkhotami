import { create } from "zustand";

type State = {
  open: boolean;
  /**
   * Rantai item yang sedang terbuka, dari tingkat atas ke bawah.
   * openPath[0] = url item tingkat 1 yang terbuka, openPath[1] = url item tingkat 2, dan seterusnya.
   */
  openPath: string[];
  toggle: () => void;
  close: () => void;
  toggleSub: (level: number, key: string) => void;
};

export const useNavMobileThreeLevel = create<State>((set) => ({
  open: false,
  openPath: [],
  // Menutup panel juga menutup semua sub-menu yang terbuka.
  toggle: () => set((s) => (s.open ? { open: false, openPath: [] } : { open: true })),
  close: () => set({ open: false, openPath: [] }),
  // Item yang sama diklik lagi: tutup dia beserta turunannya.
  // Item lain di tingkat yang sama: gantikan rantai dari tingkat itu ke bawah (yang lama ikut tertutup).
  toggleSub: (level, key) =>
    set((s) => ({
      openPath: s.openPath[level] === key ? s.openPath.slice(0, level) : [...s.openPath.slice(0, level), key],
    })),
}));
