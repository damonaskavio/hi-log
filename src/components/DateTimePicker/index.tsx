import { InputHTMLAttributes, useState } from "react";
import { UseFormRegisterReturn, UseFormWatch } from "react-hook-form";
import { IoTimeOutline } from "react-icons/io5";
import { TbCalendar, TbCalendarTime } from "react-icons/tb";

import "./index.css";

export interface DateTimePickerOptions
  extends InputHTMLAttributes<HTMLInputElement> {
  formRegister?: UseFormRegisterReturn<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formWatch?: UseFormWatch<any>;
  type?: "date" | "time" | "datetime-local";
}

const DateTimePicker = ({
  className,
  formRegister,
  formWatch,
  placeholder,
  type = "datetime-local",
  ...dateTimePickerOptions
}: DateTimePickerOptions) => {
  const [hasValue, setHasValue] = useState(false);

  const Icon = () => {
    switch (type) {
      case "date":
        return <TbCalendar />;
      case "time":
        return <IoTimeOutline />;
      case "datetime-local":
        return <TbCalendarTime />;
    }
  };

  const value = formWatch?.(formRegister?.name || "");

  return (
    <div className="date-picker-root">
      <input
        {...dateTimePickerOptions}
        className={`date-picker-input ${className}`}
        placeholder={placeholder}
        {...(formRegister || {})}
        onChange={(...e) => {
          const value = e[0].target.value;

          setHasValue(!!value);
          formRegister?.onChange(...e);
        }}
        data-has-val={hasValue || !!value}
        type={type}
      />

      <Icon />
    </div>
  );
};

export default DateTimePicker;
