import { Star } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * StarRating component for displaying and interacting with star ratings
 * @param {Object} props - Component props
 * @param {number} [props.rating=0] - Current rating value
 * @param {number} [props.maxStars=5] - Maximum number of stars to display
 * @param {Function} [props.onRatingChange] - Callback function when rating changes
 * @param {boolean} [props.readonly=false] - Whether the rating is read-only (non-interactive)
 * @param {number} [props.size=20] - Size of star icons in pixels
 * @param {boolean} [props.allowHalf=true] - Whether to allow half-star ratings
 * @returns {JSX.Element} StarRating component with interactive or display-only stars
 */
function StarRating({
  rating = 0,
  maxStars = 5,
  onRatingChange,
  readonly = false,
  size = 20,
  allowHalf = true,
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleClick = (starValue) => {
    if (readonly) return;
    setCurrentRating(starValue);
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleMouseEnter = (starValue) => {
    if (readonly) return;
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || currentRating;

  const getStarFill = (starIndex) => {
    const diff = displayRating - starIndex;

    if (diff >= 1) {
      return "full";
    } else if (diff > 0 && diff < 1 && allowHalf) {
      return "partial";
    } else {
      return "empty";
    }
  };

  return (
    <div className="flex gap-4">
      {[...Array(maxStars)].map((_, index) => {
        const fillType = getStarFill(index);
        const starValue = index + 1;

        return (
          <div key={index} className="relative">
            {fillType === "partial" ? (
              <>
                <Star
                  size={size}
                  fill="none"
                  stroke="#FF8906"
                  className="text-[#FF8906] absolute top-0 left-0"
                />
                <Star
                  size={size}
                  fill="#FF8906"
                  stroke="#FF8906"
                  className={`text-[#FF8906] ${
                    !readonly
                      ? "cursor-pointer transition-all hover:scale-110"
                      : ""
                  }`}
                  style={{
                    clipPath: `inset(0 ${
                      100 - (displayRating - index) * 100
                    }% 0 0)`,
                  }}
                  onClick={() => handleClick(starValue)}
                  onMouseEnter={() => handleMouseEnter(starValue)}
                  onMouseLeave={handleMouseLeave}
                />
              </>
            ) : (
              <Star
                size={size}
                fill={fillType === "full" ? "#FF8906" : "none"}
                stroke="#FF8906"
                className={`text-[#FF8906] ${
                  !readonly
                    ? "cursor-pointer transition-all hover:scale-110"
                    : ""
                }`}
                onClick={() => handleClick(starValue)}
                onMouseEnter={() => handleMouseEnter(starValue)}
                onMouseLeave={handleMouseLeave}
              />
            )}
          </div>
        );
      })}
      <span>{rating.toFixed(1)}</span>
    </div>
  );
}

export default StarRating;
