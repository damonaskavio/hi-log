import { InputHTMLAttributes, useState } from "react";
import { UseFormRegisterReturn, UseFormWatch } from "react-hook-form";
import "./index.css";

export interface DateTimePickerOptions
  extends InputHTMLAttributes<HTMLInputElement> {
  formRegister?: UseFormRegisterReturn<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formWatch?: UseFormWatch<{ [key: string]: any }>;
  type?: "date" | "time" | "datetime-local";
}

const DateTimePicker = ({
  className,
  formRegister,
  placeholder,
  type = "datetime-local",
  ...dateTimePickerOptions
}: DateTimePickerOptions) => {
  const [hasValue, setHasValue] = useState(false);

  return (
    <input
      {...dateTimePickerOptions}
      className={`date-picker-root ${className}`}
      placeholder={placeholder}
      {...(formRegister || {})}
      onChange={(...e) => {
        console.log("date picker onchange");
        const value = e[0].target.value;

        setHasValue(!!value);
        formRegister?.onChange(...e);
      }}
      data-has-val={hasValue}
      type={type}
    />
  );
};

export default DateTimePicker;
