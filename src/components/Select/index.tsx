import { SelectHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import "./index.css";

type Option = {
  value: string;
  label: string;
};

export interface SelectOptions extends SelectHTMLAttributes<HTMLSelectElement> {
  formRegister?: UseFormRegisterReturn<string>;
  options: Option[];
}

const Select = ({
  className,
  formRegister,
  options,
  ...selectOptions
}: SelectOptions) => {
  return (
    <select
      {...selectOptions}
      className={`select-root ${className}`}
      {...(formRegister || {})}
    >
      {options.map(({ value, label }) => (
        <option value={value}>{label}</option>
      ))}
    </select>
  );
};

export default Select;
