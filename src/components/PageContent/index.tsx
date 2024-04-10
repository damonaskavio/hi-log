import { PropsWithChildren } from "react";
import "./index.css";
import classNames from "classnames";

export type PageContentOptions = {
  className?: string;
};

const PageContent = ({
  className,
  children,
}: PropsWithChildren<PageContentOptions>) => {
  return (
    <div className={classNames("page-content-root", className)}>{children}</div>
  );
};

export default PageContent;
