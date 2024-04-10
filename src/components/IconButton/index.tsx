import { PropsWithChildren, cloneElement } from "react";
import "./index.css";
import useClickEvent from "@/hooks/useClickEvent";
import classNames from "classnames";

export type IconButtonOptions = {
  className?: string;
  icon: JSX.Element;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  size?: number;
  stopPropagation?: boolean;
};

const IconButton = ({
  className,
  icon,
  onClick,
  size = 30,
  stopPropagation = false,
}: PropsWithChildren<IconButtonOptions>) => {
  const [active, clickEvent] = useClickEvent({ onClick, stopPropagation });

  return (
    <div
      data-active={active}
      className={classNames("icon-button-root", className)}
      {...clickEvent}
      style={{ height: size, width: size }}
    >
      {cloneElement(icon, { size, color: "inherit" })}
    </div>
  );
};

export default IconButton;
