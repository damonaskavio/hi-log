import Button from "@/components/Button";
import PersonCard from "@/components/Card/PersonCard";
import EmptyMessage from "@/components/EmptyMessage";
import IconButton from "@/components/IconButton";
import AddPersonModal from "@/components/Modal/AddPersonModal";
import EditPersonModal from "@/components/Modal/EditPersonModal";
import PageContent from "@/components/PageContent";
import useMainLayoutContext from "@/hooks/useMainLayoutContext";
import { Person } from "@/store/createPeopleSlice";
import useHiLogStore from "@/store/useHiLogStore";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import "./index.css";

const PeopleList = () => {
  const { t } = useTranslation();
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editPerson, setEditPerson] = useState<Person>();
  const { setRightMenu } = useMainLayoutContext();

  const [getPeople, addPerson, updatePerson, selectedLog] = useHiLogStore(
    useShallow((state) => [
      state.getPeople,
      state.addPerson,
      state.updatePerson,
      state.selectedLog,
    ])
  );

  const { id: logId } = selectedLog || {};

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const people = selectedLog ? getPeople({ logId: logId || "" }) : [];

  const isPeopleEmpty = isEmpty(people);

  const handleAddModalClick = () => {
    setAddModalOpen(true);
  };

  const handleAddPerson = (values: FieldValues) => {
    const { name } = values;

    if (logId) {
      addPerson({
        logId,
        name,
      });
    }
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalOpen = (sheet: Person) => {
    setEditPerson(sheet);
  };

  const handleEditModalClose = () => {
    setEditPerson(undefined);
  };

  const handleEditPerson = (values: FieldValues) => {
    if (selectedLog && editPerson) {
      const { name } = values;

      updatePerson({
        logId: selectedLog.id,
        personId: editPerson.id,
        name,
      });
    }
  };

  const renderRightMenu = useCallback(() => {
    let menu: JSX.Element[] = [];

    menu = [
      <IconButton
        icon={<IoAddCircleOutline />}
        onClick={() => handleAddModalClick()}
      />,
    ];

    setRightMenu(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPeopleEmpty]);

  useEffect(() => {
    renderRightMenu();
  }, [renderRightMenu]);

  return (
    <div>
      {logId ? (
        <>
          {isPeopleEmpty && <EmptyMessage msgKey="people empty" />}

          <PageContent>
            <div className="sheets-list-container">
              {logId &&
                people?.map((person, index) => (
                  <PersonCard
                    ref={(ref) => {
                      if (ref) {
                        cardRefs.current[index] = ref;
                      }
                    }}
                    key={person.id}
                    data={person}
                    onEdit={handleEditModalOpen}
                  />
                ))}
            </div>

            {isPeopleEmpty && (
              <Button
                icon={<IoAddCircleOutline />}
                onClick={handleAddModalClick}
                compact={false}
              >
                {t("add person")}
              </Button>
            )}
          </PageContent>

          {addModalOpen && (
            <AddPersonModal
              open={addModalOpen}
              onClose={() => handleAddModalClose()}
              onSubmit={handleAddPerson}
            />
          )}

          {!!editPerson && (
            <EditPersonModal
              open={!!editPerson}
              onClose={() => handleEditModalClose()}
              onSubmit={handleEditPerson}
              person={editPerson}
            />
          )}
        </>
      ) : (
        <EmptyMessage
          component={
            <Trans
              i18nKey={t("no log selected")}
              t={t}
              components={[<Link to={"/logs"}>Logs</Link>]}
            />
          }
        />
      )}
    </div>
  );
};

export default PeopleList;
