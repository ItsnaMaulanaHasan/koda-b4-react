import { useState } from "react";
import { useFetchData } from "../hooks/useFetchData";

/**
 * PromoSection component for displaying promotional offers in a carousel
 * @returns {JSX.Element} PromoSection component with carousel navigation and indicators
 */
function PromoSection() {
  const { data, isLoading, error } = useFetchData("/data/cupon.json");
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };
  return (
    <>
      <div className="flex justify-between items-center px-20">
        <h1 className="font-medium text-5xl">
          Today <span className="text-[#8E6447]">Promo</span>
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            className="size-10 rounded-full bg-[#E8E8E8] text-black flex items-center justify-center hover:bg-gray-200 transition"
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
      </div>
      <div className="flex gap-10 mt-10 overflow-hidden ">
        <div
          className="flex gap-10 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / 3 + 3.33)}%)`,
          }}
        >
          {data.map((promo) => (
            <div
              key={promo.id}
              className="flex gap-5 rounded-2xl pt-5 px-7 pb-0 min-w-[calc(33.333%-2.67rem)] max-w-120 flex-shrink-0 text-black"
              style={{
                backgroundColor: promo.bgColor,
              }}
            >
              <div className="self-end flex-shrink-0">
                <img
                  className="w-28 h-28 object-contain"
                  src={promo.image}
                  alt={promo.title}
                />
              </div>
              <div className="flex flex-col gap-2 py-3">
                <h2 className="font-bold text-lg leading-tight">
                  {promo.title}
                </h2>
                <p className="text-sm leading-snug">{promo.description}</p>
                <button className="text-white mt-auto mb-3 text-left font-medium text-sm cursor-pointer">
                  {promo.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-10 ps-20">
        {data.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition ${
              index === currentIndex ? "bg-[#FF8906] w-7" : "bg-[#DDE0E4] w-2"
            }`}
          />
        ))}
      </div>
    </>
  );
}

export default PromoSection;
