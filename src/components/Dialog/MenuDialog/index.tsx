import Dialog, { DialogOptions } from "..";
import "./index.css";

type MenuDialogOptions = DialogOptions & {
  options: { label: string; onClick: () => void }[];
};

const MenuDialog = ({ options, ...dialogOptions }: MenuDialogOptions) => {
  return (
    <Dialog {...dialogOptions}>
      <div className="menu-dialog">
        {options.map(({ label, onClick }, index) => (
          <div
            key={`menu_dialog_option_${index}`}
            className="option"
            onClick={onClick}
          >
            {label}
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default MenuDialog;
