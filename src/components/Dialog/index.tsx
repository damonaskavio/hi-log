import { PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./index.css";
import classNames from "classnames";

export type DialogOptions = {
  open?: boolean;
  onClose?: () => void;
  className?: string;
};

const Dialog = ({
  children,
  open,
  onClose,
  className,
}: PropsWithChildren<DialogOptions>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      return;
    }

    dialogRef.current?.close();
  }, [open]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={classNames("dialog-root", className)}
      onClick={onClose}
    >
      <div
      className="dialog-container"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </dialog>,
    document.getElementById("root")!
  );
};

export default Dialog;
