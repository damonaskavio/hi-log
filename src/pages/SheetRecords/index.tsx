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
  const { setRightMenu } = useSheetLayoutContext();

  const [selectedLog, selectedSheet, records, getRecords, addRecord] =
    useHiLogStore(
      useShallow((state) => [
        state.selectedLog,
        state.selectedSheet,
        state.records,
        state.getRecords,
        state.addRecord,
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
    const { name, amount, currency, desc, recordDate, recordTime } = values;

    if (selectedLog && selectedSheet) {
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

  const handleEditRecord = () => {};

  const handleEditModalClose = () => {
    setEditRecord(undefined);
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
