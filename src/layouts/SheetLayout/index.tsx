import LayoutHeader from "@/components/PageHeader/LayoutHeader";
import { SheetLayoutContextType } from "@/hooks/useSheetLayoutContext";
import { useState } from "react";
import { FaImage } from "react-icons/fa6";
import { LuFileSpreadsheet } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import {
  Outlet,
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./index.css";
import useHiLogStore from "@/store/useHiLogStore";
import { useShallow } from "zustand/react/shallow";

type NavigationTab = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: {
    path: string;
    pattern: string;
    icon: JSX.Element;
    title: string;
  };
};

const NavigationTab = ({
  icon,
  active,
  onClick,
}: {
  icon: JSX.Element;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="navigation-tab" data-active={active} onClick={onClick}>
      {icon}
    </div>
  );
};

const SheetLayout = () => {
  const { pathname } = useLocation();
  const { logId, sheetId } = useParams();
  const [rightMenu, setRightMenu] = useState<JSX.Element[]>([]);
  const [leftMenu, setLeftMenu] = useState<JSX.Element[]>([]);
  const navigate = useNavigate();

  const [setSelectedLog, setSelectedSheet] = useHiLogStore(
    useShallow((state) => [state.setSelectedLog, state.setSelectedSheet])
  );

  const tabs: NavigationTab = {
    list: {
      icon: <TbListDetails />,
      path: `log/${logId}/sheets`,
      pattern: "/log/:logId/sheets",
      title: "log sheets",
    },
    records: {
      icon: <LuFileSpreadsheet />,
      path: `log/${logId}/sheet/${sheetId}`,
      pattern: "/log/:logId/sheet/:sheetId",
      title: "sheet records",
    },
    media: {
      icon: <FaImage />,
      path: `log/${logId}/sheet/${sheetId}/media`,
      pattern: "/log/:logId/sheet/:sheetId/media",
      title: "sheet media",
    },
  };

  const getActive = (pattern: string) => {
    return !!matchPath(pattern, pathname);
  };

  const getTitle = (): string => {
    for (const tabKey of Object.keys(tabs)) {
      const tab = tabs[tabKey];

      const { pattern, title } = tab;

      if (getActive(pattern)) {
        return title;
      }
    }

    return "";
  };

  const renderNavigation = (key: string) => {
    const { path, icon, pattern } = tabs[key];
    return (
      <NavigationTab
        icon={icon}
        active={getActive(pattern)}
        onClick={() => {
          setRightMenu([]);
          setLeftMenu([]);

          navigate(path);
        }}
      />
    );
  };

  return (
    <div className="sheet-layout-root">
      <LayoutHeader
        rightMenu={rightMenu}
        leftMenu={leftMenu}
        title={getTitle()}
        onBack={() => {
          setSelectedLog();
          setSelectedSheet();
        }}
      />

      <div className="content">
        <Outlet
          context={
            { setRightMenu, setLeftMenu } satisfies SheetLayoutContextType
          }
        />
      </div>
      <div className="bottom-navigation">
        {renderNavigation("list")}
        {renderNavigation("records")}
        {renderNavigation("media")}
      </div>
    </div>
  );
};

export default SheetLayout;
