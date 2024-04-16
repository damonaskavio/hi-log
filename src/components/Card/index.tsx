import { PropsWithChildren } from "react";
import "./index.css";
import useClickEvent from "@/hooks/useClickEvent";
import classNames from "classnames";
import { FaCircleCheck } from "react-icons/fa6";
import IconButton from "../IconButton";
import { MdEdit } from "react-icons/md";

export type CardOptions = {
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onLongPress?: () => void;
  editable?: boolean;
  checked?: boolean;
  title?: string;
};

const Card = ({
  selected = false,
  className,
  children,
  onClick,
  onLongPress,
  onEdit,
  editable = false,
  checked = false,
  title,
}: PropsWithChildren<CardOptions>) => {
  const [active, clickEvent] = useClickEvent({ onClick, onLongPress });

  return (
    <div
      data-selected={selected}
      data-active={active}
      className={classNames("card-root", className)}
      {...clickEvent}
    >
      <div className="header">
        <div className="title">{title}</div>
        {checked ? (
          <FaCircleCheck size={20} />
        ) : editable ? (
          <IconButton
            icon={<MdEdit />}
            size={20}
            onClick={() => onEdit?.()}
            stopPropagation={true}
          />
        ) : (
          <></>
        )}
      </div>

      {children}
    </div>
  );
};

export default Card;
