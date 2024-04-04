import { PropsWithChildren } from "react";
import "./index.css";

type FormDirection = "row" | "column";

export type FormOptions = {
  direction?: FormDirection;
};

const Form = ({ children, direction }: PropsWithChildren<FormOptions>) => {
  return (
    <div className="form-root" data-direction={direction}>
      {children}
    </div>
  );
};

export default Form;
