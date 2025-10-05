import { useParams } from "react-router-dom";
import { useFetchData } from "../hooks/useFetchData";

function DetailProduct() {
  // fetch data menu
  const { data, isLoading, error } = useFetchData("/data/menu.json");
  const { id: idMenu } = useParams();
  const menu = data.find((menu) => menu.id === parseInt(idMenu));

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return <div>{menu.name}</div>;
}

export default DetailProduct;
