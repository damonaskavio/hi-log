import Button from "@/components/Button";
import LogCard from "@/components/LogCard";
import PageHeader from "@/components/PageHeader";
import useLogStore from "@/store/useLogStore";
import isEmpty from "lodash/isEmpty";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import "./index.css";
import AddLogModal from "@/components/Modal/AddLogModal";
import { IoAddCircleOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { FieldValues } from "react-hook-form";
import PageContent from "@/components/PageContent";
import Spacer from "@/components/Spacer";

const LogsList = () => {
  const { t } = useTranslation();

  const [logs, addLog, resetLogs] = useLogStore(
    useShallow((state) => [state.logs, state.addLog, state.resetLogs])
  );

  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddLogClick = () => {
    setAddModalOpen(true);
  };

  const handleAddLog = (values: FieldValues) => {
    console.log("add log", values);
    const { name } = values;

    addLog({
      id: `${logs.length + 1}`,
      name,
      updatedAt: dayjs().toDate(),
    });
  };

  const handleAddLogClose = () => {
    setAddModalOpen(false);
  };

  const isLogsEmpty = isEmpty(logs);

  return (
    <div>
      <PageHeader>{t("logs list")}</PageHeader>
      {isLogsEmpty && (
        <div className="emptyMsg">
          <p>{t("logs empty")}</p>
        </div>
      )}

      <PageContent>
        {!isLogsEmpty && (
          <div className="logsListContainer">
            {logs.map((log) => (
              <LogCard key={`log_${log.id}`} log={log} />
            ))}
          </div>
        )}

        <Spacer />

        <Button
          icon={<IoAddCircleOutline />}
          onClick={handleAddLogClick}
          compact={!isLogsEmpty}
        >
          {t("add log")}
        </Button>
      </PageContent>

      <button
        style={{ marginTop: 20, marginLeft: 20 }}
        onClick={() => resetLogs()}
      >
        reset
      </button>

      <AddLogModal
        open={addModalOpen}
        onClose={() => handleAddLogClose()}
        onSubmit={handleAddLog}
      />
    </div>
  );
};

export default LogsList;
