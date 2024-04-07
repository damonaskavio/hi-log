import { getUUID } from "./getUUID";

export interface IIndexable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: string;
}

export default function getUniqueUUID(
  arr: IIndexable[],
  lookUpKey: string,
  id?: string
) {
  const uuid = id === undefined ? getUUID() : id;

  const dupeFound = arr.find((a) => a[lookUpKey] === uuid);

  if (dupeFound) {
    return getUniqueUUID(arr, lookUpKey, uuid);
  }

  return uuid;
}
