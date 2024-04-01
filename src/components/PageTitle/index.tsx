import { PropsWithChildren } from "react";
import "./index.css";

const PageTitle = ({ children }: PropsWithChildren) => {
  return <div className="pageTitleRoot">{children}</div>;
};

export default PageTitle;
