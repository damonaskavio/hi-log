import useLogStore from "@/store/useLogStore";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import { useShallow } from "zustand/react/shallow";
import "./index.css";
import AddLogCard from "@/components/AddLogCard";
import LogCard from "@/components/LogCard";
import PageTitle from "@/components/PageTitle";

const LogsList = () => {
  const [logs, addLog, resetLogs] = useLogStore(
    useShallow((state) => [state.logs, state.addLog, state.resetLogs])
  );

  const handleAddLog = () => {
    addLog({
      id: `${logs.length + 1}`,
      name: `Test Log ${logs.length + 1}`,
      updatedAt: dayjs().toDate(),
    });
  };

  const isLogsEmpty = isEmpty(logs);

  return (
    <div>
      <PageTitle>Logs List</PageTitle>
      {isLogsEmpty && (
        <div className="emptyMsg">
          <p>
            It seems like you don't have any logs. Would you like to make one?
          </p>
        </div>
      )}

      {!isLogsEmpty && (
        <div className="logsListContainer">
          {logs.map((log) => (
            <LogCard key={`log_${log.id}`} log={log} />
          ))}
        </div>
      )}

      <AddLogCard add={handleAddLog} compact={!isLogsEmpty} />
      <button
        style={{ marginTop: 20, marginLeft: 20 }}
        onClick={() => resetLogs()}
      >
        reset
      </button>
    </div>
  );
};

export default LogsList;
