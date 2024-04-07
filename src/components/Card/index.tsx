import { PropsWithChildren } from "react";
import "./index.css";
import useClickEvent from "@/hooks/useClickEvent";

export type CardOptions = {
  className?: string;
  selected?: boolean;
  onClick?: () => void;
};

const Card = ({
  selected = false,
  className,
  children,
  onClick,
}: PropsWithChildren<CardOptions>) => {
  const [active, clickEvent] = useClickEvent(onClick);

  return (
    <div
      data-selected={selected}
      data-active={active}
      className={`card-root ${className}`}
      {...clickEvent}
    >
      {children}
    </div>
  );
};

export default Card;
