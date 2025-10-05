import { useState } from "react";
import { useFetchData } from "../hooks/useFetchData";
import StarRating from "./StarRating";

function Testimoni() {
  const { data, isLoading, error } = useFetchData("/data/testimoni.json");
  const [currentIndex, setCurrentIndex] = useState(0);
  const dataMax = 5;

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? dataMax - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === dataMax - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex">
      <div className="w-100 h-100">
        <img
          className="h-full w-full object-cover"
          src={data[currentIndex].image}
          alt={data[currentIndex].name}
        />
      </div>
      <div className="flex-1 px-10 flex flex-col gap-7 text-white">
        <div className="font-normal uppercase">Testimonial</div>
        <div>
          <div className="text-5xl font-medium border-l-5 border-[#FF8906] p-3">
            {data[currentIndex].name}
          </div>
          <div className="mt-3 text-[#FF8906]">
            {data[currentIndex].position}
          </div>
        </div>
        <p>{data[currentIndex].testimonial}</p>
        <StarRating rating={data[currentIndex].rating} readonly={true} />
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              className="size-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="size-10 rounded-full bg-[#FF8906] text-black flex items-center justify-center hover:bg-[#e67a05] transition"
            >
              →
            </button>
          </div>
          <div className="flex gap-2 ml-3">
            {data.slice(0, dataMax).map((data, index) => (
              <button
                key={data.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === currentIndex ? "bg-[#FF8906] w-7" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimoni;
