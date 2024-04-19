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
import { IoAddCircleOutline, IoClose, IoTrashOutline } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import "./index.css";
import { Record } from "@/store/createRecordSlice";
import EditRecordModal from "@/components/Modal/EditRecordModal";
import { Link } from "react-router-dom";
import ActionDialog from "@/components/Dialog/ActionDialog";
import CurrencySymbolMap from "@/utils/currency";
import { CiFilter } from "react-icons/ci";
import FilterSortDialog, {
  SortedOption,
} from "@/components/Dialog/FilterSortDialog";

const sortFields = [
  { label: "name", value: "name" },
  { label: "amount", value: "amount" },
  { label: "record date", value: "recordDate" },
  { label: "updated date", value: "updatedAt" },
];

const SheetRecords = () => {
  const { t } = useTranslation();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Record>();
  const [checkedRecords, setCheckedRecords] = useState<string[]>([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showTotal, setShowTotal] = useState<boolean>(true);
  const [showSort, setShowSort] = useState<boolean>(false);
  const [sorted, setSorted] = useState<SortedOption | undefined>();
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
  const { id: sheetId, totals } = selectedSheet || {};

  const sheetRecords =
    selectedLog && selectedSheet
      ? getRecords({
          logId: selectedLog.id,
          sheetId: selectedSheet.id,
        })
      : [];

  const getSortedRecords = () => {
    const { value: sortValue, sort } = sorted || {};

    const sortedRecords = [...sheetRecords];

    if (sortValue) {
      sortedRecords.sort((a, b) => {
        const sortValueA = a[sortValue as keyof Record];
        const sortValueB = b[sortValue as keyof Record];

        let c = sortValueA;
        let d = sortValueB;

        if (sort === "desc") {
          c = sortValueB;
          d = sortValueA;
        }

        if (c && d) {
          switch (sortValue) {
            case "name":
              if (c > d) {
                return 1;
              }

              if (c < d) {
                return -1;
              }
              break;
          }
        }

        return 0;
      });
    }

    return sortedRecords;
  };

  const isRecordsEmpty = isEmpty(sheetRecords);
  const isCheckedRecordsEmpty = isEmpty(checkedRecords);

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

  const handleRecordChecked = (recordId: string) => {
    setCheckedRecords([...checkedRecords, recordId]);
  };

  const handleRecordUnchecked = (recordId: string) => {
    setCheckedRecords(checkedRecords.filter((r) => r !== recordId));
  };

  const handleRecordUncheckAll = () => {
    setCheckedRecords([]);
  };

  const handleDeleteChecked = () => {
    if (logId && sheetId) {
      deleteRecords({ recordIds: checkedRecords, logId, sheetId });
      setShowDelete(false);
      setCheckedRecords([]);
    }
  };

  const handleShowTotalsClick = () => {
    setShowTotal(!showTotal);
  };

  const handleShowSortClick = () => {
    setShowSort(true);
  };

  const renderRightMenu = useCallback(() => {
    let menu: JSX.Element[] = [];

    if (!isRecordsEmpty) {
      if (isCheckedRecordsEmpty) {
        menu = [
          <IconButton
            icon={<CiFilter />}
            onClick={() => handleShowSortClick()}
          />,
          <IconButton
            icon={<IoAddCircleOutline />}
            onClick={() => handleAddModalClick()}
          />,
        ];
      } else {
        menu = [
          <IconButton
            icon={<IoClose />}
            onClick={() => handleRecordUncheckAll()}
          />,
          <IconButton
            icon={<IoTrashOutline />}
            onClick={() => setShowDelete(true)}
          />,
        ];
      }
    }

    setRightMenu(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecordsEmpty, checkedRecords]);

  useEffect(() => {
    renderRightMenu();
  }, [renderRightMenu]);

  return (
    <div className="sheet-records-root">
      {logId && sheetId ? (
        <>
          {isRecordsEmpty && <EmptyMessage msgKey="records empty" />}

          <PageContent className="sheet-records-content">
            <div className="records-list-container">
              {getSortedRecords().map((record) => (
                <RecordCard
                  key={record.id}
                  data={record}
                  onEdit={handleEditModalOpen}
                  checked={checkedRecords.includes(record.id)}
                  onChecked={handleRecordChecked}
                  onUnchecked={handleRecordUnchecked}
                  hasChecked={!isCheckedRecordsEmpty}
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

          {!isRecordsEmpty && (
            <div
              className="totals-footer"
              data-collapsed={!showTotal}
              onClick={handleShowTotalsClick}
            >
              <p className="header">
                {t(showTotal ? "tap to hide" : "tap to show")}
              </p>
              <div className="content">
                <div className="content-left">{`${sheetRecords.length} ${t(
                  "records"
                )}`}</div>
                <div className="content-right">
                  {totals &&
                    Object.keys(totals).map((key) => (
                      <p key={key}>{`${CurrencySymbolMap[key]} ${totals[
                        key
                      ].toFixed(2)}`}</p>
                    ))}
                </div>
              </div>
            </div>
          )}

          {addModalOpen && (
            <AddRecordModal
              open={addModalOpen}
              onClose={handleAddModalClose}
              onSubmit={handleAddRecord}
            />
          )}

          {!!editRecord && (
            <EditRecordModal
              open={!!editRecord}
              onClose={handleEditModalClose}
              onSubmit={handleEditRecord}
              record={editRecord}
            />
          )}

          <FilterSortDialog
            open={showSort}
            onClose={() => setShowSort(false)}
            sortFields={sortFields}
            sorted={sorted}
            onSort={(s) => {
              setSorted(s);
            }}
          />

          <ActionDialog
            message="confirm delete records"
            open={showDelete}
            onClose={() => setShowDelete(false)}
            onSubmit={() => handleDeleteChecked()}
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
