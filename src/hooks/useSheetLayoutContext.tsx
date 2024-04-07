import { Dispatch, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";

export type SheetLayoutContextType = {
  setLeftMenu: Dispatch<SetStateAction<JSX.Element[]>>;
  setRightMenu: Dispatch<SetStateAction<JSX.Element[]>>;
};

export default function useSheetLayoutContext() {
  return useOutletContext<SheetLayoutContextType>();
}
