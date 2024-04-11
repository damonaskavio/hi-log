import Button from "@/components/Button";
import MenuDialog from "@/components/Dialog/MenuDialog";
import EmptyMessage from "@/components/EmptyMessage";
import PageContent from "@/components/PageContent";
import useHiLogStore from "@/store/useHiLogStore";
import getBase64 from "@/utils/getBase64";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import "./index.css";
import MediaCard from "@/components/Card/MediaCard";
import useSheetLayoutContext from "@/hooks/useSheetLayoutContext";
import IconButton from "@/components/IconButton";

const SheetMedia = () => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const { setRightMenu } = useSheetLayoutContext();

  const [medias, selectedLog, selectedSheet, addMedia, getMedias] =
    useHiLogStore(
      useShallow((state) => [
        state.medias,
        state.selectedLog,
        state.selectedSheet,
        state.addMedia,
        state.getMedias,
      ])
    );

  const handleAddClick = () => {
    setOpenDialog(true);
  };

  const onGalleryPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedLog && selectedSheet) {
      const file = e.target.files?.[0];

      if (file) {
        const base64 = await getBase64(file);

        if (base64) {
          addMedia({
            logId: selectedLog.id,
            sheetId: selectedSheet.id,
            base64,
          });

          setOpenDialog(false);
        }
      }
    }
  };

  const sheetMedias =
    selectedLog && selectedSheet
      ? getMedias({
          logId: selectedLog.id,
          sheetId: selectedSheet.id,
        })
      : [];

  const isMediaEmpty = isEmpty(sheetMedias);

  const menuOptions = [
    { label: t("capture media"), onClick: () => cameraRef.current?.click() },
    { label: t("choose media"), onClick: () => galleryRef.current?.click() },
  ];

  useEffect(() => {
    setRightMenu(
      isMediaEmpty
        ? []
        : [
            <IconButton
              icon={<IoAddCircleOutline />}
              onClick={() => handleAddClick()}
            />,
          ]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMediaEmpty, medias]);

  return (
    <div className="sheet-media-root">
      {isMediaEmpty && <EmptyMessage msgKey="media empty" />}
      <PageContent>
        <div className="media-container">
          {sheetMedias.map(({ base64 }) => (
            <MediaCard src={base64} />
          ))}
        </div>

        {isMediaEmpty && (
          <Button
            icon={<IoAddCircleOutline />}
            onClick={handleAddClick}
            compact={false}
          >
            {t("add media")}
          </Button>
        )}
      </PageContent>

      <MenuDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        options={menuOptions}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={onGalleryPick}
      />
      <input ref={cameraRef} type="file" accept="image/*" capture />
    </div>
  );
};

export default SheetMedia;
