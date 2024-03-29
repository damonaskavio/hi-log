import { StateStorage, createJSONStorage } from "zustand/middleware";
import { del, get, set } from "idb-keyval";

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log("idb get key:", name);
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(`idb set key:${name}, val:${value}`);
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log("idb del key:", name);
    await del(name);
  },
};

const idbStorage = createJSONStorage(() => storage);

export default idbStorage;
