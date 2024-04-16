import Button from "@/components/Button";
import Input from "@/components/Input";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Modal from "..";

import Form from "@/components/Form";
import PageContent from "@/components/PageContent";
import Spacer from "@/components/Spacer";
import { Sheet } from "@/store/createSheetSlice";
import { useEffect } from "react";

export type EditSheetModalOptions = {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: FieldValues) => void;
  sheet?: Sheet;
};

const EditSheetModal = ({
  open,
  onClose,
  onSubmit,
  sheet,
}: EditSheetModalOptions) => {
  const { t } = useTranslation();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: "", desc: "", logDate: new Date() },
  });

  const onSubmitClick = () => {
    handleSubmit((data) => {
      onSubmit?.(data);
      onClose?.();
      reset?.();
    })();
  };

  useEffect(() => {
    if (sheet) {
      const { name, desc } = sheet;
      reset({
        name,
        desc,
      });
    } else {
      reset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);

  return (
    <Modal title={t("edit sheet")} open={open} onClose={() => onClose?.()}>
      <PageContent>
        <Form>
          <Input formRegister={register("name")} placeholder={t("name")} />
          <Input formRegister={register("desc")} placeholder={t("desc")} />
        </Form>
        <Spacer />
        <Button onClick={onSubmitClick}>{t("save")}</Button>
      </PageContent>
    </Modal>
  );
};

export default EditSheetModal;
