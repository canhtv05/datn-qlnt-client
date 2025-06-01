import { create } from "zustand";

interface CounterState {
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  onIncrease: () => set((state) => ({ count: state.count + 1 })),
  onDecrease: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set(() => ({ count: 0 })),
}));
