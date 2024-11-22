import SheetCard from "@/components/Card/SheetCard";
import EmptyMessage from "@/components/EmptyMessage";
import IconButton from "@/components/IconButton";
import AddSheetModal from "@/components/Modal/AddSheetModal";
import PageContent from "@/components/PageContent";
import useMainLayoutContext from "@/hooks/useMainLayoutContext";
import useHiLogStore from "@/store/useHiLogStore";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { IoAddCircleOutline, IoClose, IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import "./index.css";
import { Sheet } from "@/store/createSheetSlice";
import ActionDialog from "@/components/Dialog/ActionDialog";
import Button from "@/components/Button";
import EditSheetModal from "@/components/Modal/EditSheetModal";
import { CiFilter } from "react-icons/ci";
import FilterSortDialog, {
  SortedOption,
} from "@/components/Dialog/FilterSortDialog";
import sortByField from "@/utils/sortByField";

const sortFields = [
  { label: "name", value: "name" },
  {
    label: "amount",
    value: "totals",
    fieldFn: (sheet: Sheet) => {
      return Object.values(sheet.totals).reduce((total, num) => total + num, 0);
    },
  },
  { label: "sheet date", value: "sheetDate" },
  { label: "updated date", value: "updatedAt" },
];

const LogSheets = () => {
  const { t } = useTranslation();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editSheet, setEditSheet] = useState<Sheet>();
  const [checkedSheets, setCheckedSheets] = useState<string[]>([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showSort, setShowSort] = useState<boolean>(false);
  const [sorted, setSorted] = useState<SortedOption | undefined>();
  const { setRightMenu } = useMainLayoutContext();

  const [
    sheets,
    selectedSheet,
    selectedLog,
    getLogSheets,
    getLatestLogSheet,
    setSelectedSheet,
    addSheet,
    updateSheet,
    deleteSheets,
  ] = useHiLogStore(
    useShallow((state) => [
      state.sheets,
      state.selectedSheet,
      state.selectedLog,
      state.getLogSheets,
      state.getLatestLogSheet,
      state.setSelectedSheet,
      state.addSheet,
      state.updateSheet,
      state.deleteSheets,
    ])
  );

  const { id: logId } = selectedLog || {};

  const logSheets = selectedLog ? getLogSheets(logId || "") : [];

  const getSortedSheets = () => {
    const { value: sortField, sort } = sorted || {};

    if (sortField && sort) {
      return sortByField<Sheet>(logSheets, {
        field: sortField as keyof Sheet,
        sort,
        fieldFn: sortFields.find((sf) => sf.value === sortField)?.fieldFn,
      }) as Sheet[];
    }

    return logSheets;
  };

  const isSheetsEmpty = isEmpty(logSheets);
  const isCheckedSheetsEmpty = isEmpty(checkedSheets);

  const handleAddModalClick = () => {
    setAddModalOpen(true);
  };

  const handleAddSheet = (values: FieldValues) => {
    const { name, desc, sheetDate } = values;

    if (logId) {
      addSheet({
        logId,
        name,
        desc,
        sheetDate,
      });
    }
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalOpen = (sheet: Sheet) => {
    setEditSheet(sheet);
  };

  const handleEditModalClose = () => {
    setEditSheet(undefined);
  };

  const handleEditSheet = (values: FieldValues) => {
    if (selectedLog && editSheet) {
      const { name, desc, sheetDate } = values;

      updateSheet({
        logId: selectedLog.id,
        sheetId: editSheet.id,
        name,
        desc,
        sheetDate,
      });
    }
  };

  const handleSheetChecked = (sheetId: string) => {
    setCheckedSheets([...checkedSheets, sheetId]);
  };

  const handleSheetUnchecked = (sheetId: string) => {
    setCheckedSheets(checkedSheets.filter((r) => r !== sheetId));
  };

  const handleSheetUncheckAll = () => {
    setCheckedSheets([]);
  };

  const handleDeleteChecked = () => {
    if (logId) {
      deleteSheets({ sheetIds: checkedSheets, logId });
      setShowDelete(false);
      setCheckedSheets([]);
    }
  };

  const handleShowSortClick = () => {
    setShowSort(true);
  };

  useEffect(() => {
    if (logId) {
      if (!selectedSheet) {
        const sheet = getLatestLogSheet(logId);
        setSelectedSheet(sheet);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheets]);

  const renderRightMenu = useCallback(() => {
    let menu: JSX.Element[] = [];

    if (!isSheetsEmpty) {
      if (isCheckedSheetsEmpty) {
        menu = [
          <IconButton
            icon={<CiFilter />}
            onClick={() => handleShowSortClick()}
          />,
          <IconButton
            icon={<IoAddCircleOutline />}
            onClick={() => handleAddModalClick()}
          />,
        ];
      } else {
        menu = [
          <IconButton
            icon={<IoClose />}
            onClick={() => handleSheetUncheckAll()}
          />,
          <IconButton
            icon={<IoTrashOutline />}
            onClick={() => setShowDelete(true)}
          />,
        ];
      }
    }

    setRightMenu(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSheetsEmpty, checkedSheets]);

  useEffect(() => {
    renderRightMenu();
  }, [renderRightMenu]);

  return (
    <div>
      {logId ? (
        <>
          {isSheetsEmpty && <EmptyMessage msgKey="sheets empty" />}

          <PageContent>
            <div className="sheets-list-container">
              {logId &&
                getSortedSheets()?.map((sheet) => (
                  <SheetCard
                    key={sheet.id}
                    data={sheet}
                    onEdit={handleEditModalOpen}
                    selected={selectedSheet?.id === sheet.id}
                    checked={checkedSheets.includes(sheet.id)}
                    onChecked={handleSheetChecked}
                    onUnchecked={handleSheetUnchecked}
                    hasChecked={!isCheckedSheetsEmpty}
                  />
                ))}
            </div>

            {isSheetsEmpty && (
              <Button
                icon={<IoAddCircleOutline />}
                onClick={handleAddModalClick}
                compact={false}
              >
                {t("add sheet")}
              </Button>
            )}
          </PageContent>

          {addModalOpen && (
            <AddSheetModal
              open={addModalOpen}
              onClose={() => handleAddModalClose()}
              onSubmit={handleAddSheet}
            />
          )}

          {!!editSheet && (
            <EditSheetModal
              open={!!editSheet}
              onClose={() => handleEditModalClose()}
              onSubmit={handleEditSheet}
              sheet={editSheet}
            />
          )}

          <FilterSortDialog
            open={showSort}
            onClose={() => setShowSort(false)}
            sortFields={sortFields}
            sorted={sorted}
            onSort={(s) => {
              setSorted(s);
            }}
          />

          <ActionDialog
            message="confirm delete sheets"
            open={showDelete}
            onClose={() => setShowDelete(false)}
            onSubmit={() => handleDeleteChecked()}
          />
        </>
      ) : (
        <EmptyMessage
          component={
            <Trans
              i18nKey={t("no log selected")}
              t={t}
              components={[<Link to={"/logs"}>Logs</Link>]}
            />
          }
        />
      )}
    </div>
  );
};

export default LogSheets;
