import { StateCreator } from "zustand";

export type Record = {
  id: string;
  name: string;
  updatedAt: Date;
  tags?: string[];
  amount: number;
};

export type RecordList = {
  [key: string]: Record[];
};

export interface RecordSlice {
  records: RecordList;
  addRecord: (record: Record) => void;
  getRecord: (id: string) => Record | undefined;
  resetRecords: () => void;
}

const createRecordSlice: StateCreator<RecordSlice, [], [], RecordSlice> = (
  set
) => ({
  records: {},
  addRecord: () => {},
  getRecord: () => {
    return undefined;
  },
  resetRecords: () => set(() => ({ records: {} })),
});

export default createRecordSlice;
