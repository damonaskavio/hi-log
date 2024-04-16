import useClickEvent from "@/hooks/useClickEvent";
import { Sheet } from "@/store/createSheetSlice";
import useHiLogStore from "@/store/useHiLogStore";
import Constants from "@/utils/constant";
import dayjs from "dayjs";
import { TbRefresh } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import Card from "..";
import "./index.css";

type SheetCardOptions = {
  data: Sheet;
  onEdit?: (sheet: Sheet) => void;
  selected?: boolean;
  onSelected?: (sheetId: string) => void;
  onUnselected?: (sheetId: string) => void;
  hasSelected?: boolean;
};

const SheetCard = ({
  data,
  onEdit,
  selected,
  onSelected,
  onUnselected,
  hasSelected,
}: SheetCardOptions) => {
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
    if (selected) {
      onUnselected?.(data.id);

      return;
    }

    if (hasSelected) {
      onSelected?.(data.id);
      return;
    }

    if (selectedLog) {
      setSelectedSheet(data);

      navigate("/sheet");
    }
  };

  const [, { onClick }] = useClickEvent({ onClick: handleClick });

  return (
    <Card
      className="sheet-card-root"
      selected={!!selectedSheet && selectedSheet.id === id}
      onClick={onClick}
      onLongPress={() => onSelected?.(data.id)}
      title={name}
      checked={selected}
      editable={!selected && !hasSelected}
      onEdit={() => onEdit?.(data)}
    >
      <div className="content">
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
