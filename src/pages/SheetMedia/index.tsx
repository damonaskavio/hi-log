import Button from "@/components/Button";
import MediaCard from "@/components/Card/MediaCard";
import MenuDialog from "@/components/Dialog/MenuDialog";
import EmptyMessage from "@/components/EmptyMessage";
import IconButton from "@/components/IconButton";
import PageContent from "@/components/PageContent";
import useMainLayoutContext from "@/hooks/useMainLayoutContext";
import useHiLogStore from "@/store/useHiLogStore";
import getBase64 from "@/utils/getBase64";
import { useVirtualizer } from "@tanstack/react-virtual";
import isEmpty from "lodash/isEmpty";
import { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import "./index.css";

const SheetMedia = () => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef(null);
  const { setRightMenu } = useMainLayoutContext();

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

  const { id: logId } = selectedLog || {};
  const { id: sheetId } = selectedSheet || {};

  const handleAddClick = () => {
    setOpenDialog(true);
  };

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const { getTotalSize, getVirtualItems, measureElement } = useVirtualizer({
    count: sheetMedias.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 4,
    lanes: 3,
  });

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
      {sheetId && logId ? (
        <>
          {isMediaEmpty && <EmptyMessage msgKey="media empty" />}
          <PageContent>
            <div ref={parentRef} className="media-container">
              <div
                className="media-virtualize"
                style={{ height: `${getTotalSize()}px` }}
              >
                {getVirtualItems().map(({ index, lane, start }) => (
                  <div
                    ref={measureElement}
                    key={`media_${index}`}
                    data-index={index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: `${lane * 33}%`,
                      width: "33%",
                      transform: `translateY(${start}px)`,
                      padding: "10px",
                    }}
                  >
                    <MediaCard src={sheetMedias[index].base64} />
                  </div>
                ))}
              </div>
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
            onChange={onFileInputChange}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture
            onChange={onFileInputChange}
          />
        </>
      ) : (
        <EmptyMessage
          component={
            <Trans
              i18nKey={t(logId ? "no sheet selected" : "no log selected")}
              t={t}
              components={[<Link to={logId ? "/sheets" : "/logs"}>Logs</Link>]}
            />
          }
        />
      )}
    </div>
  );
};

export default SheetMedia;
