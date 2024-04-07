import { PropsWithChildren, useEffect, useRef } from "react";
import PageHeader from "../PageHeader";
import "./index.css";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import IconButton from "../IconButton";

export type ModalOptions = {
  title?: string;
  open?: boolean;
  onClose?: () => void;
};

const Modal = ({
  children,
  title = "",
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
    <dialog ref={dialogRef} className="modal-root">
      <PageHeader
        rightMenu={[
          <IconButton onClick={() => onClose?.()} icon={<IoClose />} />,
        ]}
      >
        {title}
      </PageHeader>

      {children}
    </dialog>,
    document.getElementById("root")!
  );
};

export default Modal;
