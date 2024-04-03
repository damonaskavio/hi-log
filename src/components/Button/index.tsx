import { PropsWithChildren, cloneElement } from "react";
import "./index.css";

export type ButtonOptions = {
  className?: string;
  icon?: JSX.Element;
  onClick?: () => void;
  compact?: boolean;
};

const Button = ({
  className,
  children,
  icon,
  onClick,
  compact = true,
}: PropsWithChildren<ButtonOptions>) => {
  return (
    <div
      data-compact={compact}
      className={`button-root ${className}`}
      onClick={() => onClick?.()}
    >
      {icon && cloneElement(icon, { size: 30 })}
      <p>{children}</p>
    </div>
  );
};

export default Button;
