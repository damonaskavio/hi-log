import { StateCreator } from "zustand";

export type Sheet = {
  id: string;
  name: string;
  updatedAt: Date;
  sheetDate?: Date;
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
  updateSheet: (args: {
    logId: string;
    sheetId: string;
    name?: string;
    desc?: string;
    sheetDate?: Date;
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
  orderSheet: (args: {
    logId: string;
    fromIndex: number;
    toIndex: number;
  }) => void;
  getSheet: (logId: string, sheetId: string) => Sheet | null;
  getLogSheets: (logId: string) => Sheet[];
  getLatestLogSheet: (logId: string) => Sheet;
  resetSheets: () => void;
}

const createSheetSlice: StateCreator<SheetSlice, [], [], SheetSlice> = (
  set,
  get
) => ({
  selectedSheet: null,
  sheets: {},
  updateSheet: ({ logId, sheetId, name, desc, sheetDate }) => {
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
        sheetDate,
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
  orderSheet: ({ logId, fromIndex, toIndex }) => {
    let sheets = get().sheets;
    const logSheets = [...(sheets[logId] || [])];

    const element = logSheets[fromIndex];
    logSheets.splice(fromIndex, 1);
    logSheets.splice(toIndex, 0, element);

    sheets = { ...sheets, [logId]: logSheets };

    set(() => ({ sheets }));
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
