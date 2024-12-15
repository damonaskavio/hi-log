import { Log } from "@/store/createLogSlice";
import useHiLogStore from "@/store/useHiLogStore";
import Constants from "@/utils/constant";
import dayjs from "dayjs";
import { TbRefresh } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Card from "..";
import "./index.css";
import { forwardRef, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import CurrencySymbolMap from "@/utils/currency";
import { useTranslation } from "react-i18next";

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
    const {t} = useTranslation();
    const { id, name, updatedAt, desc } = data;

    const [setSelectedLog, setSelectedSheet, getLogSheets] = useHiLogStore(
      (state) => [
        state.setSelectedLog,
        state.setSelectedSheet,
        state.getLogSheets,
      ]
    );

    const [totals, setTotals] = useState<{ [key: string]: number }>();

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

    useEffect(() => {
      const logSheets = getLogSheets(id);

      const _totals: { [key: string]: number } = {};

      for (const logSheet of logSheets) {
        for (const [key, value] of Object.entries(logSheet.totals)) {
          _totals[key] = (_totals[key] || 0) + value;
        }
      }

      setTotals(_totals);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="log-card-root">
        <Card
          ref={ref}
          className="log-card"
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

          <div className="totals">
            <div className="totals-left">{t("totals")}</div>
            <div className="totals-right">
              {!isEmpty(totals) ? (
                Object.keys(totals).map((key) => {
                  const total = totals[key];

                  if (total === 0) {
                    return;
                  }

                  return (
                    <p key={key}>{`${CurrencySymbolMap[key]} ${total.toFixed(
                      2
                    )}`}</p>
                  );
                })
              ) : (
                <p>-</p>
              )}
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

export default LogCard;
