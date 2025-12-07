import { useState } from "react";
import { useFetchData } from "../hooks/useFetchData";

/**
 * PromoSection component for displaying promotional offers in a carousel
 * @returns {JSX.Element} PromoSection component with carousel navigation and indicators
 */
function PromoSection() {
  const { data, isLoading, error } = useFetchData("/data/cupon.json");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-[#5a8120] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="p-8 text-center border border-red-200 rounded-lg bg-red-50">
          <img src="/icon/icon-warning.svg" alt="Icon Warning" />
          <p className="font-medium text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  // handle button pagination
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  // handle touch swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <h1 className="text-xl font-medium sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          Today <span className="text-[#5a8120]">Promo</span>
        </h1>
        <div className="hidden gap-3 md:flex">
          <button
            onClick={handlePrev}
            className="size-10 rounded-full bg-[#E8E8E8] text-black flex items-center justify-center hover:bg-gray-200 transition">
            ←
          </button>
          <button
            onClick={handleNext}
            className="size-10 rounded-full bg-[#5a8120] text-black flex items-center justify-center hover:bg-[#b9c228] transition">
            →
          </button>
        </div>
      </div>
      <div
        className="flex gap-4 mt-6 overflow-hidden sm:gap-6 md:gap-8 lg:gap-10 sm:mt-8 md:mt-10"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out sm:gap-6 md:gap-8 lg:gap-10"
          style={{
            transform: `translateX(-${currentIndex * (100 / 3 + 3.33)}%)`,
          }}>
          {data.map((promo) => (
            <div
              key={promo.id}
              className="flex gap-3 rounded-2xl pt-4 px-4 pb-0  min-w-[calc(33.333%-2.67rem)] max-w-120 flex-shrink-0 text-black sm:gap-4 md:gap-5 sm:pt-5 sm:px-5 md:px-7"
              style={{
                backgroundColor: promo.bgColor,
              }}>
              <div className="self-end flex-shrink-0">
                <img
                  className="object-contain w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
                  src={promo.image}
                  alt={promo.title}
                />
              </div>
              <div className="flex flex-col gap-1 py-2 sm:gap-2 sm:py-3">
                <h2 className="text-base font-bold leading-tight sm:text-lg">
                  {promo.title}
                </h2>
                <p className="text-xs leading-snug sm:text-sm">
                  {promo.description}
                </p>
                <button className="mt-auto mb-2 text-xs font-medium text-left text-white cursor-pointer sm:mb-3 sm:text-sm">
                  {promo.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-6 sm:mt-8 md:mt-10 ps-4 sm:ps-8 md:ps-12 lg:ps-16 xl:ps-20">
        {data.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition ${
              index === currentIndex ? "bg-[#5a8120] w-7" : "bg-[#DDE0E4] w-2"
            }`}
          />
        ))}
      </div>
    </>
  );
}

export default PromoSection;
