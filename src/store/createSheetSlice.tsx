import getUniqueUUID from "@/utils/getNonDuplicateUUID";
import { StateCreator } from "zustand";

export type Media = {
  id: string;
  url: string;
  path: string;
};
export type Sheet = {
  id: string;
  name: string;
  updatedAt: Date;
  tags?: string[];
  desc?: string;
  media: string[];
};

export type SheetList = {
  [key: string]: Sheet[];
};

export interface SheetSlice {
  // States
  selectedSheet: Sheet | null;
  sheets: SheetList;
  // Actions
  addSheet: ({
    logId,
    name,
    tags,
    desc,
  }: {
    logId: string;
    name: string;
    tags?: string[];
    desc?: string;
  }) => void;
  setSelectedSheet: (sheet?: Sheet) => void;
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
    });

    sheets = { ...sheets, [logId]: logSheets };

    set(() => ({ sheets }));
  },
  setSelectedSheet: (sheet) => {
    set(() => ({ selectedSheet: sheet }));
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
