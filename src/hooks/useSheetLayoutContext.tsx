import { Dispatch, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";

export type SheetLayoutContextType = {
  setLeftMenu: Dispatch<SetStateAction<JSX.Element[]>>;
  setRightMenu: Dispatch<SetStateAction<JSX.Element[]>>;
};

const useSheetLayoutContext = () => {
  return useOutletContext<SheetLayoutContextType>();
};

export default useSheetLayoutContext;
