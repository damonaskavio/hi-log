import { PropsWithChildren } from "react";
import "./index.css";

const PageHeader = ({ children }: PropsWithChildren) => {
  return <div className="pageHeaderRoot">{children}</div>;
};

export default PageHeader;
