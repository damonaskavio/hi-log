import IconButton from "@/components/IconButton";
import { useTranslation } from "react-i18next";
import { LuListStart } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import PageHeader from "..";
import "./index.css";

export type LayoutHeaderOptions = {
  title?: string;
  rightMenu?: JSX.Element[];
  leftMenu?: JSX.Element[];
  onBack?: () => void;
};

const LayoutHeader = ({
  title,
  rightMenu = [],
  leftMenu = [],
  onBack,
}: LayoutHeaderOptions) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const BackButton = () => (
    <IconButton
      icon={<LuListStart />}
      onClick={() => {
        onBack?.();
        navigate("/");
      }}
    />
  );

  return (
    <PageHeader
      leftMenu={[...(onBack ? [<BackButton />] : []), ...leftMenu]}
      rightMenu={rightMenu}
    >
      {t(title || "")}
    </PageHeader>
  );
};

export default LayoutHeader;
