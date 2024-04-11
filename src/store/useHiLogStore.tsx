import { create } from "zustand";
import { persist } from "zustand/middleware";
import idbStorage from "./idbStorage";
import createLogSlice, { LogSlice } from "./createLogSlice";
import createSheetSlice, { SheetSlice } from "./createSheetSlice";
import createRecordSlice, { RecordSlice } from "./createRecordSlice";
import createMediaSlice, { MediaSlice } from "./createMediaSlice";
import createSharedSlice, { SharedSlice } from "./createSharedSlice";

const useHiLogStore = create<
  LogSlice & SheetSlice & RecordSlice & MediaSlice & SharedSlice
>()(
  persist(
    (...a) => ({
      ...createLogSlice(...a),
      ...createSheetSlice(...a),
      ...createRecordSlice(...a),
      ...createMediaSlice(...a),
      ...createSharedSlice(...a),
    }),
    {
      name: "hi-log-storage",
      storage: idbStorage,
    }
  )
);

export default useHiLogStore;
