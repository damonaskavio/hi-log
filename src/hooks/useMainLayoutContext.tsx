import { Dispatch, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";

export type MainLayoutContextType = {
  setLeftMenu: Dispatch<SetStateAction<JSX.Element[]>>;
  setRightMenu: Dispatch<SetStateAction<JSX.Element[]>>;
};

const useMainLayoutContext = () => {
  return useOutletContext<MainLayoutContextType>();
};

export default useMainLayoutContext;