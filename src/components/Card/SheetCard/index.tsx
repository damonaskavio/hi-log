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
import CurrencySymbolMap from "@/utils/currency";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";

type SheetCardOptions = {
  data: Sheet;
  onEdit?: (sheet: Sheet) => void;
  selected?: boolean;
  checked?: boolean;
  onChecked?: (sheetId: string) => void;
  onUnchecked?: (sheetId: string) => void;
  hasChecked?: boolean;
};

const SheetCard = ({
  data,
  onEdit,
  selected = false,
  checked = false,
  onChecked,
  onUnchecked,
  hasChecked,
}: SheetCardOptions) => {
  const { t } = useTranslation();
  const { name, desc, totals, updatedAt } = data;

  const navigate = useNavigate();

  const [selectedLog, setSelectedSheet] = useHiLogStore(
    useShallow((state) => [state.selectedLog, state.setSelectedSheet])
  );

  const handleClick = () => {
    if (checked) {
      onUnchecked?.(data.id);

      return;
    }

    if (hasChecked) {
      onChecked?.(data.id);
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
      selected={selected}
      onClick={onClick}
      onLongPress={() => onChecked?.(data.id)}
      title={name}
      checked={checked}
      editable={!checked && !hasChecked}
      onEdit={() => onEdit?.(data)}
    >
      <div className="content">
        <div className="desc">{desc}</div>
      </div>

      <div className="totals">
        <div className="totals-left">{t("totals")}</div>
        <div className="totals-right">
          {!isEmpty(totals) ? (
            Object.keys(totals).map((key) => (
              <p key={key}>{`${CurrencySymbolMap[key]} ${totals[key].toFixed(
                2
              )}`}</p>
            ))
          ) : (
            <p>-</p>
          )}
        </div>
      </div>

      <div className="date">
        <p>{dayjs(updatedAt).format(Constants.datetime_format)}</p>
        <TbRefresh />
      </div>
    </Card>
  );
};

export default SheetCard;
