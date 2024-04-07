import { create } from "zustand";
import { persist } from "zustand/middleware";
import idbStorage from "./idbStorage";
import createLogSlice, { LogSlice } from "./createLogSlice";
import createSheetSlice, { SheetSlice } from "./createSheetSlice";
import createRecordSlice, { RecordSlice } from "./createRecordSlice";
import createSharedSlice, { SharedSlice } from "./createSharedSlice";

const useHiLogStore = create<
  LogSlice & SheetSlice & RecordSlice & SharedSlice
>()(
  persist(
    (...a) => ({
      ...createLogSlice(...a),
      ...createSheetSlice(...a),
      ...createRecordSlice(...a),
      ...createSharedSlice(...a),
    }),
    {
      name: "hi-log-storage",
      storage: idbStorage,
    }
  )
);

export default useHiLogStore;
