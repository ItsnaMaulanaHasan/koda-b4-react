import { useEffect, useState } from "react";

/**
 * PriceRangeFilter component for filtering items by price range using dual sliders
 * @param {Object} props - Component props
 * @param {Function} props.onPriceChange - Callback function triggered when price range changes
 * @param {number} [props.defaultMin=0] - Default minimum price value
 * @param {number} [props.defaultMax=1000000] - Default maximum price value
 * @returns {JSX.Element} PriceRangeFilter component with dual range sliders
 */
function PriceRangeFilter({
  onPriceChange,
  defaultMin = 0,
  defaultMax = 1000000,
}) {
  const [minPrice, setMinPrice] = useState(defaultMin);
  const [maxPrice, setMaxPrice] = useState(defaultMax);
  const absoluteMin = 0;
  const absoluteMax = 1000000;

  useEffect(() => {
    if (onPriceChange) {
      onPriceChange({ minPrice, maxPrice });
    }
  }, [minPrice, maxPrice, onPriceChange]);

  return (
    <div className="mt-5 flex flex-col gap-4">
      <label className="font-semibold">Price Range</label>

      {/* Range Slider Container */}
      <div className="relative h-6 flex items-center">
        {/* Track Background */}
        <div className="absolute w-full h-2 bg-gray-300 rounded"></div>

        {/* Active Track */}
        <div
          className="absolute h-2 bg-[#5a8120] rounded"
          style={{
            left: `${(minPrice / absoluteMax) * 100}%`,
            right: `${100 - (maxPrice / absoluteMax) * 100}%`,
          }}></div>

        {/* Min Range Input */}
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={minPrice}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), maxPrice - 1);
            setMinPrice(value);
          }}
          className="absolute w-full h-1 pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:-mt-0.5 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border-0"
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={maxPrice}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), minPrice + 1);
            setMaxPrice(value);
          }}
          className="absolute w-full h-1 pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:-mt-0.5 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border-0"
        />
      </div>

      {/* Price Labels */}
      <div className="flex justify-between text-sm">
        <span>Idr.{minPrice.toLocaleString("id")}</span>
        <span>Idr.{maxPrice.toLocaleString("id")}</span>
      </div>
    </div>
  );
}

export default PriceRangeFilter;
