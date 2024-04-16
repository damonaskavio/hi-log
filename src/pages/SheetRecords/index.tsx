import Button from "@/components/Button";
import RecordCard from "@/components/Card/RecordCard";
import EmptyMessage from "@/components/EmptyMessage";
import IconButton from "@/components/IconButton";
import AddRecordModal from "@/components/Modal/AddRecordModal";
import PageContent from "@/components/PageContent";
import useMainLayoutContext from "@/hooks/useMainLayoutContext";
import useHiLogStore from "@/store/useHiLogStore";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { IoAddCircleOutline, IoClose, IoTrash } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import "./index.css";
import { Record } from "@/store/createRecordSlice";
import EditRecordModal from "@/components/Modal/EditRecordModal";
import { Link } from "react-router-dom";
import ActionDialog from "@/components/Dialog/ActionDialog";

const SheetRecords = () => {
  const { t } = useTranslation();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Record>();
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const { setRightMenu } = useMainLayoutContext();

  const [
    selectedLog,
    selectedSheet,
    getRecords,
    addRecord,
    updateRecord,
    deleteRecords,
  ] = useHiLogStore(
    useShallow((state) => [
      state.selectedLog,
      state.selectedSheet,
      state.getRecords,
      state.addRecord,
      state.updateRecord,
      state.deleteRecords,
    ])
  );

  const { id: logId } = selectedLog || {};
  const { id: sheetId } = selectedSheet || {};

  const sheetRecords =
    selectedLog && selectedSheet
      ? getRecords({
          logId: selectedLog.id,
          sheetId: selectedSheet.id,
        })
      : [];

  const isRecordsEmpty = isEmpty(sheetRecords);
  const isSelectedRecordsEmpty = isEmpty(selectedRecords);

  const handleAddModalClick = () => {
    setAddModalOpen(true);
  };

  const handleAddRecord = (values: FieldValues) => {
    if (selectedLog && selectedSheet) {
      const { name, amount, currency, desc, recordDate, recordTime } = values;

      addRecord({
        logId: selectedLog.id,
        sheetId: selectedSheet.id,
        name,
        amount,
        currency,
        desc,
        recordDate,
        recordTime,
      });
    }
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalOpen = (record: Record) => {
    setEditRecord(record);
  };

  const handleEditModalClose = () => {
    setEditRecord(undefined);
  };

  const handleEditRecord = (values: FieldValues) => {
    if (selectedLog && selectedSheet && editRecord) {
      const { name, amount, currency, desc, recordDate, recordTime } = values;

      updateRecord({
        logId: selectedLog.id,
        sheetId: selectedSheet.id,
        recordId: editRecord.id,
        name,
        amount,
        currency,
        desc,
        recordDate,
        recordTime,
      });
    }
  };

  const handleRecordSelected = (recordId: string) => {
    setSelectedRecords([...selectedRecords, recordId]);
  };

  const handleRecordUnselected = (recordId: string) => {
    setSelectedRecords(selectedRecords.filter((r) => r !== recordId));
  };

  const handleRecordUnselectAll = () => {
    setSelectedRecords([]);
  };

  const handleDeleteSelected = () => {
    if (logId && sheetId) {
      deleteRecords({ recordIds: selectedRecords, logId, sheetId });
      setShowDelete(false);
      setSelectedRecords([]);
    }
  };

  const renderRightMenu = useCallback(() => {
    let menu: JSX.Element[] = [];

    if (!isRecordsEmpty) {
      if (isSelectedRecordsEmpty) {
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
            onClick={() => handleRecordUnselectAll()}
          />,
          <IconButton icon={<IoTrash />} onClick={() => setShowDelete(true)} />,
        ];
      }
    }

    setRightMenu(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecordsEmpty, selectedRecords]);

  useEffect(() => {
    renderRightMenu();
  }, [renderRightMenu]);

  return (
    <div>
      {logId && sheetId ? (
        <>
          {isRecordsEmpty && <EmptyMessage msgKey="records empty" />}

          <PageContent>
            <div className="records-list-container">
              {sheetRecords.map((record) => (
                <RecordCard
                  key={record.id}
                  data={record}
                  onEdit={handleEditModalOpen}
                  selected={selectedRecords.includes(record.id)}
                  onSelected={handleRecordSelected}
                  onUnselected={handleRecordUnselected}
                  hasSelected={!isSelectedRecordsEmpty}
                />
              ))}
            </div>

            {isRecordsEmpty && (
              <Button
                icon={<IoAddCircleOutline />}
                onClick={handleAddModalClick}
                compact={false}
              >
                {t("add record")}
              </Button>
            )}
          </PageContent>

          <AddRecordModal
            open={addModalOpen}
            onClose={handleAddModalClose}
            onSubmit={handleAddRecord}
          />

          <EditRecordModal
            open={!!editRecord}
            onClose={handleEditModalClose}
            onSubmit={handleEditRecord}
            record={editRecord}
          />

          <ActionDialog
            message="confirm delete records"
            open={showDelete}
            onClose={() => setShowDelete(false)}
            onSubmit={() => handleDeleteSelected()}
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

export default SheetRecords;
