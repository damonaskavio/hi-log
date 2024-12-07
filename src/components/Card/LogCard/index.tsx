import { Log } from "@/store/createLogSlice";
import useHiLogStore from "@/store/useHiLogStore";
import Constants from "@/utils/constant";
import dayjs from "dayjs";
import { TbRefresh } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Card from "..";
import "./index.css";
import { forwardRef } from "react";

interface LogCardProps {
  data: Log;
  onEdit: (log: Log) => void;
  selected?: boolean;
  checked?: boolean;
  onChecked: (recordId: string) => void;
  onUnchecked: (recordId: string) => void;
  hasChecked?: boolean;
  reorder?: boolean;
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onDragStart?: (el: HTMLDivElement) => void;
  onDragEnd?: () => void;
  offsetY?: number;
}

const LogCard = forwardRef<HTMLDivElement, LogCardProps>(
  (
    {
      data,
      onEdit,
      selected = false,
      checked = false,
      onChecked,
      onUnchecked,
      hasChecked = false,
      reorder = false,
      onPointerMove,
      onDragStart,
      onDragEnd,
      offsetY,
    },
    ref
  ) => {
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
        ref={ref}
        className="log-card-root"
        onClick={handleClick}
        onLongPress={() => onChecked(data.id)}
        selected={selected}
        title={name}
        checked={checked}
        editable={!checked && !hasChecked}
        onEdit={() => onEdit(data)}
        reorder={reorder}
        onPointerMove={onPointerMove}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        offsetY={offsetY}
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
  }
);

export default LogCard;
