import i18n from "@/localization";
import getUniqueUUID from "@/utils/getNonDuplicateUUID";
import { StateCreator } from "zustand";
import { LogSlice } from "./createLogSlice";
import { RecordSlice } from "./createRecordSlice";
import { SheetSlice } from "./createSheetSlice";

export interface SharedSlice {
  createLog: (args: { name: string; tags?: string[] }) => void;
  resetAll: () => void;
}

const createSharedSlice: StateCreator<
  LogSlice & SheetSlice & RecordSlice,
  [],
  [],
  SharedSlice
> = (_, get) => ({
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
  resetAll: () => {
    get().resetLogs();
    get().resetSheets();
    get().resetRecords();
  },
});

export default createSharedSlice;
