import Button from "@/components/Button";
import Input from "@/components/Input";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Modal from "..";

import Form from "@/components/Form";
import PageContent from "@/components/PageContent";
import Spacer from "@/components/Spacer";

export type AddPersonModalOptions = {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: FieldValues) => void;
};

const AddPersonModal = ({ open, onClose, onSubmit }: AddPersonModalOptions) => {
  const { t } = useTranslation();

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      name: "",
      desc: "",
      logDate: new Date(),
      sheetDate: undefined,
    },
  });

  const onSubmitClick = () => {
    handleSubmit((data) => {
      onSubmit?.(data);
      onClose?.();
      reset?.();
    })();
  };

  return (
    <Modal title={t("add person")} open={open} onClose={() => onClose?.()}>
      <PageContent>
        <Form>
          <Input formRegister={register("name")} placeholder={t("name")} />
        </Form>
        <Spacer />
        <Button onClick={onSubmitClick}>{t("add")}</Button>
      </PageContent>
    </Modal>
  );
};

export default AddPersonModal;
