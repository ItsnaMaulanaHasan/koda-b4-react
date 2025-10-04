import { Star } from "lucide-react";
import { useState } from "react";

function StarRating({
  rating = 0,
  maxStars = 5,
  onRatingChange,
  readonly = false,
  size = 20,
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

  return (
    <div className="flex gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;

        return (
          <Star
            key={index}
            size={size}
            fill={isFilled ? "#FFD700" : "none"}
            stroke="#FFD700"
            className={`text-yellow-400 ${
              !readonly ? "cursor-pointer transition-all hover:scale-110" : ""
            }`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
}

export default StarRating;
