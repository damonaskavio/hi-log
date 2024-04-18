import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Dialog, { DialogOptions } from "..";
import "./index.css";
import IconButton from "@/components/IconButton";
import { IoClose } from "react-icons/io5";

type ImageDialogOptions = DialogOptions & { base64?: string };

const ImageDialog = ({
  base64,
  onClose,
  ...dialogOptions
}: ImageDialogOptions) => {
  return (
    <Dialog {...dialogOptions} className="image-dialog-root">
      {base64 && (
        <TransformWrapper centerOnInit>
          <TransformComponent>
            <img src={base64} />
          </TransformComponent>
        </TransformWrapper>
      )}
      <IconButton icon={<IoClose />} className="close" onClick={onClose} />
    </Dialog>
  );
};

export default ImageDialog;
