import { Record } from "@/store/createRecordSlice";
import Constants from "@/utils/constant";
import CurrencySymbolMap from "@/utils/currency";
import timeConvert from "@/utils/timeConvert";
import dayjs from "dayjs";
import { forwardRef, useState } from "react";
import { TbRefresh } from "react-icons/tb";
import Card from "..";
import "./index.css";

type RecordCardOptions = {
  data: Record;
  onEdit: (record: Record) => void;
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
};

const RecordCard = forwardRef<HTMLDivElement, RecordCardOptions>(
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
    const [loose, setLoose] = useState(false);

    const { name, desc, currency, amount, updatedAt, recordDate, recordTime } =
      data;

    const handleClick = () => {
      if (checked) {
        onUnchecked(data.id);

        return;
      }

      if (hasChecked) {
        onChecked(data.id);
        return;
      }

      setLoose(!loose);
    };

    return (
      <div className="record-card-root" data-loose={loose}>
        <Card
          ref={ref}
          className="record-card"
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
            <div className="desc">{desc}</div>
          </div>

          <div className="footer">
            <div className="record-date-time">
              {`${
                recordDate
                  ? dayjs(recordDate).format(Constants.date_format)
                  : ""
              }${recordTime ? ` ${timeConvert(recordTime)}` : ""}`}
            </div>

            <div className="currency-container">
              <div>{CurrencySymbolMap[currency]}</div>
              <div>{amount.toFixed(2)}</div>
            </div>
          </div>
        </Card>

        <div className="date">
          <p>{dayjs(updatedAt).format(Constants.datetime_format)}</p>
          <TbRefresh />
        </div>
      </div>
    );
  }
);

export default RecordCard;
