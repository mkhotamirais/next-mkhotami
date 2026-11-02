import { create } from "zustand";

type State = {
  open: boolean;
  /** url item yang sub-menunya sedang terbuka (hanya satu sekaligus), atau null. */
  openSub: string | null;
  toggle: () => void;
  close: () => void;
  toggleSub: (key: string) => void;
};

export const useNavMobileTwoLevel = create<State>((set) => ({
  open: false,
  openSub: null,
  // Menutup panel juga menutup sub-menu yang terbuka.
  toggle: () => set((s) => (s.open ? { open: false, openSub: null } : { open: true })),
  close: () => set({ open: false, openSub: null }),
  toggleSub: (key) => set((s) => ({ openSub: s.openSub === key ? null : key })),
}));
