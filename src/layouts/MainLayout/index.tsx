import LayoutHeader from "@/components/PageHeader/LayoutHeader";
import ScrollContext from "@/context/ScrollContext";
import useDebounce from "@/hooks/useDebounce";
import { MainLayoutContextType } from "@/hooks/useMainLayoutContext";
import { useState } from "react";
import { BiSpreadsheet } from "react-icons/bi";
import { FaImage } from "react-icons/fa6";
import { LuFileSpreadsheet } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import { Outlet, matchPath, useLocation, useNavigate } from "react-router-dom";
import "./index.css";

type NavigationTab = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: {
    path: string | { pathname: string; search?: string };
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

const MainLayout = () => {
  const { pathname } = useLocation();
  const [rightMenu, setRightMenu] = useState<JSX.Element[]>([]);
  const [leftMenu, setLeftMenu] = useState<JSX.Element[]>([]);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  const navigate = useNavigate();

  const tabs: NavigationTab = {
    logs: {
      icon: <BiSpreadsheet />,
      path: `/logs`,
      pattern: "/logs",
      title: "logs list",
    },
    list: {
      icon: <TbListDetails />,
      path: "/sheets",
      pattern: "/sheets",
      title: "log sheets",
    },
    records: {
      icon: <LuFileSpreadsheet />,
      path: "/sheet",
      pattern: "/sheet",
      title: "sheet records",
    },
    media: {
      icon: <FaImage />,
      path: "/media",
      pattern: "/media",
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

    const isActive = getActive(pattern);

    return (
      <NavigationTab
        icon={icon}
        active={isActive}
        onClick={() => {
          if (!isActive) {
            setRightMenu([]);
            setLeftMenu([]);

            navigate(path);
          }
        }}
      />
    );
  };

  const debounceStopScroll = useDebounce(() => {
    setIsScrolling(false);
  }, 500);

  const handleOnScroll = () => {
    setIsScrolling(true);
    debounceStopScroll();
  };

  return (
    <div className="sheet-layout-root">
      <LayoutHeader
        rightMenu={rightMenu}
        leftMenu={leftMenu}
        title={getTitle()}
      />

      <div className="content" onScroll={handleOnScroll}>
        <ScrollContext.Provider value={isScrolling}>
          <Outlet
            context={
              { setRightMenu, setLeftMenu } satisfies MainLayoutContextType
            }
          />
        </ScrollContext.Provider>
      </div>
      <div className="bottom-navigation">
        {renderNavigation("logs")}
        {renderNavigation("list")}
        {renderNavigation("records")}
        {renderNavigation("media")}
      </div>
    </div>
  );
};

export default MainLayout;
