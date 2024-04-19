import { useTranslation } from "react-i18next";
import Dialog, { DialogOptions } from "..";
import "./index.css";
import { PropsWithChildren } from "react";
import classnames from "classnames";

type ActionDialogOptions = DialogOptions & {
  message?: string;
  options?: { label: string; onClick: () => void }[];
  onSubmit?: () => void;
};

const ActionDialog = ({
  message,
  options,
  onSubmit,
  children,
  className,
  ...dialogOptions
}: PropsWithChildren<ActionDialogOptions>) => {
  const { t } = useTranslation();

  const defaultOptions = [
    { label: t("cancel"), onClick: () => dialogOptions?.onClose?.() },
    { label: t("confirm"), onClick: () => onSubmit?.() },
  ];

  return (
    <Dialog
      className={classnames("action-dialog-root", className)}
      {...dialogOptions}
    >
      <div className="action-dialog">
        {message && <p className="action-title">{t(message)}</p>}
        {children}
        <div className="action-container">
          {(options || defaultOptions).map(({ label, onClick }, index) => (
            <div
              key={`action_dialog_option_${index}`}
              className="option"
              onClick={onClick}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default ActionDialog;
