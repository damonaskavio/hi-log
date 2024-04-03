import { create } from "zustand";
import { persist } from "zustand/middleware";
import idbStorage from "./idbStorage";

export type Log = {
  id: string;
  name: string;
  updatedAt: Date;
  tags?: string[];
};

interface LogState {
  logs: Log[];
  addLog: (log: Log) => void;
  resetLogs: () => void;
}

const useLogStore = create<LogState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
      resetLogs: () => set(() => ({ logs: [] })),
    }),
    {
      name: "log-storage",
      storage: idbStorage,
    }
  )
);

export default useLogStore;
