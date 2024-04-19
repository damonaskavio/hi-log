import Button from "@/components/Button";
import LogCard from "@/components/Card/LogCard";
import EmptyMessage from "@/components/EmptyMessage";
import AddLogModal from "@/components/Modal/AddLogModal";
import PageContent from "@/components/PageContent";
import Spacer from "@/components/Spacer";
import useHiLogStore from "@/store/useHiLogStore";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline, IoClose, IoTrashOutline } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";

import "./index.css";
import useMainLayoutContext from "@/hooks/useMainLayoutContext";
import IconButton from "@/components/IconButton";
import { Log } from "@/store/createLogSlice";
import ActionDialog from "@/components/Dialog/ActionDialog";
import EditLogModal from "@/components/Modal/EditLogModal";

const LogsList = () => {
  const { t } = useTranslation();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editLog, setEditLog] = useState<Log>();
  const [checkedLogs, setCheckedLogs] = useState<string[]>([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showResetAll, setShowResetAll] = useState<boolean>(false);
  const { setRightMenu } = useMainLayoutContext();

  const [logs, selectedLog, createLog, updateLog, deleteLogs, resetAll] =
    useHiLogStore(
      useShallow((state) => [
        state.logs,
        state.selectedLog,
        state.createLog,
        state.updateLog,
        state.deleteLogs,
        state.resetAll,
      ])
    );

  const isLogsEmpty = isEmpty(logs);
  const isCheckedLogsEmpty = isEmpty(checkedLogs);

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
    setCheckedLogs([...checkedLogs, logId]);
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

  const renderRightMenu = useCallback(() => {
    let menu: JSX.Element[] = [];

    if (!isLogsEmpty) {
      if (isCheckedLogsEmpty) {
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
            onClick={() => handleLogUncheckAll()}
          />,
          <IconButton icon={<IoTrashOutline />} onClick={() => setShowDelete(true)} />,
        ];
      }
    }

    setRightMenu(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogsEmpty, checkedLogs]);

  useEffect(() => {
    renderRightMenu();
  }, [renderRightMenu]);

  return (
    <div>
      {isLogsEmpty && <EmptyMessage msgKey="logs empty" />}

      <PageContent>
        {!isLogsEmpty && (
          <div className="logs-list-container">
            {logs.map((log) => (
              <LogCard
                key={`log_${log.id}`}
                data={log}
                onEdit={handleEditModalOpen}
                selected={selectedLog?.id === log.id}
                checked={checkedLogs.includes(log.id)}
                onChecked={handleLogChecked}
                onUnchecked={handleLogUnchecked}
                hasChecked={!isCheckedLogsEmpty}
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

      <button
        style={{ marginTop: 20, marginLeft: 15, padding: 5 }}
        onClick={() => setShowResetAll(true)}
      >
        EXPERIMENTAL: Reset All Data
      </button>

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
        }}
      />
    </div>
  );
};

export default LogsList;
