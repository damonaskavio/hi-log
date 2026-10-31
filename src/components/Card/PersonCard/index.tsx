import { Person } from "@/store/createPeopleSlice";
import { forwardRef } from "react";
import Card from "..";
import "./index.css";

type PersonCardOptions = {
  data: Person;
  onEdit?: (person: Person) => void;
};

const PersonCard = forwardRef<HTMLDivElement, PersonCardOptions>(
  ({ data, onEdit }, ref) => {
    const { name } = data;

    return (
      <div className="person-card-root">
        <Card
          ref={ref}
          className="person-card"
          title={name}
          editable={true}
          onEdit={() => onEdit?.(data)}
        >
          <div className="content">
            <div className="desc">{name}</div>
          </div>
        </Card>
      </div>
    );
  }
);

export default PersonCard;
