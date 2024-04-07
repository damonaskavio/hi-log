import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import "./index.css";

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
      className={`input-root ${className}`}
      placeholder={placeholder}
      {...(formRegister || {})}
      type={type}
    />
  );
};

export default Input;