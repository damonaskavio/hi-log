import getUUID from "./getUUID";

export interface IIndexable {
  [key: string]: string;
}

const getUniqueUUID = (
  arr: IIndexable[],
  lookUpKey: string,
  id?: string
): string => {
  const uuid = id === undefined ? getUUID() : id;

  const dupeFound = arr.find((a) => a[lookUpKey] === uuid);

  if (dupeFound) {
    return getUniqueUUID(arr, lookUpKey, uuid);
  }

  return uuid;
};

export default getUniqueUUID;
