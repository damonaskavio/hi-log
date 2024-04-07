import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import "./index.css";

export interface InputOptions extends InputHTMLAttributes<HTMLInputElement> {
  formRegister?: UseFormRegisterReturn<string>;
}

const Input = ({ formRegister, placeholder, type = "text" }: InputOptions) => {
  return (
    <input
      className="input-root"
      placeholder={placeholder}
      {...(formRegister || {})}
      type={type}
    />
  );
};

export default Input;
