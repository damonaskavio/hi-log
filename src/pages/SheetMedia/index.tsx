import Button from "@/components/Button";
import EmptyMessage from "@/components/EmptyMessage";
import PageContent from "@/components/PageContent";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline } from "react-icons/io5";
import "./index.css";
import Dialog from "@/components/Dialog";

const SheetMedia = () => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    // galleryRef.current?.click();
    setOpenDialog(true);
  };

  const isMediaEmpty = true;

  return (
    <div className="sheet-media-root">
      {isMediaEmpty && <EmptyMessage msgKey="media empty" />}
      <PageContent>
        {isMediaEmpty && (
          <Button
            icon={<IoAddCircleOutline />}
            onClick={handleAddClick}
            compact={false}
          >
            {t("add media")}
          </Button>
        )}
      </PageContent>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
      >
        asdasda
      </Dialog>
      <input ref={galleryRef} type="file" accept="image/*" />
      <input ref={cameraRef} type="file" accept="image/*" capture />
    </div>
  );
};

export default SheetMedia;
