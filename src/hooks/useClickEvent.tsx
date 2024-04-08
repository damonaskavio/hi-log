import { useEffect, useState } from "react";

type ClickEvent = {
  onClick?: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onPointerDown?: (e?: React.PointerEvent<HTMLElement>) => void;
  onPointerUp?: (e?: React.PointerEvent<HTMLElement>) => void;
  onMouseUp?: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onTouchEnd?: (e?: React.TouchEvent<HTMLElement>) => void;
  onBlur?: (e?: React.FocusEvent<HTMLElement>) => void;
};

const useClickEvent = (
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  stopPropagation?: boolean
) => {
  const [active, setActive] = useState(false);

  const listener = () => {
    setActive(false);
  };

  const activate = () => {
    window.addEventListener("pointerup", listener, { once: true });
    setActive(true);
  };

  const deactivate = () => {
    window.removeEventListener("pointerup", listener);
    setActive(false);
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
      deactivate();
    },
    onMouseUp: (e) => {
      if (e) {
        e.stopPropagation();
      }
      deactivate();
    },
    onTouchEnd: (e) => {
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
  };

  return [active, onClick ? clickEvent : {}] as const;
};

export default useClickEvent;