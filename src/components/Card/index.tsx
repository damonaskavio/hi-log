import { PropsWithChildren } from "react";
import "./index.css";
import useClickEvent from "@/hooks/useClickEvent";
import classNames from "classnames";

export type CardOptions = {
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
};

const Card = ({
  selected = false,
  className,
  children,
  onClick,
  onLongPress,
}: PropsWithChildren<CardOptions>) => {
  const [active, clickEvent] = useClickEvent({ onClick, onLongPress });

  return (
    <div
      data-selected={selected}
      data-active={active}
      className={classNames("card-root", className)}
      {...clickEvent}
    >
      {children}
    </div>
  );
};

export default Card;
