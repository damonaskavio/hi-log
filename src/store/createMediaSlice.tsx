import getUniqueUUID from "@/utils/getNonDuplicateUUID";
import { StateCreator } from "zustand";

export type Media = {
  id: string;
  base64: string;
};

export type MediaList = {
  [key: string]: Media[];
};

export interface MediaSlice {
  // States
  medias: MediaList;
  // Actions
  addMedia: (args: {
    logId: string;
    sheetId: string;
    recordId?: string;
    base64: string;
  }) => void;
  getMedia: (args: {
    logId: string;
    sheetId: string;
    mediaId: string;
  }) => Media | null;
  getMedias: (args: { logId: string; sheetId: string }) => Media[];
  deleteMedias: (args: {
    logId?: string;
    sheetId?: string;
    mediaIds: string[];
  }) => void;
  resetMedias: () => void;
}

const createMediaSlice: StateCreator<MediaSlice, [], [], MediaSlice> = (
  set,
  get
) => ({
  medias: {},
  addMedia: ({
    logId,
    sheetId,
    // recordId,
    base64,
  }) => {
    let medias = get().medias;
    const sheetMedias = [...(medias[`${logId}_${sheetId}`] || [])];
    const uuid = getUniqueUUID(
      sheetMedias.map((sr) => ({ id: sr.id })),
      "id"
    );

    sheetMedias.push({
      id: uuid,
      base64,
    });

    medias = { ...medias, [`${logId}_${sheetId}`]: sheetMedias };

    set(() => ({ medias }));
  },
  getMedia: ({ logId, sheetId, mediaId }) => {
    return (
      get().medias[`${logId}_${sheetId}`].find(
        (media) => media.id === mediaId
      ) || null
    );
  },
  getMedias: ({ logId, sheetId }) => {
    return get().medias[`${logId}_${sheetId}`] || [];
  },
  deleteMedias: ({ logId, sheetId, mediaIds }) => {
    let medias = get().medias;
    let sheetMedias = [...(medias[`${logId}_${sheetId}`] || [])];

    sheetMedias = sheetMedias.filter((media) => !mediaIds.includes(media.id));

    medias = { ...medias, [`${logId}_${sheetId}`]: sheetMedias };

    set(() => ({ medias }));
  },
  resetMedias: () => set(() => ({ medias: {} })),
});

export default createMediaSlice;
