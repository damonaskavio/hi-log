import { StateCreator } from "zustand";

export type Record = {
  id: string;
  name: string;
  desc?: string;
  updatedAt: Date;
  recordDate?: Date;
  recordTime?: string;
  tags?: string[];
  amount: number;
  currency: string;
};

export type RecordList = {
  [key: string]: Record[];
};

export interface RecordSlice {
  // States
  records: RecordList;
  // Actions

  getRecord: (args: {
    logId: string;
    sheetId: string;
    recordId: string;
  }) => Record | null;
  getRecords: (args: { logId: string; sheetId: string }) => Record[];
  resetRecords: () => void;
}

const createRecordSlice: StateCreator<RecordSlice, [], [], RecordSlice> = (
  set,
  get
) => ({
  records: {},

  getRecord: ({ logId, sheetId, recordId }) => {
    return (
      get().records[`${logId}_${sheetId}`].find(
        (record) => record.id === recordId
      ) || null
    );
  },
  getRecords: ({ logId, sheetId }) => {
    return get().records[`${logId}_${sheetId}`] || [];
  },

  resetRecords: () => set(() => ({ records: {} })),
});

export default createRecordSlice;
