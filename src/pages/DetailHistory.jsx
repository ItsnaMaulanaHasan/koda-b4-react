import { useParams } from "react-router-dom";

function DetailHistory() {
  const { noOrder } = useParams();
  return <div className="mt-20">{noOrder}</div>;
}

export default DetailHistory;
