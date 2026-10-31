import { create } from "zustand";
import { persist } from "zustand/middleware";
import idbStorage from "./idbStorage";
import createLogSlice, { LogSlice } from "./createLogSlice";
import createSheetSlice, { SheetSlice } from "./createSheetSlice";
import createRecordSlice, { RecordSlice } from "./createRecordSlice";
import createMediaSlice, { MediaSlice } from "./createMediaSlice";
import createSharedSlice, { SharedSlice } from "./createSharedSlice";
import createPeopleSlice, { PeopleSlice } from "./createPeopleSlice";

const useHiLogStore = create<
  LogSlice & SheetSlice & RecordSlice & MediaSlice & PeopleSlice & SharedSlice
>()(
  persist(
    (...a) => ({
      ...createLogSlice(...a),
      ...createSheetSlice(...a),
      ...createRecordSlice(...a),
      ...createMediaSlice(...a),
      ...createPeopleSlice(...a),
      ...createSharedSlice(...a),
    }),
    {
      name: "hi-log-storage",
      storage: idbStorage,
    }
  )
);

export default useHiLogStore;
