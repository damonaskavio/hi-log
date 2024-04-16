import SheetCard from "@/components/Card/SheetCard";
import EmptyMessage from "@/components/EmptyMessage";
import IconButton from "@/components/IconButton";
import AddSheetModal from "@/components/Modal/AddSheetModal";
import PageContent from "@/components/PageContent";
import useMainLayoutContext from "@/hooks/useMainLayoutContext";
import useHiLogStore from "@/store/useHiLogStore";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { IoAddCircleOutline, IoClose, IoTrash } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import "./index.css";
import { Sheet } from "@/store/createSheetSlice";
import ActionDialog from "@/components/Dialog/ActionDialog";
import Button from "@/components/Button";
import EditSheetModal from "@/components/Modal/EditSheetModal";

const SheetsList = () => {
  const { t } = useTranslation();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editSheet, setEditSheet] = useState<Sheet>();
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const { setRightMenu } = useMainLayoutContext();

  const [
    sheets,
    selectedSheet,
    selectedLog,
    getLogSheets,
    getLatestLogSheet,
    setSelectedSheet,
    addSheet,
    updateSheet,
    deleteSheets,
  ] = useHiLogStore(
    useShallow((state) => [
      state.sheets,
      state.selectedSheet,
      state.selectedLog,
      state.getLogSheets,
      state.getLatestLogSheet,
      state.setSelectedSheet,
      state.addSheet,
      state.updateSheet,
      state.deleteSheets,
    ])
  );

  const { id: logId } = selectedLog || {};

  const isSheetsEmpty = isEmpty(getLogSheets(logId || ""));
  const isSelectedSheetsEmpty = isEmpty(selectedSheets);

  const handleAddModalClick = () => {
    setAddModalOpen(true);
  };

  const handleAddSheet = (values: FieldValues) => {
    const { name, desc } = values;

    if (logId) {
      addSheet({
        logId,
        name,
        desc,
      });
    }
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalOpen = (sheet: Sheet) => {
    setEditSheet(sheet);
  };

  const handleEditModalClose = () => {
    setEditSheet(undefined);
  };

  const handleEditSheet = (values: FieldValues) => {
    if (selectedLog && editSheet) {
      const { name, desc } = values;

      updateSheet({
        logId: selectedLog.id,
        sheetId: editSheet.id,
        name,
        desc,
      });
    }
  };

  const handleSheetSelected = (recordId: string) => {
    setSelectedSheets([...selectedSheets, recordId]);
  };

  const handleSheetUnselected = (recordId: string) => {
    setSelectedSheets(selectedSheets.filter((r) => r !== recordId));
  };

  const handleSheetUnselectAll = () => {
    setSelectedSheets([]);
  };

  const handleDeleteSelected = () => {
    if (logId) {
      deleteSheets({ sheetIds: selectedSheets, logId });
      setShowDelete(false);
      setSelectedSheets([]);
    }
  };

  useEffect(() => {
    if (logId) {
      if (!selectedSheet) {
        const sheet = getLatestLogSheet(logId);
        setSelectedSheet(sheet);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheets]);

  const renderRightMenu = useCallback(() => {
    let menu: JSX.Element[] = [];

    if (!isSheetsEmpty) {
      if (isSelectedSheetsEmpty) {
        menu = [
          <IconButton
            icon={<IoAddCircleOutline />}
            onClick={() => handleAddModalClick()}
          />,
        ];
      } else {
        menu = [
          <IconButton
            icon={<IoClose />}
            onClick={() => handleSheetUnselectAll()}
          />,
          <IconButton icon={<IoTrash />} onClick={() => setShowDelete(true)} />,
        ];
      }
    }

    setRightMenu(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSheetsEmpty, selectedSheets]);

  useEffect(() => {
    renderRightMenu();
  }, [renderRightMenu]);

  return (
    <div>
      {logId ? (
        <>
          {isSheetsEmpty && <EmptyMessage msgKey="sheets empty" />}

          <PageContent>
            <div className="sheets-list-container">
              {logId &&
                getLogSheets(logId)?.map((sheet) => (
                  <SheetCard
                    key={sheet.id}
                    data={sheet}
                    onEdit={handleEditModalOpen}
                    selected={selectedSheets.includes(sheet.id)}
                    onSelected={handleSheetSelected}
                    onUnselected={handleSheetUnselected}
                    hasSelected={!isSelectedSheetsEmpty}
                  />
                ))}
            </div>

            {isSheetsEmpty && (
              <Button
                icon={<IoAddCircleOutline />}
                onClick={handleAddModalClick}
                compact={false}
              >
                {t("add media")}
              </Button>
            )}
          </PageContent>

          <AddSheetModal
            open={addModalOpen}
            onClose={() => handleAddModalClose()}
            onSubmit={handleAddSheet}
          />

          <EditSheetModal
            open={!!editSheet}
            onClose={() => handleEditModalClose()}
            onSubmit={handleEditSheet}
            sheet={editSheet}
          />

          <ActionDialog
            message="confirm delete sheets"
            open={showDelete}
            onClose={() => setShowDelete(false)}
            onSubmit={() => handleDeleteSelected()}
          />
        </>
      ) : (
        <EmptyMessage
          component={
            <Trans
              i18nKey={t("no log selected")}
              t={t}
              components={[<Link to={"/logs"}>Logs</Link>]}
            />
          }
        />
      )}
    </div>
  );
};

export default SheetsList;
