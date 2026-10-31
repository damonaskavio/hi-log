import Button from "@/components/Button";
import Input from "@/components/Input";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Modal from "..";

import DateTimePicker from "@/components/DateTimePicker";
import Form from "@/components/Form";
import PageContent from "@/components/PageContent";
import Spacer from "@/components/Spacer";
import { Sheet } from "@/store/createSheetSlice";
import { useEffect } from "react";
import { Person } from "@/store/createPeopleSlice";

export type EditPersonModalOptions = {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: FieldValues) => void;
  person?: Person;
};

const EditPersonModal = ({
  open,
  onClose,
  onSubmit,
  person,
}: EditPersonModalOptions) => {
  const { t } = useTranslation();

  const { register, handleSubmit, reset, watch } = useForm<{
    name: string;
  }>({
    defaultValues: { name: "" },
  });

  const onSubmitClick = () => {
    handleSubmit((data) => {
      onSubmit?.(data);
      onClose?.();
      reset?.();
    })();
  };

  useEffect(() => {
    if (person) {
      const { name } = person;

      reset({
        name,
      });
    } else {
      reset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person]);

  return (
    <Modal title={t("edit person")} open={open} onClose={() => onClose?.()}>
      <PageContent>
        <Form>
          <Input formRegister={register("name")} placeholder={t("name")} />
        </Form>
        <Spacer />
        <Button onClick={onSubmitClick}>{t("save")}</Button>
      </PageContent>
    </Modal>
  );
};

export default EditPersonModal;
