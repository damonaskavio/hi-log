import IconButton from "@/components/IconButton";
import AddRecordModal from "@/components/Modal/AddRecordModal";
import PageContent from "@/components/PageContent";
import useSheetLayoutContext from "@/hooks/useSheetLayoutContext";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { IoAddCircleOutline } from "react-icons/io5";

const SheetRecords = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { setRightMenu } = useSheetLayoutContext();

  const handleAddModalClick = () => {
    setAddModalOpen(true);
  };

  const handleAddRecord = (values: FieldValues) => {
    console.log("add record values", values);
    // const { name, desc } = values;
    // if (logId) {
    //   addSheet({
    //     logId,
    //     name,
    //     desc,
    //   });
    // }
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  useEffect(() => {
    setRightMenu([
      <IconButton
        icon={<IoAddCircleOutline />}
        onClick={() => handleAddModalClick()}
      />,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageContent></PageContent>
      <AddRecordModal
        open={addModalOpen}
        onClose={() => handleAddModalClose()}
        onSubmit={handleAddRecord}
      />
    </div>
  );
};

export default SheetRecords;
