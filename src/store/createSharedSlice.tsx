import i18n from "@/localization";
import getUniqueUUID from "@/utils/getNonDuplicateUUID";
import { StateCreator } from "zustand";
import { LogSlice } from "./createLogSlice";
import { RecordSlice } from "./createRecordSlice";
import { SheetSlice } from "./createSheetSlice";
import { MediaSlice } from "./createMediaSlice";

export interface SharedSlice {
  createLog: (args: { name: string; tags?: string[] }) => void;
  deleteSheets: (args: { logId: string; sheetIds: string[] }) => void;
  resetAll: () => void;
}

const createSharedSlice: StateCreator<
  LogSlice & SheetSlice & RecordSlice & MediaSlice,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  createLog: ({ name, tags }) => {
    const uuid = getUniqueUUID(
      get().logs.map((l) => ({ id: l.id })),
      "id"
    );

    get().addLog({
      id: uuid,
      updatedAt: new Date(),
      name,
      tags,
    });

    get().addSheet({
      logId: uuid,
      name: i18n.t("default log sheet"),
      desc: i18n.t("default log sheet desc"),
    });
  },
  deleteSheets: ({ logId, sheetIds }) => {
    const records = { ...get().records };

    sheetIds.forEach((sheetId) => {
      delete records[`${logId}_${sheetId}`];
    });

    let sheets = get().sheets;
    let logSheets = [...(sheets[logId] || [])];

    logSheets = logSheets.filter((sheet) => !sheetIds.includes(sheet.id));
    sheets = { ...sheets, [logId]: logSheets };

    const { id: selectedSheetId } = get().selectedSheet || {};

    set(() => ({ records, sheets }));
    if (selectedSheetId && sheetIds.includes(selectedSheetId)) {
      set(() => ({ selectedSheet: null }));
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
