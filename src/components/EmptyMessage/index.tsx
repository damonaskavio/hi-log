import { useTranslation } from "react-i18next";
import "./index.css";

const EmptyMessage = ({ msgKey }: { msgKey: string }) => {
  const { t } = useTranslation();

  return (
    <div className="empty-msg">
      <p>{t(msgKey)}</p>
    </div>
  );
};

export default EmptyMessage;
