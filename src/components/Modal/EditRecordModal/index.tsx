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
import CurrencySymbolMap from "@/utils/currency";
import DateTimePicker from "@/components/DateTimePicker";
import { Record } from "@/store/createRecordSlice";
import { useEffect } from "react";
import MultilineInput from "@/components/MultilineInput";

export type EditRecordModalOptions = {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: FieldValues) => void;
  record?: Record;
};

const EditRecordModal = ({
  open,
  onClose,
  onSubmit,
  record,
}: EditRecordModalOptions) => {
  const { t } = useTranslation();

  const { register, handleSubmit, reset, watch } = useForm<{
    name: string;
    desc: string;
    recordDate: Date | null;
    recordTime: string | null;
    currency: string;
    amount: number;
  }>({
    defaultValues: {
      name: "",
      desc: "",
      recordDate: null,
      recordTime: null,
      currency: "MYR",
      amount: 0,
    },
  });

  const onSubmitClick = () => {
    handleSubmit((data) => {
      onSubmit?.(data);
      onClose?.();
      reset?.();
    })();
  };

  useEffect(() => {
    if (record) {
      const { name, desc, recordDate, recordTime, currency, amount } = record;
      reset({
        name,
        desc,
        recordDate: recordDate || null,
        recordTime: recordTime || null,
        currency,
        amount,
      });
    } else {
      reset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);

  return (
    <Modal title={t("edit record")} open={open} onClose={() => onClose?.()}>
      <PageContent>
        <Form>
          <Input formRegister={register("name")} placeholder={t("name")} />
          <MultilineInput
            formRegister={register("desc")}
            placeholder={t("desc")}
          />
          <DateTimePicker
            formRegister={register("recordDate")}
            formWatch={watch}
            placeholder={t("record date")}
            type="date"
          />
          <DateTimePicker
            formRegister={register("recordTime")}
            formWatch={watch}
            placeholder={t("record time")}
            type="time"
          />
          <div className="currency-container">
            <Select
              className="currency"
              formRegister={register("currency")}
              options={[
                { value: "MYR", label: CurrencySymbolMap["MYR"] },
                { value: "JPY", label: CurrencySymbolMap["JPY"] },
              ]}
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
                ["e", "E", "+"].includes(evt.key) && evt.preventDefault()
              }
            />
          </div>
        </Form>
        <Spacer />
        <Button onClick={onSubmitClick}>{t("save")}</Button>
      </PageContent>
    </Modal>
  );
};

export default EditRecordModal;
