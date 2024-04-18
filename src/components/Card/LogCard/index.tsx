import { Log } from "@/store/createLogSlice";
import { useNavigate } from "react-router-dom";
import Card from "..";
import "./index.css";
import { TbRefresh } from "react-icons/tb";
import dayjs from "dayjs";
import Constants from "@/utils/constant";
import useHiLogStore from "@/store/useHiLogStore";

const LogCard = ({
  data,
  onEdit,
  selected = false,
  checked = false,
  onChecked,
  onUnchecked,
  hasChecked = false,
}: {
  data: Log;
  onEdit: (log: Log) => void;
  selected?: boolean;
  checked?: boolean;
  onChecked: (recordId: string) => void;
  onUnchecked: (recordId: string) => void;
  hasChecked?: boolean;
}) => {
  const { name, updatedAt, desc } = data;

  const [setSelectedLog, setSelectedSheet] = useHiLogStore((state) => [
    state.setSelectedLog,
    state.setSelectedSheet,
  ]);

  const navigate = useNavigate();

  const handleClick = () => {
    if (checked) {
      onUnchecked(data.id);

      return;
    }

    if (hasChecked) {
      onChecked(data.id);
      return;
    }

    setSelectedLog(data);
    setSelectedSheet();

    navigate("/sheets");
  };

  return (
    <Card
      className="log-card-root"
      onClick={handleClick}
      onLongPress={() => onChecked(data.id)}
      selected={selected}
      title={name}
      checked={checked}
      editable={!checked && !hasChecked}
      onEdit={() => onEdit(data)}
    >
      <div className="content">
        <p>{desc}</p>
      </div>
      <div className="date">
        <p>{dayjs(updatedAt).format(Constants.datetime_format)}</p>
        <TbRefresh />
      </div>
    </Card>
  );
};

export default LogCard;
