import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

const StarRating = ({ rating, onChange }: StarRatingProps) => {
  const handleClick = (index: number) => {
    onChange(index + 1);
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={24}
          className={`cursor-pointer ${
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default StarRating;
