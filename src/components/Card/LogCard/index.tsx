import { Log } from "@/store/createLogSlice";
import { useNavigate } from "react-router-dom";
import Card from "..";
import "./index.css";
import { TbRefresh } from "react-icons/tb";
import dayjs from "dayjs";
import Constants from "@/utils/constant";
import useHiLogStore from "@/store/useHiLogStore";

const LogCard = ({
  log,
  selected = false,
}: {
  log: Log;
  selected?: boolean;
}) => {
  const { name, updatedAt } = log;

  const [setSelectedLog, setSelectedSheet] = useHiLogStore((state) => [
    state.setSelectedLog,
    state.setSelectedSheet,
  ]);

  const navigate = useNavigate();

  const onClick = () => {
    setSelectedLog(log);
    setSelectedSheet();

    navigate("/sheets");
  };

  return (
    <Card className="log-card-root" onClick={onClick} selected={selected}>
      <div className="content">
        <p className="name">{name}</p>
      </div>
      <div className="date">
        <p>{dayjs(updatedAt).format(Constants.datetime_format)}</p>
        <TbRefresh />
      </div>
    </Card>
  );
};

export default LogCard;
