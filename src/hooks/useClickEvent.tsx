import { useEffect, useRef, useState } from "react";

type ClickEvent = {
  onClick?: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onPointerDown?: (e?: React.PointerEvent<HTMLElement>) => void;
  onPointerUp?: (e?: React.PointerEvent<HTMLElement>) => void;
  onMouseUp?: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onTouchStart?: (e?: React.TouchEvent<HTMLElement>) => void;
  onTouchEnd?: (e?: React.TouchEvent<HTMLElement>) => void;
  onBlur?: (e?: React.FocusEvent<HTMLElement>) => void;
  onPointerMove?: (e?: React.PointerEvent<HTMLElement>) => void;
};

const useClickEvent = ({
  onClick,
  onLongPress,
  stopPropagation = false,
}: {
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onLongPress?: () => void;
  stopPropagation?: boolean;
}) => {
  const timerRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const activeRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);

  const listener = () => {
    setActive(false);
  };

  const activate = () => {
    if (!activeRef.current) {
      window.addEventListener("pointerup", listener, { once: true });
      setActive(true);
      activeRef.current = true;

      if (onLongPress) {
        timerRef.current = setTimeout(() => {
          onLongPress();
        }, 500);
      }
    }
  };

  const deactivate = () => {
    if (activeRef.current) {
      window.removeEventListener("pointerup", listener);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setActive(false);
      activeRef.current = false;
      lastMousePosRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointerup", listener);
    };
  }, []);

  const clickEvent: ClickEvent = {
    onClick: (e) => {
      if (e) {
        if (stopPropagation) {
          e.stopPropagation();
        }

        activate();

        setTimeout(() => {
          onClick?.(e);
          deactivate?.();
        }, 100);
      }
    },
    onPointerDown: (e) => {
      if (e) {
        e.stopPropagation();
      }
      activate();
    },

    onPointerUp: (e) => {
      if (e) {
        e.stopPropagation();
      }

      lastMousePosRef.current = null;
      deactivate();
    },
    onMouseUp: (e) => {
      if (e) {
        e.stopPropagation();
      }
      deactivate();
    },
    onBlur: (e) => {
      if (e) {
        e.stopPropagation();
      }
      deactivate();
    },
    onPointerMove: (e) => {
      if (e) {
        e.stopPropagation();

        const curMouseX = e.clientX;
        const curMouseY = e.clientY;
        if (lastMousePosRef.current) {
          const { x: prevMouseX, y: prevMouseY } = lastMousePosRef.current;
          const distance =
            Math.abs(curMouseX - prevMouseX) + Math.abs(curMouseY - prevMouseY);

          if (distance > 1) {
            deactivate();
          }
        }

        lastMousePosRef.current = { x: curMouseX, y: curMouseY };
      }
    },
  };

  return [active, onClick ? clickEvent : {}] as const;
};

export default useClickEvent;
