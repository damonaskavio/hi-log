import { PropsWithChildren, cloneElement } from "react";
import "./index.css";
import useClickEvent from "@/hooks/useClickEvent";

export type IconButtonOptions = {
  className?: string;
  icon: JSX.Element;
  onClick?: () => void;
};

const IconButton = ({
  className,
  icon,
  onClick,
}: PropsWithChildren<IconButtonOptions>) => {
  const [active, clickEvent] = useClickEvent(onClick);

  return (
    <div
      data-active={active}
      className={`icon-button-root ${className}`}
      {...clickEvent}
    >
      {cloneElement(icon, { size: 30, color: "inherit" })}
    </div>
  );
};

export default IconButton;
