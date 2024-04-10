import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import "./index.css";
import classNames from "classnames";

export interface InputOptions extends InputHTMLAttributes<HTMLInputElement> {
  formRegister?: UseFormRegisterReturn<string>;
}

const Input = ({
  className,
  formRegister,
  placeholder,
  type = "text",
  ...inputOptions
}: InputOptions) => {
  return (
    <input
      {...inputOptions}
      className={classNames("input-root", className)}
      placeholder={placeholder}
      {...(formRegister || {})}
      type={type}
    />
  );
};

export default Input;
