import Button from "@/components/Button";
import RecordCard from "@/components/Card/RecordCard";
import EmptyMessage from "@/components/EmptyMessage";
import IconButton from "@/components/IconButton";
import AddRecordModal from "@/components/Modal/AddRecordModal";
import PageContent from "@/components/PageContent";
import useMainLayoutContext from "@/hooks/useMainLayoutContext";
import useHiLogStore from "@/store/useHiLogStore";
import isEmpty from "lodash/isEmpty";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import {
  IoAddCircleOutline,
  IoClose,
  IoReorderThree,
  IoTrashOutline,
} from "react-icons/io5";
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
import sortByField from "@/utils/sortByField";
import ScrollContext from "@/context/ScrollContext";

const sortFields = [
  { label: "name", value: "name" },
  { label: "amount", value: "amount" },
  { label: "record date", value: "recordDate" },
  { label: "updated date", value: "updatedAt" },
];

const SheetRecords = () => {
  const { t } = useTranslation();
  const currentDragItem = useRef<{
    el: HTMLDivElement;
    index: number;
  } | null>();
  const dragIndex = useRef<number | undefined>();
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [moveIndex, setMoveIndex] = useState<{ [key: number]: number }>({});

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Record>();
  const [checkedRecords, setCheckedRecords] = useState<string[]>([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showTotal, setShowTotal] = useState<boolean>(true);
  const [showSort, setShowSort] = useState<boolean>(false);
  const [sorted, setSorted] = useState<SortedOption | undefined>();
  const [isReorder, setIsReorder] = useState<boolean>(false);
  const { setRightMenu, setLeftMenu } = useMainLayoutContext();
  const isListScrolling = useContext(ScrollContext);

  const [
    selectedLog,
    selectedSheet,
    getRecords,
    addRecord,
    updateRecord,
    deleteRecords,
    orderRecord,
  ] = useHiLogStore(
    useShallow((state) => [
      state.selectedLog,
      state.selectedSheet,
      state.getRecords,
      state.addRecord,
      state.updateRecord,
      state.deleteRecords,
      state.orderRecord,
    ])
  );

  const { id: logId } = selectedLog || {};
  const { id: sheetId, totals } = selectedSheet || {};

  const sheetRecords = getRecords({
    logId: selectedLog?.id,
    sheetId: selectedSheet?.id,
  });

  const getSortedRecords = useCallback(() => {
    cardRefs.current = cardRefs.current.slice(0, sheetRecords.length);
    const { value: sortField, sort } = sorted || {};

    if (sortField && sort) {
      return sortByField<Record>(sheetRecords, {
        field: sortField as keyof Record,
        sort,
      }) as Record[];
    }

    return sheetRecords;
  }, [sheetRecords, sorted]);

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
    if (!isListScrolling) {
      setCheckedRecords([...checkedRecords, recordId]);
    }
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

  const handleItemPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const draggedItem = currentDragItem.current;
    const index = dragIndex.current;

    if (draggedItem && index !== undefined) {
      const draggedIndex = draggedItem.index;

      const cards = cardRefs.current;

      let prevItem: HTMLDivElement | undefined;
      let nextItem: HTMLDivElement | undefined;

      let movedDown: boolean | undefined;

      if (index > draggedIndex) {
        movedDown = true;
      }

      if (index < draggedIndex) {
        movedDown = false;
      }

      let prevIndex = index - 1;
      let nextIndex = index + 1;

      if (movedDown === true) {
        prevIndex += 1;
      }

      if (movedDown === false) {
        nextIndex -= 1;
      }

      if (
        prevIndex >= 0 &&
        prevIndex < cards.length &&
        prevIndex !== draggedIndex
      ) {
        prevItem = cards[prevIndex];
      }

      if (nextIndex < cards.length && nextIndex !== draggedIndex) {
        nextItem = cards[nextIndex];
      }

      if (prevItem) {
        const { y: prevY, height: prevHeight } =
          prevItem.getBoundingClientRect();

        if (e.clientY < prevY + prevHeight / 2) {
          setMoveIndex((indices) => {
            const newIndices = { ...indices };

            if (newIndices[prevIndex]) {
              delete newIndices[prevIndex];
            } else {
              newIndices[prevIndex] = 1;
            }

            return newIndices;
          });

          dragIndex.current = index - 1;
        }
      }

      if (nextItem) {
        const { y: nextY, height: nextHeight } =
          nextItem.getBoundingClientRect();

        if (e.clientY > nextY + nextHeight / 2) {
          setMoveIndex((indices) => {
            const newIndices = { ...indices };

            if (newIndices[nextIndex]) {
              delete newIndices[nextIndex];
            } else {
              newIndices[nextIndex] = -1;
            }

            return newIndices;
          });

          dragIndex.current = index + 1;
        }
      }
    }
  };

  const handleDragStart = (el: HTMLDivElement, index: number) => {
    currentDragItem.current = { el, index };
    dragIndex.current = index;
  };

  const handleDragEnd = () => {
    const draggedItem = currentDragItem.current;

    if (draggedItem) {
      const toIndex = dragIndex.current;
      const fromIndex = draggedItem.index;

      if (
        toIndex !== undefined &&
        fromIndex !== undefined &&
        toIndex !== fromIndex &&
        logId &&
        sheetId
      ) {
        orderRecord({ logId, sheetId, fromIndex, toIndex });
      }

      setMoveIndex([]);
      dragIndex.current = undefined;
      currentDragItem.current = null;
    }
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

      if (isReorder) {
        menu.splice(0, 1);
      }
    }

    setRightMenu(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecordsEmpty, checkedRecords, isReorder]);

  useEffect(() => {
    renderRightMenu();
  }, [renderRightMenu]);

  const renderLeftMenu = useCallback(() => {
    let menu: JSX.Element[] = [];

    if (
      !isRecordsEmpty &&
      sheetRecords.length > 1 &&
      (!sorted || sorted.value === "")
    ) {
      if (isCheckedRecordsEmpty) {
        menu = [
          <IconButton
            icon={isReorder ? <IoClose /> : <IoReorderThree />}
            onClick={() => {
              setIsReorder(!isReorder);
            }}
          />,
        ];
      }
    }

    setLeftMenu(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecordsEmpty, checkedRecords, isReorder, sheetRecords, sorted]);

  useEffect(() => {
    renderLeftMenu();
  }, [renderLeftMenu]);

  return (
    <div className="sheet-records-root">
      {logId && sheetId ? (
        <>
          {isRecordsEmpty && <EmptyMessage msgKey="records empty" />}

          <PageContent className="sheet-records-content">
            <div className="records-list-container">
              {getSortedRecords().map((record, index) => (
                <RecordCard
                  ref={(ref) => {
                    if (ref) {
                      cardRefs.current[index] = ref;
                    }
                  }}
                  key={record.id}
                  data={record}
                  onEdit={handleEditModalOpen}
                  checked={checkedRecords.includes(record.id)}
                  onChecked={handleRecordChecked}
                  onUnchecked={handleRecordUnchecked}
                  hasChecked={!isCheckedRecordsEmpty}
                  reorder={isReorder}
                  onDragStart={(el) => {
                    handleDragStart(el, index);
                  }}
                  onDragEnd={handleDragEnd}
                  onPointerMove={handleItemPointerMove}
                  offsetY={moveIndex[index]}
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
