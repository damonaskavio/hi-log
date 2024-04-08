import { Log } from "@/store/createLogSlice";
import { useNavigate } from "react-router-dom";
import Card from "..";
import "./index.css";
import { TbRefresh } from "react-icons/tb";
import dayjs from "dayjs";
import Constants from "@/utils/constant";

const LogCard = ({ log }: { log: Log }) => {
  const { name, updatedAt } = log;

  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/log/${log.id}/sheets`);
  };

  return (
    <Card className="log-card-root" onClick={onClick}>
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