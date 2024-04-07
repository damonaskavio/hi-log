import { useEffect, useState } from "react";

const useClickEvent = (onClick?: () => void) => {
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

  const clickEvent = {
    onClick: () => {
      activate();

      setTimeout(() => {
        onClick?.();
        deactivate?.();
      }, 100);
    },
    onPointerDown: activate,
    onPointerUp: deactivate,
    onMouseUp: deactivate,
    onTouchEnd: deactivate,
    onBlur: deactivate,
  };

  return [active, clickEvent] as const;
};

export default useClickEvent;
