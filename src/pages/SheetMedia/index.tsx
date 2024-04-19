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
import { useCallback, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { IoAddCircleOutline, IoClose, IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import "./index.css";
import ImageDialog from "@/components/Dialog/ImageDialog";
import ActionDialog from "@/components/Dialog/ActionDialog";

const SheetMedia = () => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [previewImg, setPreviewImg] = useState<string>();
  const [checkedMedias, setCheckedMedias] = useState<string[]>([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef(null);
  const { setRightMenu } = useMainLayoutContext();

  const [selectedLog, selectedSheet, addMedia, getMedias, deleteMedias] =
    useHiLogStore(
      useShallow((state) => [
        state.selectedLog,
        state.selectedSheet,
        state.addMedia,
        state.getMedias,
        state.deleteMedias,
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

  const isMediasEmpty = isEmpty(sheetMedias);
  const isCheckedMediasEmpty = isEmpty(checkedMedias);

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

  const handleMediaChecked = (mediaId: string) => {
    setCheckedMedias([...checkedMedias, mediaId]);
  };

  const handleMediaUnchecked = (mediaId: string) => {
    setCheckedMedias(checkedMedias.filter((r) => r !== mediaId));
  };

  const handleMediaUncheckAll = () => {
    setCheckedMedias([]);
  };

  const handleDeleteChecked = () => {
    if (!isCheckedMediasEmpty) {
      deleteMedias({ logId, sheetId, mediaIds: checkedMedias });
      setShowDelete(false);
      setCheckedMedias([]);
    }
  };

  const renderRightMenu = useCallback(() => {
    let menu: JSX.Element[] = [];

    if (!isMediasEmpty) {
      if (isCheckedMediasEmpty) {
        menu = [
          <IconButton
            icon={<IoAddCircleOutline />}
            onClick={() => handleAddClick()}
          />,
        ];
      } else {
        menu = [
          <IconButton
            icon={<IoClose />}
            onClick={() => handleMediaUncheckAll()}
          />,
          <IconButton icon={<IoTrashOutline />} onClick={() => setShowDelete(true)} />,
        ];
      }
    }

    setRightMenu(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMediasEmpty, checkedMedias]);

  useEffect(() => {
    renderRightMenu();
  }, [renderRightMenu]);

  return (
    <div className="sheet-media-root">
      {sheetId && logId ? (
        <>
          {isMediasEmpty && <EmptyMessage msgKey="media empty" />}
          <PageContent>
            <div ref={parentRef} className="media-container">
              <div
                className="media-virtualize"
                style={{ height: `${getTotalSize()}px` }}
              >
                {getVirtualItems().map(({ index, lane, start }) => {
                  const { base64, id } = sheetMedias[index];
                  const checked = checkedMedias.includes(id);

                  return (
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
                      <MediaCard
                        src={base64}
                        onClick={() => setPreviewImg(base64)}
                        selected={checked}
                        checked={checked}
                        onChecked={() => handleMediaChecked(id)}
                        onUnchecked={() => handleMediaUnchecked(id)}
                        hasChecked={!isCheckedMediasEmpty}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {isMediasEmpty && (
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

          <ImageDialog
            open={!!previewImg}
            base64={previewImg}
            onClose={() => {
              setPreviewImg(undefined);
            }}
          />

          <ActionDialog
            message="confirm delete media"
            open={showDelete}
            onClose={() => setShowDelete(false)}
            onSubmit={() => handleDeleteChecked()}
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
