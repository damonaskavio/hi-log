import getUniqueUUID from "@/utils/getNonDuplicateUUID";
import { StateCreator } from "zustand";

export type Sheet = {
  id: string;
  name: string;
  updatedAt: Date;
  tags?: string[];
  desc?: string;
  media: string[];
  totals: { [key: string]: number };
};

export type SheetList = {
  [key: string]: Sheet[];
};

export interface SheetSlice {
  // States
  selectedSheet: Sheet | null;
  sheets: SheetList;
  // Actions
  addSheet: (args: {
    logId: string;
    name: string;
    tags?: string[];
    desc?: string;
  }) => void;
  updateSheet: (args: {
    logId: string;
    sheetId: string;
    name?: string;
    desc?: string;
  }) => void;
  updateSheetTotal: (args: {
    logId: string;
    sheetId: string;
    currency: string;
    total: number;
    additive?: boolean;
  }) => void;
  setSelectedSheet: (sheet?: Sheet) => void;
  checkSelectedSheet: (args: { logId: string; sheetId: string }) => void;
  getSheet: (logId: string, sheetId: string) => Sheet | null;
  getLogSheets: (logId: string) => Sheet[] | null;
  getLatestLogSheet: (logId: string) => Sheet;
  resetSheets: () => void;
}

const createSheetSlice: StateCreator<SheetSlice, [], [], SheetSlice> = (
  set,
  get
) => ({
  selectedSheet: null,
  sheets: {},
  addSheet: ({ logId, name, tags, desc }) => {
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
      totals: {},
    });

    sheets = { ...sheets, [logId]: logSheets };

    set(() => ({ sheets }));
  },
  updateSheet: ({ logId, sheetId, name, desc }) => {
    let sheets = get().sheets;
    const logSheets = [...(sheets[logId] || [])];

    const sheetIndex = logSheets.findIndex((sheet) => sheet.id === sheetId);

    if (sheetIndex > -1) {
      const sheet = logSheets[sheetIndex];
      logSheets[sheetIndex] = {
        ...sheet,
        name: name || "",
        desc,
        updatedAt: new Date(),
      };

      sheets = { ...sheets, [logId]: logSheets };

      set(() => ({ sheets }));

      get().checkSelectedSheet({ logId, sheetId });
    }
  },
  updateSheetTotal: ({ logId, sheetId, currency, total, additive }) => {
    let sheets = get().sheets;
    const logSheets = [...(sheets[logId] || [])];

    const sheetIndex = logSheets.findIndex((sheet) => sheet.id === sheetId);

    if (sheetIndex > -1) {
      const sheet = logSheets[sheetIndex];
      const totals = { ...sheet.totals };

      if (additive) {
        const prevTotal = totals[currency] || 0;
        totals[currency] = prevTotal + total;
      } else {
        totals[currency] = total;
      }

      logSheets[sheetIndex] = {
        ...sheet,
        totals,
        updatedAt: new Date(),
      };

      sheets = { ...sheets, [logId]: logSheets };

      set(() => ({ sheets }));

      get().checkSelectedSheet({ logId, sheetId });
    }
  },
  setSelectedSheet: (sheet) => {
    set(() => ({ selectedSheet: sheet }));
  },
  checkSelectedSheet: ({ logId, sheetId }) => {
    const { id: selectedId } = get().selectedSheet || {};

    if (selectedId === sheetId) {
      const sheets = get().sheets[logId] || [];

      const sheet = sheets.find((s) => s.id === sheetId);
      get().setSelectedSheet(sheet);
    }
  },
  getSheet: (logId, sheetId) => {
    const logSheets = get().sheets[logId];

    if (logSheets) {
      return logSheets.find((ls) => ls.id === sheetId) || null;
    }

    return null;
  },
  getLogSheets: (logId) => {
    return get().sheets[logId] || [];
  },
  getLatestLogSheet: (logId) => {
    return get().sheets[logId]?.sort((a, b) => +b.updatedAt - +a.updatedAt)[0];
  },
  resetSheets: () => set(() => ({ sheets: {} })),
});

export default createSheetSlice;
