import { Sheet } from "@/store/createSheetSlice";
import useHiLogStore from "@/store/useHiLogStore";
import Constants from "@/utils/constant";
import CurrencySymbolMap from "@/utils/currency";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { TbRefresh } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import Card from "..";
import "./index.css";

type SheetCardOptions = {
  data: Sheet;
  onEdit?: (sheet: Sheet) => void;
  selected?: boolean;
  checked?: boolean;
  onChecked?: (sheetId: string) => void;
  onUnchecked?: (sheetId: string) => void;
  hasChecked?: boolean;
  reorder?: boolean;
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onDragStart?: (el: HTMLDivElement) => void;
  onDragEnd?: () => void;
  offsetY?: number;
};

const SheetCard = forwardRef<HTMLDivElement, SheetCardOptions>(
  (
    {
      data,
      onEdit,
      selected = false,
      checked = false,
      onChecked,
      onUnchecked,
      hasChecked,
      reorder = false,
      onPointerMove,
      onDragStart,
      onDragEnd,
      offsetY,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const { name, desc, totals, updatedAt, sheetDate } = data;

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

    return (
      <div className="sheet-card-root">
        <Card
          ref={ref}
          className="sheet-card"
          selected={selected}
          onClick={handleClick}
          onLongPress={() => onChecked?.(data.id)}
          title={name}
          checked={checked}
          editable={!checked && !hasChecked}
          onEdit={() => onEdit?.(data)}
          reorder={reorder}
          onPointerMove={onPointerMove}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          offsetY={offsetY}
        >
          <div className="content">
            <div className="desc">{desc}</div>
          </div>

          <div className="totals">
            <div className="totals-left">{t("totals")}</div>
            <div className="totals-right">
              {!isEmpty(totals) ? (
                Object.keys(totals).map((key) => (
                  <p key={key}>{`${CurrencySymbolMap[key]} ${totals[
                    key
                  ].toFixed(2)}`}</p>
                ))
              ) : (
                <p>-</p>
              )}
            </div>
          </div>

          <div className="sheet-date-time">
            {`${
              sheetDate ? dayjs(sheetDate).format(Constants.date_format) : ""
            }`}
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

export default SheetCard;
