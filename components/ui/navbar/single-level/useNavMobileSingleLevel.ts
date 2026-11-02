import { create } from "zustand";

type State = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

export const useNavMobileSingleLevel = create<State>((set) => ({
  open: false,
  toggle: () => set((s) => ({ open: !s.open })),
  close: () => set({ open: false }),
}));
