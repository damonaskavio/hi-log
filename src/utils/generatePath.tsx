import { URLSearchParamsInit, createSearchParams } from "react-router-dom";

const generatePath = (
  path: string,
  searchParams?: URLSearchParamsInit | undefined
) => {
  const generatedPath: { pathname: string; search?: string } = {
    pathname: path,
  };

  if (searchParams) {
    generatedPath.search = createSearchParams(searchParams).toString();
  }

  return generatedPath;
};

export default generatePath;
