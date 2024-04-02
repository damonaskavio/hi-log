import { PropsWithChildren, cloneElement } from "react";
import "./index.css";

export type IconButtonOptions = {
  className?: string;
  icon: JSX.Element;
  onClick?: () => void;
};

const IconButton = ({
  className,
  icon,
  onClick,
}: PropsWithChildren<IconButtonOptions>) => {
  return (
    <div className={`iconButtonRoot ${className}`} onClick={() => onClick?.()}>
      {cloneElement(icon, { size: 30, color: "inherit" })}
    </div>
  );
};

export default IconButton;
