import Dialog, { DialogOptions } from "..";
import "./index.css";

type MenuDialogOptions = DialogOptions & {
  options: { label: string; onClick: () => void }[];
};

const MenuDialog = ({ options, ...dialogOptions }: MenuDialogOptions) => {
  return (
    <Dialog {...dialogOptions} className="menu-dialog-root">
      <div className="menu-dialog">
        {options.map(({ label, onClick }) => (
          <div className="option" onClick={onClick}>
            {label}
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default MenuDialog;
