import { PropsWithChildren, cloneElement, useEffect, useState } from "react";
import "./index.css";

export type ButtonOptions = {
  className?: string;
  icon?: JSX.Element;
  onClick?: () => void;
  compact?: boolean;
};

const Button = ({
  className,
  children,
  icon,
  onClick,
  compact = true,
}: PropsWithChildren<ButtonOptions>) => {
  const [active, setActive] = useState(false);

  const listener = () => {
    setActive(false);
  };

  const activate = () => {
    window.addEventListener("pointerup", listener, { once: true });
    setActive(true);
  };

  const deactivate = () => setActive(false);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointerup", listener);
    };
  }, []);

  return (
    <div
      data-active={active}
      data-compact={compact}
      className={`button-root ${className}`}
      onClick={() => {
        setTimeout(() => {
          onClick?.();
        }, 100);
      }}
      onPointerDown={activate}
      onPointerUp={deactivate}
      onMouseUp={deactivate}
      onTouchEnd={deactivate}
      onBlur={deactivate}
    >
      {icon && cloneElement(icon, { size: 30 })}
      <p>{children}</p>
    </div>
  );
};

export default Button;
