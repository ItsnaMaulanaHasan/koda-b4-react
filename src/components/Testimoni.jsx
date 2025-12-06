import { useEffect, useState } from "react";
import { useFetchData } from "../hooks/useFetchData";

/**
 * Testimoni component for displaying customer testimonials in a carousel
 * @returns {JSX.Element} Testimoni component with customer reviews, images, ratings, and navigation
 */
function Testimoni() {
  const { data, isLoading, error } = useFetchData("/data/testimoni.json");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dataMax = 5;
  const autoSlideInterval = 2000;

  useEffect(() => {
    if (!data || data.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.min(data.length, dataMax) - 1;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [data, dataMax, isPaused]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#5a8120] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center">
        <div className="p-8 text-center border border-red-200 rounded-lg bg-red-50">
          <img src="/icon/icon-warning.svg" alt="Icon Warning" />
          <p className="font-medium text-red-600">Error: {error}</p>
        </div>
      </div>
    );

  return (
    <div
      className="flex flex-col md:flex-row"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      <div className="flex flex-col flex-1 gap-5 mt-5 md:px-10 md:mt-0">
        <div className="text-xl font-bold uppercase md:block sm:text-2xl md:text-3xl">
          Customer <span className="text-[#5a8120]">Feedback</span>
        </div>
        <div className="mt-5 text-xl italic leading-relaxed md:text-2xl lg:text-3xl">
          <p>{data[currentIndex].testimonial}</p>
        </div>
        <div className="flex items-center gap-4 mt-auto">
          <div className="rounded-full size-20 overflow-clip">
            <img
              className="w-full h-full"
              src={data[currentIndex].image}
              alt={data[currentIndex].name}
            />
          </div>
          <div className="flex flex-col gap-2 font-medium ">
            <div className="text-base sm:text-lg md:text-xl">
              {data[currentIndex].name}
            </div>
            <div className="text-base sm:text-lg md:text-xl text-[#5a8120]">
              {data[currentIndex].position}
            </div>
          </div>
          {/* pagination testimoni */}
          <div className="flex flex-col gap-5 ml-auto">
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
      <div className="hidden md:block md:w-70 lg:w-100">
        <div className="overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src="/img/img-testimoni.png"
            alt="Happy Customer"
          />
        </div>
      </div>
    </div>
  );
}

export default Testimoni;
