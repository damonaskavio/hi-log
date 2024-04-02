import { UseFormRegisterReturn } from "react-hook-form";
import "./index.css";

export type InputOptions = {
  formRegister?: UseFormRegisterReturn<string>;
  placeholder?: string;
};

const Input = ({ formRegister, placeholder }: InputOptions) => {
  return (
    <input
      className="inputRoot"
      placeholder={placeholder}
      {...(formRegister || {})}
    />
  );
};

export default Input;
