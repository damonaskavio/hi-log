import { Record } from "@/store/createRecordSlice";
import Constants from "@/utils/constant";
import CurrencySymbolMap from "@/utils/currency";
import timeConvert from "@/utils/timeConvert";
import dayjs from "dayjs";
import { useState } from "react";
import { TbRefresh } from "react-icons/tb";
import Card from "..";
import "./index.css";

type RecordCardOptions = {
  data: Record;
  onEdit: (record: Record) => void;
  selected?: boolean;
  onSelected: (recordId: string) => void;
  onUnselected: (recordId: string) => void;
  hasSelected?: boolean;
};

const RecordCard = ({
  data,
  onEdit,
  selected = false,
  onSelected,
  onUnselected,
  hasSelected = false,
}: RecordCardOptions) => {
  const [loose, setLoose] = useState(false);

  const { name, desc, currency, amount, updatedAt, recordDate, recordTime } =
    data;

  const handleClick = () => {
    if (selected) {
      onUnselected(data.id);

      return;
    }

    if (hasSelected) {
      onSelected(data.id);
      return;
    }

    setLoose(!loose);
  };

  return (
    <div className="record-card-root" data-loose={loose}>
      <Card
        className="record-card"
        onClick={handleClick}
        onLongPress={() => onSelected(data.id)}
        selected={selected}
        title={name}
        checked={selected}
        editable={!selected && !hasSelected}
        onEdit={() => onEdit(data)}
      >
        <div className="content">
          <div className="desc">{desc}</div>
        </div>

        <div className="footer">
          <div className="record-date-time">
            {`${
              recordDate ? dayjs(recordDate).format(Constants.date_format) : ""
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
};

export default RecordCard;
