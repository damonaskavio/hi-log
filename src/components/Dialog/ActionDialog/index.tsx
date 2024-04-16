import { useTranslation } from "react-i18next";
import Dialog, { DialogOptions } from "..";
import "./index.css";

type ActionDialogOptions = DialogOptions & {
  message?: string;
  component?: JSX.Element;
  options?: { label: string; onClick: () => void }[];
  onSubmit?: () => void;
};

const ActionDialog = ({
  message,
  component,
  options,
  onSubmit,
  ...dialogOptions
}: ActionDialogOptions) => {
  const { t } = useTranslation();

  const defaultOptions = [
    { label: t("cancel"), onClick: () => dialogOptions?.onClose?.() },
    { label: t("confirm"), onClick: () => onSubmit?.() },
  ];

  return (
    <Dialog {...dialogOptions} className="action-dialog-root">
      <div className="action-dialog">
        {message && <p className="action-title">{t(message)}</p>}
        {component}
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
