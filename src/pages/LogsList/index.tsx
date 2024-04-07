import Button from "@/components/Button";
import LogCard from "@/components/Card/LogCard";
import AddLogModal from "@/components/Modal/AddLogModal";
import PageContent from "@/components/PageContent";
import PageHeader from "@/components/PageHeader";
import Spacer from "@/components/Spacer";
import useHiLogStore from "@/store/useHiLogStore";
import isEmpty from "lodash/isEmpty";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import "./index.css";

const LogsList = () => {
  const { t } = useTranslation();

  const [logs, createLog, resetAll] = useHiLogStore(
    useShallow((state) => [state.logs, state.createLog, state.resetAll])
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

  return (
    <div>
      <PageHeader>{t("logs list")}</PageHeader>
      {isLogsEmpty && (
        <div className="empty-msg">
          <p>{t("logs empty")}</p>
        </div>
      )}

      <PageContent>
        {!isLogsEmpty && (
          <div className="logs-list-container">
            {logs.map((log) => (
              <LogCard key={`log_${log.id}`} log={log} />
            ))}
          </div>
        )}

        <Spacer />

        <Button
          icon={<IoAddCircleOutline />}
          onClick={handleAddModalClick}
          compact={!isLogsEmpty}
        >
          {t("add log")}
        </Button>
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
