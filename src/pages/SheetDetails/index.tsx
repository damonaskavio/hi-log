import PageContent from "@/components/PageContent";
import { useParams } from "react-router-dom";

const SheetDetails = () => {
  const params = useParams();
  console.log("params", params);
  return (
    <div>
      <PageContent></PageContent>
    </div>
  );
};

export default SheetDetails;
