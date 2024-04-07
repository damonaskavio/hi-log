import SheetCard from "@/components/Card/SheetCard";
import IconButton from "@/components/IconButton";
import AddSheetModal from "@/components/Modal/AddSheetModal";
import PageContent from "@/components/PageContent";
import useSheetLayoutContext from "@/hooks/useSheetLayoutContext";
import useHiLogStore from "@/store/useHiLogStore";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { IoAddCircleOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import "./index.css";

const SheetsList = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [
    sheets,
    selectedSheet,
    selectedLog,
    getLog,
    getLogSheets,
    getLatestLogSheet,
    setSelectedSheet,
    setSelectedLog,
    addSheet,
  ] = useHiLogStore(
    useShallow((state) => [
      state.sheets,
      state.selectedSheet,
      state.selectedLog,
      state.getLog,
      state.getLogSheets,
      state.getLatestLogSheet,
      state.setSelectedSheet,
      state.setSelectedLog,
      state.addSheet,
    ])
  );

  const { logId } = useParams();

  const handleAddModalClick = () => {
    setAddModalOpen(true);
  };

  const handleAddSheet = (values: FieldValues) => {
    const { name, desc } = values;

    if (logId) {
      addSheet({
        logId,
        name,
        desc,
      });
    }
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const { setRightMenu } = useSheetLayoutContext();

  useEffect(() => {
    if (logId) {
      if (!selectedSheet) {
        const sheet = getLatestLogSheet(logId);
        setSelectedSheet(sheet);
      }

      if (!selectedLog) {
        const log = getLog(logId);
        if (log) {
          setSelectedLog(log);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheets]);

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
      <PageContent>
        <div className="sheets-list-container">
          {logId &&
            getLogSheets(logId)?.map((sheet) => (
              <SheetCard key={sheet.id} data={sheet} />
            ))}
        </div>
      </PageContent>

      <AddSheetModal
        open={addModalOpen}
        onClose={() => handleAddModalClose()}
        onSubmit={handleAddSheet}
      />
    </div>
  );
};

export default SheetsList;
