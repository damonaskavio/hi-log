import { useTranslation } from "react-i18next";
import Modal from "..";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { FieldValues, useForm } from "react-hook-form";

import Spacer from "@/components/Spacer";
import PageContent from "@/components/PageContent";
import DatePicker from "react-date-picker";
import { useState } from "react";

export type AddLogModalOptions = {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: FieldValues) => void;
};

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const AddLogModal = ({ open, onClose, onSubmit }: AddLogModalOptions) => {
  const { t } = useTranslation();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: "" },
  });

  const onSubmitClick = () => {
    handleSubmit((data) => {
      onSubmit?.(data);
      onClose?.();
      reset?.();
    })();
  };

  const [date, setDate] = useState<Value>(new Date());

  return (
    <Modal title={t("add log")} open={open} onClose={() => onClose?.()}>
      <PageContent>
        <Input formRegister={register("name")} placeholder="Name" />
        {/* <DatePicker onChange={setDate} value={date} /> */}
        <Spacer />
        <Button onClick={onSubmitClick}>{t("add")}</Button>
      </PageContent>
    </Modal>
  );
};

export default AddLogModal;
