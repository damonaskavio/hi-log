import IconButton from "@/components/IconButton";
import { Record } from "@/store/createRecordSlice";
import Constants from "@/utils/constant";
import CurrencySymbolMap from "@/utils/currency";
import timeConvert from "@/utils/timeConvert";
import dayjs from "dayjs";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { TbRefresh } from "react-icons/tb";
import Card from "..";
import "./index.css";

type RecordCardOptions = {
  data: Record;
  onEdit: (record: Record) => void;
  selected?: boolean;
  onSelected: (recordId: string) => void;
  onUnselected: (recordId: string) => void;
};

const RecordCard = ({
  data,
  onEdit,
  selected = false,
  onSelected,
  onUnselected,
}: RecordCardOptions) => {
  const [loose, setLoose] = useState(false);

  const { name, desc, currency, amount, updatedAt, recordDate, recordTime } =
    data;

  const onClick = () => {
    if (selected) {
      onUnselected(data.id);

      return;
    }

    setLoose(!loose);
  };

  return (
    <div className="record-card-root" data-loose={loose}>
      <Card
        className="record-card"
        onClick={onClick}
        onLongPress={() => onSelected(data.id)}
        selected={selected}
      >
        <div className="content">
          <div className="header">
            <div className="name">{name}</div>
            <IconButton
              icon={<MdEdit />}
              size={20}
              onClick={() => {
                onEdit(data);
              }}
              stopPropagation={true}
            />
          </div>

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
