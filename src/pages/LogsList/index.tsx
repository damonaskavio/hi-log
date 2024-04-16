import Button from "@/components/Button";
import LogCard from "@/components/Card/LogCard";
import EmptyMessage from "@/components/EmptyMessage";
import AddLogModal from "@/components/Modal/AddLogModal";
import PageContent from "@/components/PageContent";
import Spacer from "@/components/Spacer";
import useHiLogStore from "@/store/useHiLogStore";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";

import "./index.css";
import useMainLayoutContext from "@/hooks/useMainLayoutContext";
import IconButton from "@/components/IconButton";

const LogsList = () => {
  const { t } = useTranslation();

  const { setRightMenu } = useMainLayoutContext();

  const [logs, selectedLog, createLog, resetAll] = useHiLogStore(
    useShallow((state) => [
      state.logs,
      state.selectedLog,
      state.createLog,
      state.resetAll,
    ])
  );

  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddModalClick = () => {
    setAddModalOpen(true);
  };

  const handleAddLog = (values: FieldValues) => {
    const { name } = values;

    createLog({
      name,
    });
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const isLogsEmpty = isEmpty(logs);

  useEffect(() => {
    setRightMenu(
      isLogsEmpty
        ? []
        : [
            <IconButton
              icon={<IoAddCircleOutline />}
              onClick={() => handleAddModalClick()}
            />,
          ]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogsEmpty, logs]);

  return (
    <div>
      {isLogsEmpty && <EmptyMessage msgKey="logs empty" />}

      <PageContent>
        {!isLogsEmpty && (
          <div className="logs-list-container">
            {logs.map((log) => (
              <LogCard
                key={`log_${log.id}`}
                log={log}
                selected={selectedLog?.id === log.id}
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
        style={{ marginTop: 20, marginLeft: 20 }}
        onClick={() => resetAll()}
      >
        reset
      </button>

      <AddLogModal
        open={addModalOpen}
        onClose={() => handleAddModalClose()}
        onSubmit={handleAddLog}
      />
    </div>
  );
};

export default LogsList;
