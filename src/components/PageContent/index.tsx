import { PropsWithChildren } from "react";
import "./index.css";

export type PageContentOptions = {
  className?: string;
};

const PageContent = ({
  className,
  children,
}: PropsWithChildren<PageContentOptions>) => {
  return <div className={`page-content-root ${className}`}>{children}</div>;
};

export default PageContent;
