import { Star } from "lucide-react";
import { useState } from "react";

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
