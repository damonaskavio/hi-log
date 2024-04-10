import { PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./index.css";

export type ModalOptions = {
  title?: string;
  open?: boolean;
  onClose?: () => void;
};

const Dialog = ({
  children,
  // title = "",
  open,
  onClose,
}: PropsWithChildren<ModalOptions>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      return;
    }

    dialogRef.current?.close();
  }, [open]);

  return createPortal(
    <dialog ref={dialogRef} className="dialog-root" onClick={onClose}>
      {children}
    </dialog>,
    document.getElementById("root")!
  );
};

export default Dialog;
