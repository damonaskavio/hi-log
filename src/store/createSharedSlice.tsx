import i18n from "@/localization";
import getUniqueUUID from "@/utils/getNonDuplicateUUID";
import { StateCreator } from "zustand";
import { LogSlice } from "./createLogSlice";
import { RecordSlice } from "./createRecordSlice";
import { SheetSlice, Totals } from "./createSheetSlice";
import { MediaSlice } from "./createMediaSlice";
import { PeopleSlice } from "./createPeopleSlice";

export interface SharedSlice {
  getSheetTotals: (logId?: string, sheetId?: string) => Totals;
  createLog: (args: { name: string; desc?: string; tags?: string[] }) => void;
  addSheet: (args: {
    logId: string;
    name: string;
    tags?: string[];
    desc?: string;
    sheetDate?: Date;
  }) => void;
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
  addPerson: (args: { logId: string; name: string }) => void;
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
  updatePerson: (args: {
    logId: string;
    personId: string;
    name: string;
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
  LogSlice & SheetSlice & RecordSlice & MediaSlice & PeopleSlice & SharedSlice,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  getSheetTotals: (logId, sheetId) => {
    const logSheets = logId ? get().sheets[logId] : undefined;
    const sheet = logSheets?.find((ls) => ls.id === sheetId);
    console.log("sheet", sheetId, sheet);
    if (sheet) {
      const records = get().getRecords({ logId, sheetId });
      const totals: Totals = {};

      records.map(({ amount, currency }) => {
        totals[currency] = (totals[currency] ?? 0) + amount;
      });

      return totals;
    }

    return {};
  },
  createLog: ({ name, desc, tags }) => {
    const uuid = getUniqueUUID(
      get().logs.map((l) => ({ id: l.id })),
      "id",
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
  addSheet: ({ logId, name, tags, desc, sheetDate }) => {
    let sheets = get().sheets;
    const logSheets = [...(sheets[logId] || [])];
    const sheetIds = logSheets.map((ls) => ({ id: ls.id }));

    const uuid = getUniqueUUID(sheetIds, "id");
    logSheets.push({
      id: uuid,
      name,
      tags,
      updatedAt: new Date(),
      media: [],
      desc,
      sheetDate,
    });

    sheets = { ...sheets, [logId]: logSheets };

    const records = get().records;
    set(() => ({ sheets, records: { ...records, [`${logId}_${uuid}`]: [] } }));
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
      "id",
    );

    sheetRecords.push({
      name,
      amount: amount || 0,
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
  addPerson: ({ logId, name }) => {
    let people = get().people;

    const logPeople = [...(people[logId] || [])];
    const uuid = getUniqueUUID(
      logPeople.map((lp) => ({ id: lp.id })),
      "id",
    );

    logPeople.push({ id: uuid, name });

    people = { ...people, [logId]: logPeople };

    set(() => ({ people }));
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
        amount: amount || 0,
        currency,
        desc,
        recordDate,
        recordTime,
        updatedAt: new Date(),
      };

      records = { ...records, [`${logId}_${sheetId}`]: sheetRecords };

      set(() => ({ records }));
    }
  },
  updatePerson: ({ logId, personId, name }) => {
    let people = get().people;
    const logPeople = [...(people[logId] || [])];

    const personIndex = logPeople.findIndex((p) => p.id === personId);

    if (personIndex > -1) {
      const person = logPeople[personIndex];
      logPeople[personIndex] = {
        ...person,
        name,
      };

      people = { ...people, [logId]: logPeople };

      set(() => ({ people }));
    }
  },
  deleteRecords: ({ recordIds, logId, sheetId }) => {
    let records = get().records;
    let sheetRecords = [...(records[`${logId}_${sheetId}`] || [])];

    sheetRecords = sheetRecords.filter(
      (record) => !recordIds.includes(record.id),
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
    get().resetPeople();
    set(() => ({
      selectedLog: undefined,
      selectedSheet: undefined,
    }));
  },
});

export default createSharedSlice;
