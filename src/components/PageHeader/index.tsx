import { PropsWithChildren } from "react";
import "./index.css";

const PageHeader = ({ children }: PropsWithChildren) => {
  return <div className="page-header-root">{children}</div>;
};

export default PageHeader;
