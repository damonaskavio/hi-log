import Button from "@/components/Button";
import Input from "@/components/Input";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Modal from "..";

import Form from "@/components/Form";
import PageContent from "@/components/PageContent";
import Spacer from "@/components/Spacer";
import "./index.css";
import Select from "@/components/Select";

export type AddRecordModalOptions = {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: FieldValues) => void;
};

const AddRecordModal = ({ open, onClose, onSubmit }: AddRecordModalOptions) => {
  const { t } = useTranslation();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: "", desc: "", amount: 0, logDate: new Date() },
  });

  const onSubmitClick = () => {
    handleSubmit((data) => {
      onSubmit?.(data);
      onClose?.();
      reset?.();
    })();
  };

  return (
    <Modal title={t("add record")} open={open} onClose={() => onClose?.()}>
      <PageContent>
        <Form>
          <Input formRegister={register("name")} placeholder={t("name")} />
          <Input formRegister={register("desc")} placeholder={t("desc")} />
          <div className="currency-container">
            <Select
              className="currency"
              formRegister={register("amount")}
              options={[{ value: "MYR", label: "MYR RM" }]}
            />

            <Input
              className="amount"
              formRegister={register("amount", {
                valueAsNumber: true,
                // Experimental decimal force
                // onChange: (e) => {
                //   console.log("on change", e.target.value);
                //   setValue("amount", toDecimal(e.target.value));
                // },
              })}
              placeholder={t("amount")}
              type="number"
              onKeyDown={(evt) =>
                ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
              }
            />
          </div>
        </Form>
        <Spacer />
        <Button onClick={onSubmitClick}>{t("add")}</Button>
      </PageContent>
    </Modal>
  );
};

export default AddRecordModal;
