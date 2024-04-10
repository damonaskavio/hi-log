import Button from "@/components/Button";
import MenuDialog from "@/components/Dialog/MenuDialog";
import EmptyMessage from "@/components/EmptyMessage";
import PageContent from "@/components/PageContent";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline } from "react-icons/io5";
import "./index.css";

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

  const menuOptions = [
    { label: t("capture media"), onClick: () => cameraRef.current?.click() },
    { label: t("choose media"), onClick: () => galleryRef.current?.click() },
  ];

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

      <MenuDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        options={menuOptions}
      />
      <input ref={galleryRef} type="file" accept="image/*" />
      <input ref={cameraRef} type="file" accept="image/*" capture />
    </div>
  );
};

export default SheetMedia;
