import getUniqueUUID from "@/utils/getNonDuplicateUUID";
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
  addRecord: ({
    logId,
    sheetId,
  }: {
    logId: string;
    sheetId: string;
    name: string;
    desc?: string;
    amount: number;
    currency: string;
    recordDate: Date;
    recordTime: string;
  }) => void;
  getRecord: ({
    logId,
    sheetId,
    recordId,
  }: {
    logId: string;
    sheetId: string;
    recordId: string;
  }) => Record | null;
  getRecords: ({
    logId,
    sheetId,
  }: {
    logId: string;
    sheetId: string;
  }) => Record[];
  resetRecords: () => void;
}

const createRecordSlice: StateCreator<RecordSlice, [], [], RecordSlice> = (
  set,
  get
) => ({
  records: {},
  addRecord: ({
    logId,
    sheetId,
    name,
    amount,
    currency,
    desc,
    recordDate,
    recordTime,
  }) => {
    let records = get().records;
    const sheetRecords = [...(records[`${logId}_${sheetId}`] || [])];
    const uuid = getUniqueUUID(
      sheetRecords.map((sr) => ({ id: sr.id })),
      "id"
    );

    sheetRecords.push({
      name,
      amount,
      currency,
      desc,
      id: uuid,
      updatedAt: new Date(),
      recordDate,
      recordTime,
    });

    records = { ...records, [`${logId}_${sheetId}`]: sheetRecords };

    set(() => ({ records }));
  },
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
