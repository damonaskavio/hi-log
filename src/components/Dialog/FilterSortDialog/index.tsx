import { useTranslation } from "react-i18next";
import { DialogOptions } from "..";
import ActionDialog from "../ActionDialog";
import "./index.css";
import { useEffect, useState } from "react";
import {
  MdOutlineRadioButtonUnchecked,
  MdOutlineRadioButtonChecked,
} from "react-icons/md";
import Spacer from "@/components/Spacer";

type SortField = { label: string; value: string };

export type SortedOption = { value: string; sort: "asc" | "desc" };

type FilterSortDialog = DialogOptions & {
  sortFields: SortField[];
  onSort: (arg: SortedOption) => void;
  sorted?: SortedOption | undefined;
};

const RadioField = ({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) => {
  return (
    <div className="radio-field-root" data-checked={checked} onClick={onClick}>
      <div className="radio">
        {checked ? (
          <MdOutlineRadioButtonChecked />
        ) : (
          <MdOutlineRadioButtonUnchecked />
        )}
      </div>
      <p>{label}</p>
    </div>
  );
};

const FilterSortDialog = ({
  sortFields,
  sorted,
  onSort,
  open,
  ...actionDialogOptions
}: FilterSortDialog) => {
  const { t } = useTranslation();
  const [checkedField, setCheckedField] = useState<string>("");
  const [checkedSort, setCheckedSort] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (sorted) {
      const { value, sort } = sorted || {};

      setCheckedField(value);
      setCheckedSort(sort);
    } else {
      setCheckedField("");
      setCheckedSort("asc");
    }
  }, [sorted, open]);

  const handleSubmit = () => {
    onSort({ value: checkedField, sort: checkedSort });
    actionDialogOptions.onClose?.();
  };

  return (
    <ActionDialog
      className="filter-sort-dialog-root"
      message={t("sort by")}
      open={open}
      onSubmit={handleSubmit}
      {...actionDialogOptions}
    >
      <div className="filter-sort-dialog-content">
        {[{ label: "none", value: "" }, ...sortFields].map(
          ({ label, value }) => (
            <RadioField
              key={value}
              label={t(label)}
              checked={checkedField === value}
              onClick={() => setCheckedField(value)}
            />
          )
        )}
        <Spacer type="lg" />

        <RadioField
          label={t("ascending")}
          checked={checkedSort === "asc"}
          onClick={() => setCheckedSort("asc")}
        />

        <RadioField
          label={t("descending")}
          checked={checkedSort === "desc"}
          onClick={() => setCheckedSort("desc")}
        />
      </div>
    </ActionDialog>
  );
};

export default FilterSortDialog;
