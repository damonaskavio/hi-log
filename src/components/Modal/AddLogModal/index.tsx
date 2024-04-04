import { useTranslation } from "react-i18next";
import Modal from "..";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { FieldValues, useForm } from "react-hook-form";

import Spacer from "@/components/Spacer";
import PageContent from "@/components/PageContent";
import { useState } from "react";
import Form from "@/components/Form";

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
    defaultValues: { name: "", logDate: new Date() },
  });

  const onSubmitClick = () => {
    handleSubmit((data) => {
      onSubmit?.(data);
      onClose?.();
      reset?.();
    })();
  };

  return (
    <Modal title={t("add log")} open={open} onClose={() => onClose?.()}>
      <PageContent>
        <Form>
          <Input formRegister={register("name")} placeholder="Name" />
        </Form>
        <Spacer />
        <Button onClick={onSubmitClick}>{t("add")}</Button>
      </PageContent>
    </Modal>
  );
};

export default AddLogModal;
