import { SelectHTMLAttributes, useRef, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import "./index.css";
import classNames from "classnames";

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
  const rootRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const handleArrowChange = () => {
    setFocused(!focused);
  };
  return (
    <div
      ref={rootRef}
      className={classNames("select-root", className)}
      onBlur={() => {
        if (focused) {
          handleArrowChange();
        }
      }}
      data-focused={focused}
      tabIndex={0}
    >
      <select
        onClick={() => {
          handleArrowChange();
        }}
        {...selectOptions}
        {...(formRegister || {})}
        tabIndex={-1}
      >
        {options.map(({ value, label }) => (
          <option
            key={value}
            value={value}
            onClick={() => {
              handleArrowChange();
            }}
          >
            {label}
          </option>
        ))}
      </select>

      {focused ? <IoIosArrowUp /> : <IoIosArrowDown />}
    </div>
  );
};

export default Select;
