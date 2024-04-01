import { IoAddCircleOutline } from "react-icons/io5";
import "./index.css";

const AddLogCard = ({
  add,
  compact = false,
}: {
  add: () => void;
  compact?: boolean;
}) => {
  return (
    <div
      data-compact={compact}
      className="addLogCardRoot"
      onClick={() => add()}
    >
      <IoAddCircleOutline size={30} />
      <p>Add Log</p>
    </div>
  );
};

export default AddLogCard;
