import { StateCreator } from "zustand";

export type Log = {
  id: string;
  name?: string;
  desc?: string;
  updatedAt: Date;
  tags?: string[];
};

export interface LogSlice {
  // States
  logs: Log[];
  selectedLog: Log | null;
  // Actions
  addLog: (log: Log) => void;
  updateLog: (args: { logId: string; name?: string; desc?: string }) => void;
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
  updateLog: ({ logId, name, desc }) => {
    const logs = [...get().logs];

    const logIndex = logs.findIndex((log) => log.id === logId);

    const log = logs[logIndex];

    if (log) {
      logs[logIndex] = { ...log, name, desc, updatedAt: new Date() };
    }

    set(() => ({ logs }));
  },
  setSelectedLog: (log) => set(() => ({ selectedLog: log })),
  getLog: (id) => {
    const logs = get().logs;
    return logs.find((l) => l.id === id) || null;
  },
  resetLogs: () => set(() => ({ logs: [] })),
});

export default createLogSlice;
