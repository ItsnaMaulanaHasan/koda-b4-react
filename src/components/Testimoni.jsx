import { useFetchData } from "../hooks/useFetchData";
import StarRating from "./StarRating";

function Testimoni() {
  const { data, isLoading, error } = useFetchData("data/testimoni.json");
  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;
  return (
    <div className="flex">
      <div className="w-100 h-100">
        <img
          className="h-full w-full object-cover"
          src={data[1].image}
          alt={data[1].name}
        />
      </div>
      <div className="flex-1 px-10 flex flex-col gap-7 text-white">
        <div className="font-normal uppercase">Testimonial</div>
        <div>
          <div className="text-5xl font-medium border-l-5 border-[#FF8906] p-3">
            {data[1].name}
          </div>
          <div className="mt-3 text-[#FF8906]">{data[1].position}</div>
        </div>
        <p>{data[0].testimonial}</p>
        <StarRating rating={data[0].rating} readonly={true} />
      </div>
    </div>
  );
}

export default Testimoni;
