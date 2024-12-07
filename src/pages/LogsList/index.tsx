import Button from "@/components/Button";
import LogCard from "@/components/Card/LogCard";
import EmptyMessage from "@/components/EmptyMessage";
import AddLogModal from "@/components/Modal/AddLogModal";
import PageContent from "@/components/PageContent";
import Spacer from "@/components/Spacer";
import useHiLogStore from "@/store/useHiLogStore";
import isEmpty from "lodash/isEmpty";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  IoAddCircleOutline,
  IoClose,
  IoReorderThree,
  IoTrashOutline,
} from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";

import ActionDialog from "@/components/Dialog/ActionDialog";
import FilterSortDialog, {
  SortedOption,
} from "@/components/Dialog/FilterSortDialog";
import IconButton from "@/components/IconButton";
import EditLogModal from "@/components/Modal/EditLogModal";
import ScrollContext from "@/context/ScrollContext";
import useMainLayoutContext from "@/hooks/useMainLayoutContext";
import { Log } from "@/store/createLogSlice";
import sortByField from "@/utils/sortByField";
import { CiFilter } from "react-icons/ci";
import "./index.css";

const sortFields = [
  { label: "name", value: "name" },
  { label: "updated date", value: "updatedAt" },
];

const LogsList = () => {
  const { t } = useTranslation();
  const currentDragItem = useRef<{
    el: HTMLDivElement;
    index: number;
  } | null>();
  const dragIndex = useRef<number | undefined>();
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [moveIndex, setMoveIndex] = useState<{ [key: number]: number }>({});

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editLog, setEditLog] = useState<Log>();
  const [checkedLogs, setCheckedLogs] = useState<string[]>([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showResetAll, setShowResetAll] = useState<boolean>(false);
  const [showSort, setShowSort] = useState<boolean>(false);
  const [sorted, setSorted] = useState<SortedOption | undefined>();
  const [isReorder, setIsReorder] = useState<boolean>(false);
  const { setRightMenu, setLeftMenu } = useMainLayoutContext();
  const isListScrolling = useContext(ScrollContext);

  const [
    logs,
    selectedLog,
    createLog,
    updateLog,
    deleteLogs,
    resetAll,
    orderLog,
  ] = useHiLogStore(
    useShallow((state) => [
      state.logs,
      state.selectedLog,
      state.createLog,
      state.updateLog,
      state.deleteLogs,
      state.resetAll,
      state.orderLog,
    ])
  );

  const isLogsEmpty = isEmpty(logs);
  const isCheckedLogsEmpty = isEmpty(checkedLogs);

  const getSortedLogs = useCallback(() => {
    cardRefs.current = cardRefs.current.slice(0, logs.length);

    const { value: sortField, sort } = sorted || {};

    if (sortField && sort) {
      return sortByField<Log>(logs, {
        field: sortField as keyof Log,
        sort,
      }) as Log[];
    }

    return logs;
  }, [logs, sorted]);

  const handleAddModalClick = () => {
    setAddModalOpen(true);
  };

  const handleAddLog = (values: FieldValues) => {
    const { name, desc } = values;

    createLog({
      name,
      desc,
    });
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalOpen = (sheet: Log) => {
    setEditLog(sheet);
  };

  const handleEditModalClose = () => {
    setEditLog(undefined);
  };

  const handleEditLog = (values: FieldValues) => {
    if (selectedLog && editLog) {
      const { name, desc } = values;

      updateLog({
        logId: selectedLog.id,
        name,
        desc,
      });
    }
  };

  const handleLogChecked = (logId: string) => {
    if (!isListScrolling) {
      setCheckedLogs([...checkedLogs, logId]);
    }
  };

  const handleLogUnchecked = (logId: string) => {
    setCheckedLogs(checkedLogs.filter((r) => r !== logId));
  };

  const handleLogUncheckAll = () => {
    setCheckedLogs([]);
  };

  const handleDeleteChecked = () => {
    if (!isCheckedLogsEmpty) {
      deleteLogs({ logIds: checkedLogs });
      setShowDelete(false);
      setCheckedLogs([]);
    }
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
        toIndex !== fromIndex
      ) {
        orderLog(fromIndex, toIndex);
      }

      setMoveIndex([]);
      dragIndex.current = undefined;
      currentDragItem.current = null;
    }
  };

  const renderRightMenu = useCallback(() => {
    let menu: JSX.Element[] = [];

    if (!isLogsEmpty) {
      if (isCheckedLogsEmpty) {
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
            onClick={() => handleLogUncheckAll()}
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
  }, [isLogsEmpty, checkedLogs, isReorder]);

  useEffect(() => {
    renderRightMenu();
  }, [renderRightMenu]);

  const renderLeftMenu = useCallback(() => {
    let menu: JSX.Element[] = [];

    if (!isLogsEmpty && logs.length > 1 && (!sorted || sorted.value === "")) {
      if (isCheckedLogsEmpty) {
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
  }, [isLogsEmpty, checkedLogs, isReorder, logs, sorted]);

  useEffect(() => {
    renderLeftMenu();
  }, [renderLeftMenu]);

  return (
    <div>
      {isLogsEmpty && <EmptyMessage msgKey="logs empty" />}

      <PageContent>
        {!isLogsEmpty && (
          <div className="logs-list-container">
            {getSortedLogs().map((log, index) => (
              <LogCard
                ref={(ref) => {
                  if (ref) {
                    cardRefs.current[index] = ref;
                  }
                }}
                key={`log_${log.id}`}
                data={log}
                onEdit={handleEditModalOpen}
                selected={selectedLog?.id === log.id}
                checked={checkedLogs.includes(log.id)}
                onChecked={handleLogChecked}
                onUnchecked={handleLogUnchecked}
                hasChecked={!isCheckedLogsEmpty}
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
        )}

        <Spacer />

        {isLogsEmpty && (
          <Button
            icon={<IoAddCircleOutline />}
            onClick={handleAddModalClick}
            compact={false}
          >
            {t("add log")}
          </Button>
        )}
      </PageContent>

      {/* <button
        style={{ marginTop: 20, marginLeft: 15, padding: 5 }}
        onClick={() => setShowResetAll(true)}
      >
        EXPERIMENTAL: Reset All Data
      </button> */}

      {addModalOpen && (
        <AddLogModal
          open={addModalOpen}
          onClose={() => handleAddModalClose()}
          onSubmit={handleAddLog}
        />
      )}

      {!!editLog && (
        <EditLogModal
          open={!!editLog}
          onClose={() => handleEditModalClose()}
          onSubmit={handleEditLog}
          log={editLog}
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
        message="confirm delete logs"
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onSubmit={() => handleDeleteChecked()}
      />

      <ActionDialog
        message="EXPERIMENTAL: Reset all data?"
        open={showResetAll}
        onClose={() => setShowResetAll(false)}
        onSubmit={() => {
          resetAll();
          setShowResetAll(false);
        }}
      />
    </div>
  );
};

export default LogsList;
