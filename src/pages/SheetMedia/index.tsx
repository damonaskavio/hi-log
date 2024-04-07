import PageContent from "@/components/PageContent";
import { useParams } from "react-router-dom";

const SheetMedia = () => {
  const params = useParams();
  console.log("media params", params);
  return (
    <div>
      <PageContent></PageContent>
    </div>
  );
};

export default SheetMedia;
