import i18n from "@/localization";
import getUniqueUUID from "@/utils/getNonDuplicateUUID";
import { StateCreator } from "zustand";
import { LogSlice } from "./createLogSlice";
import { RecordSlice } from "./createRecordSlice";
import { SheetSlice } from "./createSheetSlice";
import { MediaSlice } from "./createMediaSlice";

export interface SharedSlice {
  createLog: (args: { name: string; desc?: string; tags?: string[] }) => void;
  addRecord: (args: {
    logId: string;
    sheetId: string;
    name: string;
    desc?: string;
    amount: number;
    currency: string;
    recordDate: Date;
    recordTime: string;
  }) => void;
  updateRecord: (args: {
    logId: string;
    sheetId: string;
    recordId: string;
    name: string;
    desc?: string;
    amount: number;
    currency: string;
    recordDate: Date;
    recordTime: string;
  }) => void;
  deleteRecords: (args: {
    recordIds: string[];
    logId: string;
    sheetId: string;
  }) => void;
  deleteSheets: (args: { logId: string; sheetIds: string[] }) => void;
  deleteLogs: (args: { logIds: string[] }) => void;
  resetAll: () => void;
}

const createSharedSlice: StateCreator<
  LogSlice & SheetSlice & RecordSlice & MediaSlice & SharedSlice,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  createLog: ({ name, desc, tags }) => {
    const uuid = getUniqueUUID(
      get().logs.map((l) => ({ id: l.id })),
      "id"
    );

    get().addLog({
      id: uuid,
      updatedAt: new Date(),
      name,
      desc,
      tags,
    });

    get().addSheet({
      logId: uuid,
      name: i18n.t("default log sheet"),
      desc: i18n.t("default log sheet desc"),
    });
  },
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

    get().updateSheetTotal({
      logId,
      sheetId,
      currency,
      total: amount,
      additive: true,
    });

    set(() => ({ records }));
  },
  updateRecord: ({
    logId,
    sheetId,
    recordId,
    name,
    amount,
    currency,
    desc,
    recordDate,
    recordTime,
  }) => {
    let records = get().records;
    const sheetRecords = [...(records[`${logId}_${sheetId}`] || [])];

    const recordIndex = sheetRecords.findIndex((r) => r.id === recordId);

    if (recordIndex > -1) {
      const record = sheetRecords[recordIndex];
      sheetRecords[recordIndex] = {
        ...record,
        name,
        amount,
        currency,
        desc,
        recordDate,
        recordTime,
        updatedAt: new Date(),
      };

      records = { ...records, [`${logId}_${sheetId}`]: sheetRecords };

      get().updateSheetTotal({
        logId,
        sheetId,
        currency,
        total: amount - record.amount,
        additive: true,
      });

      set(() => ({ records }));
    }
  },
  deleteRecords: ({ recordIds, logId, sheetId }) => {
    let records = get().records;
    let sheetRecords = [...(records[`${logId}_${sheetId}`] || [])];

    sheetRecords
      .filter((record) => recordIds.includes(record.id))
      .forEach(({ currency, amount }) => {
        get().updateSheetTotal({
          logId,
          sheetId,
          currency,
          total: -amount,
          additive: true,
        });
      });

    sheetRecords = sheetRecords.filter(
      (record) => !recordIds.includes(record.id)
    );

    records = { ...records, [`${logId}_${sheetId}`]: sheetRecords };

    set(() => ({ records }));
  },
  deleteSheets: ({ logId, sheetIds }) => {
    // Delete sheet media
    const medias = { ...get().medias };

    sheetIds.forEach((sheetId) => {
      delete medias[`${logId}_${sheetId}`];
    });

    // Delete sheet records
    const records = { ...get().records };

    sheetIds.forEach((sheetId) => {
      delete records[`${logId}_${sheetId}`];
    });

    // Delete sheets by ids
    let sheets = get().sheets;
    let logSheets = [...(sheets[logId] || [])];

    logSheets = logSheets.filter((sheet) => !sheetIds.includes(sheet.id));
    sheets = { ...sheets, [logId]: logSheets };

    const { id: selectedSheetId } = get().selectedSheet || {};

    set(() => ({ records, sheets, medias }));

    if (selectedSheetId && sheetIds.includes(selectedSheetId)) {
      set(() => ({ selectedSheet: null }));
    }
  },
  deleteLogs: ({ logIds }) => {
    // Delete all sheets belonging to logIds
    const sheets = get().sheets;

    Object.keys(sheets).forEach((key) => {
      if (logIds.includes(key)) {
        const logSheets = sheets[key];

        get().deleteSheets({
          logId: key,
          sheetIds: logSheets.map(({ id: sheetId }) => sheetId),
        });
      }
    });

    // Delete logs within logIds
    const logs = get().logs.filter((log) => !logIds.includes(log.id));

    set(() => ({ logs }));

    const { id: selectedLogId } = get().selectedLog || {};

    // Remove selectedLog if within logIds
    if (selectedLogId && logIds.includes(selectedLogId)) {
      set(() => ({ selectedLog: null }));
    }
  },
  resetAll: () => {
    get().resetLogs();
    get().resetSheets();
    get().resetRecords();
    get().resetMedias();
    set(() => ({
      selectedLog: undefined,
      selectedSheet: undefined,
    }));
  },
});

export default createSharedSlice;
