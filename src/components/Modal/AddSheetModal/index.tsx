import Button from "@/components/Button";
import Input from "@/components/Input";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Modal from "..";

import Form from "@/components/Form";
import PageContent from "@/components/PageContent";
import Spacer from "@/components/Spacer";
import DateTimePicker from "@/components/DateTimePicker";

export type AddSheetModalOptions = {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: FieldValues) => void;
};

const AddSheetModal = ({ open, onClose, onSubmit }: AddSheetModalOptions) => {
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
    <Modal title={t("add sheet")} open={open} onClose={() => onClose?.()}>
      <PageContent>
        <Form>
          <Input formRegister={register("name")} placeholder={t("name")} />
          <Input formRegister={register("desc")} placeholder={t("desc")} />
          <DateTimePicker
            formRegister={register("sheetDate")}
            formWatch={watch}
            placeholder={t("sheet date")}
            type="date"
          />
        </Form>
        <Spacer />
        <Button onClick={onSubmitClick}>{t("add")}</Button>
      </PageContent>
    </Modal>
  );
};

export default AddSheetModal;
