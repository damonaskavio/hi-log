import useClickEvent from "@/hooks/useClickEvent";
import classNames from "classnames";
import {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoReorderThree } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import IconButton from "../IconButton";
import "./index.css";

export type CardOptions = {
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
  onEdit?: () => void;
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onDragStart?: (el: HTMLDivElement) => void;
  onDragEnd?: () => void;
  editable?: boolean;
  checked?: boolean;
  title?: string;
  reorder?: boolean;
  offsetY?: number;
};

const Card = forwardRef<HTMLDivElement, PropsWithChildren<CardOptions>>(
  (
    {
      selected = false,
      className,
      children,
      onClick,
      onLongPress,
      onEdit,
      onPointerMove,
      onDragStart,
      onDragEnd,
      editable = false,
      checked = false,
      title,
      reorder,
      offsetY,
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>();
    const pointerDownY = useRef<number>(0);
    const isDragging = useRef<boolean>(false);
    const [top, setTop] = useState<number>(0);

    const [active, clickEvent] = useClickEvent({
      onClick: () => {
        if (!reorder) {
          onClick?.();

          return;
        }
      },
      onLongPress: () => {
        if (!reorder) {
          onLongPress?.();

          return;
        }
      },
      onPointerMove: (e) => {
        if (isDragging.current) {
          setTop(top + e.clientY - pointerDownY.current);

          return false;
        }

        return true;
      },
    });

    const { onPointerDown, ...restEvents } = clickEvent;

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        pointerDownY.current = e.clientY;

        onPointerDown?.(e);
      },
      []
    );

    const handleDragStart = () => {
      const card = cardRef.current;

      if (card) {
        onDragStart?.(card);
      }

      isDragging.current = true;
    };

    useEffect(() => {
      if (!active) {
        if (isDragging.current === true) {
          isDragging.current = false;
          setTop(0);
          onDragEnd?.();
        }
      }
    }, [active]);

    return (
      <div
        data-dragging={active && isDragging.current}
        className={classNames("card-root", className)}
      >
        <div
          ref={(node) => {
            if (node) {
              cardRef.current = node;

              if (ref) {
                if (typeof ref === "function") {
                  ref(node);
                } else {
                  ref.current = node;
                }
              }
            }
          }}
          style={{
            top: offsetY ? `${offsetY * 100}%` : top,
          }}
          data-selected={selected}
          data-active={active}
          data-dragging={active && isDragging.current}
          data-reorder={reorder}
          className={"card"}
          {...restEvents}
          onPointerDown={handlePointerDown}
        >
          {reorder && (
            <div
              className="reorder"
              onPointerDown={handleDragStart}
              onPointerMove={onPointerMove}
            >
              <IoReorderThree size={20} />
            </div>
          )}
          <div className="content">
            <div className="header">
              <div className="title">{title}</div>
              {!reorder &&
                (checked ? (
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
                ))}
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }
);

export default Card;
