import { useTranslation } from "react-i18next";
import Modal from "..";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { FieldValues, useForm } from "react-hook-form";

export type AddLogModalOptions = {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: FieldValues) => void;
};

const AddLogModal = ({ open, onClose, onSubmit }: AddLogModalOptions) => {
  const { t } = useTranslation();

  const { register, handleSubmit } = useForm();

  const onSubmitClick = () => {
    handleSubmit(
      (data) => {
        onSubmit?.(data);
        onClose?.();
      },
      (err) => {
        console.log("invalid", err);
      }
    )();
  };

  return (
    <Modal title={t("add log")} open={open} onClose={() => onClose?.()}>
      <Input formRegister={register("name")} placeholder="Name" />
      <Button onClick={onSubmitClick}>{t("add")}</Button>
    </Modal>
  );
};

export default AddLogModal;
