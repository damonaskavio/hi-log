import { StateCreator } from "zustand";

export type Person = {
  id: string;
  name: string;
};

export type PeopleList = {
  [key: string]: Person[];
};

export interface PeopleSlice {
  // States
  people: PeopleList;
  // Actions
  getPerson: (args: { logId: string; personId: string }) => Person | null;
  getPeople: (args: { logId: string }) => Person[];
  resetPeople: () => void;
}

const createPeopleSlice: StateCreator<PeopleSlice, [], [], PeopleSlice> = (
  set,
  get
) => ({
  people: {},
  getPerson: ({ logId, personId }) => {
    return get().people[logId].find((person) => person.id === personId) || null;
  },
  getPeople: ({ logId }) => {
    return get().people[logId] || [];
  },
  resetPeople: () => set(() => ({ people: {} })),
});

export default createPeopleSlice;
