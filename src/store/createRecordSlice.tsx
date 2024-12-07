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
  getRecords: (args: { logId?: string; sheetId?: string }) => Record[];
  orderRecord: (args: {
    logId: string;
    sheetId: string;
    fromIndex: number;
    toIndex: number;
  }) => void;
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
  orderRecord: ({ logId, sheetId, fromIndex, toIndex }) =>
    set((state) => {
      const record = [...(state.records[`${logId}_${sheetId}`] || [])];

      const element = record[fromIndex];
      record.splice(fromIndex, 1);
      record.splice(toIndex, 0, element);

      return { records: { ...state.records, [`${logId}_${sheetId}`]: record } };
    }),
  resetRecords: () => set(() => ({ records: {} })),
});

export default createRecordSlice;
