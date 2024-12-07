import { useEffect, useRef, useState } from "react";

type ClickEvent = {
  onClick?: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onPointerDown?: (e?: React.PointerEvent<HTMLElement>) => void;
  onTouchStart?: (e?: React.TouchEvent<HTMLElement>) => void;
  onTouchEnd?: (e?: React.TouchEvent<HTMLElement>) => void;
  onBlur?: (e?: React.FocusEvent<HTMLElement>) => void;
};

const useClickEvent = ({
  onClick,
  onPointerMove,
  onLongPress,
  stopPropagation = false,
}: {
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onPointerMove?: (e: PointerEvent) => boolean;
  onLongPress?: () => void;
  stopPropagation?: boolean;
}) => {
  const timerRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const activeRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const longPressRef = useRef<() => void | null>();

  const handlePointerUp = () => {
    deactivate();
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (e) {
      if (onPointerMove) {
        const proceed = onPointerMove(e);

        if (!proceed) {
          return;
        }
      }

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
  };

  const activate = () => {
    if (!activeRef.current) {
      window.addEventListener("pointerup", handlePointerUp, { once: true });
      window.addEventListener("pointermove", handlePointerMove);

      setActive(true);
      activeRef.current = true;

      if (longPressRef.current) {
        timerRef.current = setTimeout(() => {
          longPressRef.current?.();
        }, 500);
      }
    }
  };

  const deactivate = () => {
    if (activeRef.current) {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);

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
    const timer = timerRef.current;

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);

      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, []);

  useEffect(() => {
    longPressRef.current = onLongPress;
  }, [onLongPress]);

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

    onBlur: (e) => {
      if (e) {
        e.stopPropagation();
      }
      deactivate();
    },
  };

  return [active, onClick ? clickEvent : {}] as const;
};

export default useClickEvent;
