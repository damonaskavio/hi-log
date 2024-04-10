import { Sheet } from "@/store/createSheetSlice";
import useHiLogStore from "@/store/useHiLogStore";
import { TbRefresh } from "react-icons/tb";
import { useShallow } from "zustand/react/shallow";
import Card from "..";
import "./index.css";
import { useNavigate } from "react-router-dom";
import useClickEvent from "@/hooks/useClickEvent";
import dayjs from "dayjs";
import Constants from "@/utils/constant";

type SheetCardOptions = {
  data: Sheet;
};

const SheetCard = ({ data }: SheetCardOptions) => {
  const { name, desc, updatedAt, id } = data;

  const navigate = useNavigate();

  const [selectedLog, selectedSheet, setSelectedSheet] = useHiLogStore(
    useShallow((state) => [
      state.selectedLog,
      state.selectedSheet,
      state.setSelectedSheet,
    ])
  );

  const handleClick = () => {
    if (selectedLog) {
      setSelectedSheet(data);
      navigate(`/log/${selectedLog.id}/sheet/${id}`);
    }
  };

  const [, { onClick }] = useClickEvent({ onClick: handleClick });

  return (
    <Card
      className="sheet-card-root"
      selected={!!selectedSheet && selectedSheet.id === id}
      onClick={onClick}
    >
      <div className="content">
        <div>{name}</div>
        <div className="desc">{desc}</div>
      </div>

      <div className="date">
        <p>{dayjs(updatedAt).format(Constants.datetime_format)}</p>
        <TbRefresh />
      </div>
    </Card>
  );
};

export default SheetCard;
