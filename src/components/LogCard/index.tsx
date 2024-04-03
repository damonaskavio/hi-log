import { Log } from "@/store/useLogStore";
import "./index.css";

const LogCard = ({ log }: { log: Log }) => {
  const { name, updatedAt } = log;

  return (
    <div className="log-card-root">
      <p className="name">{name}</p>
      <p className="date">{updatedAt.toLocaleString()}</p>
    </div>
  );
};

export default LogCard;
