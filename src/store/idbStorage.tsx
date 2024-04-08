import { StateStorage, createJSONStorage } from "zustand/middleware";
import { del, get, set } from "idb-keyval";

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

const idbStorage = createJSONStorage(() => storage);

export default idbStorage;
