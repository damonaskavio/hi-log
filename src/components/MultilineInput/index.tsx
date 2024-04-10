import { TextareaHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import "./index.css";

export interface MultilineInputOptions
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  formRegister?: UseFormRegisterReturn<string>;
}

const MultilineInput = ({
  className,
  formRegister,
  placeholder,
  ...multilineInput
}: MultilineInputOptions) => {
  return (
    <textarea
      {...multilineInput}
      className={`multiline-input-root ${className}`}
      placeholder={placeholder}
      {...(formRegister || {})}
    />
  );
};

export default MultilineInput;
