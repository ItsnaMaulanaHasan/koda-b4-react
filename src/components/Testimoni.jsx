import { useState } from "react";
import { useFetchData } from "../hooks/useFetchData";
import StarRating from "./StarRating";

/**
 * Testimoni component for displaying customer testimonials in a carousel
 * @returns {JSX.Element} Testimoni component with customer reviews, images, ratings, and navigation
 */
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
    <div className="flex flex-col md:flex-row">
      <div className="mb-5 font-normal text-center text-white uppercase md:hidden">
        Testimonial
      </div>
      <div className="md:size-100 size-full">
        <img
          className="object-cover w-full h-full"
          src={data[currentIndex].image}
          alt={data[currentIndex].name}
        />
      </div>
      <div className="flex flex-col flex-1 gap-5 mt-5 text-white md:px-10 md:mt-0">
        <div className="hidden font-normal uppercase md:block">Testimonial</div>
        <div className="sm:text-3xl md:text-4xl lg:text-5xl text-2xl font-medium border-l-5 border-[#5a8120] p-3">
          {data[currentIndex].name}
        </div>
        <div className="mt-3 text-[#5a8120]">{data[currentIndex].position}</div>
        <p>{data[currentIndex].testimonial}</p>
        <StarRating rating={data[currentIndex].rating} readonly={true} />
        <div className="flex flex-col gap-5">
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center text-black transition bg-white rounded-full size-10 hover:bg-gray-200">
              ←
            </button>
            <button
              onClick={handleNext}
              className="size-10 rounded-full bg-[#5a8120] text-black flex items-center justify-center hover:bg-[#b9c228] transition">
              →
            </button>
          </div>
          <div className="flex gap-2">
            {data.slice(0, dataMax).map((data, index) => (
              <button
                key={data.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === currentIndex ? "bg-[#5a8120] w-7" : "bg-gray-500"
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
