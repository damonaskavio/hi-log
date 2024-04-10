import Button from "@/components/Button";
import RecordCard from "@/components/Card/RecordCard";
import EmptyMessage from "@/components/EmptyMessage";
import IconButton from "@/components/IconButton";
import AddRecordModal from "@/components/Modal/AddRecordModal";
import PageContent from "@/components/PageContent";
import useSheetLayoutContext from "@/hooks/useSheetLayoutContext";
import useHiLogStore from "@/store/useHiLogStore";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import "./index.css";
import { Record } from "@/store/createRecordSlice";
import EditRecordModal from "@/components/Modal/EditRecordModal";

const SheetRecords = () => {
  const { t } = useTranslation();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Record>();
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const { setRightMenu } = useSheetLayoutContext();

  const [
    selectedLog,
    selectedSheet,
    records,
    getRecords,
    addRecord,
    updateRecord,
  ] = useHiLogStore(
    useShallow((state) => [
      state.selectedLog,
      state.selectedSheet,
      state.records,
      state.getRecords,
      state.addRecord,
      state.updateRecord,
    ])
  );

  const sheetRecords =
    selectedLog && selectedSheet
      ? getRecords({
          logId: selectedLog.id,
          sheetId: selectedSheet.id,
        })
      : [];

  const isRecordsEmpty = isEmpty(sheetRecords);

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

  const handleEditRecordOpen = (record: Record) => {
    setEditRecord(record);
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

  const handleEditModalClose = () => {
    setEditRecord(undefined);
  };

  const handleRecordSelected = (recordId: string) => {
    setSelectedRecords([...selectedRecords, recordId]);
  };

  const handleRecordUnselected = (recordId: string) => {
    setSelectedRecords(selectedRecords.filter((r) => r !== recordId));
  };

  useEffect(() => {
    setRightMenu(
      isRecordsEmpty
        ? []
        : [
            <IconButton
              icon={<IoAddCircleOutline />}
              onClick={() => handleAddModalClick()}
            />,
          ]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecordsEmpty, records]);

  return (
    <div>
      {isRecordsEmpty && <EmptyMessage msgKey="records empty" />}

      <PageContent>
        <div className="records-list-container">
          {sheetRecords.map((record) => (
            <RecordCard
              key={record.id}
              data={record}
              onEdit={handleEditRecordOpen}
              selected={selectedRecords.includes(record.id)}
              onSelected={handleRecordSelected}
              onUnselected={handleRecordUnselected}
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
    </div>
  );
};

export default SheetRecords;
