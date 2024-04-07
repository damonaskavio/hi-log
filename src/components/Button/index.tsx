import useClickEvent from "@/hooks/useClickEvent";
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
  const [active, clickEvent] = useClickEvent(onClick);

  return (
    <div
      data-active={active}
      data-compact={compact}
      className={`button-root ${className}`}
      {...clickEvent}
    >
      {icon && cloneElement(icon, { size: 30 })}
      <p>{children}</p>
    </div>
  );
};

export default Button;
