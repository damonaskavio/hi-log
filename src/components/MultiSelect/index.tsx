import { InputHTMLAttributes, useState } from "react";
import {
  FieldValues,
  UseFormRegisterReturn,
  UseFormSetValue,
} from "react-hook-form";
import "./index.css";
import classNames from "classnames";

export interface MultiSelectOptions {
  options?: { value: string; label: string }[];
  formRegister?: UseFormRegisterReturn<string>;
  setValue?: UseFormSetValue<FieldValues>;
  className?: string;
}

interface Selectable {
  selected: boolean;
  label: string;
  onClick: () => void;
}

const Selectable = ({ selected, label, onClick }: Selectable) => {
  return <div onClick={onClick}>{label}</div>;
};

const MultiSelect = ({
  className,
  formRegister,
  setValue,
  options,
}: MultiSelectOptions) => {
  const { name } = formRegister || {};
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelected = (value: string) => {
    const _selected = [...selected];
    const selectedIndex = _selected.findIndex((v) => v === value);

    if (selectedIndex >= 0) {
      _selected.splice(selectedIndex, 1);
    } else {
      _selected.push(value);
    }

    setSelected(_selected);

    if (name) {
      setValue?.(name, _selected);
    }
  };

  return (
    <div className={classNames(className)}>
      {options?.map(({ value, label }) => (
        <Selectable
          selected={selected.includes(value)}
          label={label}
          onClick={() => {
            handleSelected(value);
          }}
        />
      ))}
    </div>
  );
};

export default MultiSelect;
