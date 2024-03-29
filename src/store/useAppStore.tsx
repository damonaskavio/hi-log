import { create } from "zustand";
import { persist } from "zustand/middleware";
import idbStorage from "./idbStorage";

interface AppState {
  loginData: object;
  count: number;
  setCount: (count: number) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      loginData: {},
      count: 0,
      setCount: (count) => set(() => ({ count })),
    }),
    {
      name: "app-storage",
      storage: idbStorage,
    }
  )
);

export default useAppStore;
