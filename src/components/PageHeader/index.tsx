import isEmpty from "lodash/isEmpty";
import { PropsWithChildren } from "react";
import "./index.css";

type PageHeaderOptions = {
  leftMenu?: JSX.Element[];
  rightMenu?: JSX.Element[];
};

const PageHeader = ({
  children,
  leftMenu,
  rightMenu,
}: PropsWithChildren<PageHeaderOptions>) => {
  return (
    <div className="page-header-root">
      <div className="page-header-left">
        {!isEmpty(leftMenu) && <>{...leftMenu!}</>}
      </div>
      <p className="page-header-title">{children}</p>
      <div className="page-header-right">
        {!isEmpty(rightMenu) && <>{...rightMenu!}</>}
      </div>
    </div>
  );
};

export default PageHeader;
