import { StateCreator } from "zustand";

export type Log = {
  id: string;
  name: string;
  updatedAt: Date;
  tags?: string[];
};

export interface LogSlice {
  // States
  logs: Log[];
  selectedLog: Log | null;
  // Actions
  addLog: (log: Log) => void;
  setSelectedLog: (log?: Log) => void;
  getLog: (id: string) => Log | null;
  resetLogs: () => void;
}

const createLogSlice: StateCreator<LogSlice, [], [], LogSlice> = (
  set,
  get
) => ({
  logs: [],
  selectedLog: null,
  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs],
    })),
  setSelectedLog: (log) => set(() => ({ selectedLog: log })),
  getLog: (id) => {
    const logs = get().logs;
    return logs.find((l) => l.id === id) || null;
  },
  resetLogs: () => set(() => ({ logs: [] })),
});

export default createLogSlice;
