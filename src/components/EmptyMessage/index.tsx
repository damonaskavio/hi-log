import { useTranslation } from "react-i18next";
import "./index.css";

const EmptyMessage = ({
  msgKey = "",
  component,
}: {
  msgKey?: string;
  component?: JSX.Element;
}) => {
  const { t } = useTranslation();

  return (
    <div className="empty-msg">
      <p>{t(msgKey)}</p>
      {component}
    </div>
  );
};

export default EmptyMessage;
