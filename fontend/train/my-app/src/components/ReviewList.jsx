import { useEffect, useState } from "react";
import { getProductReviews } from "../services/reviewService";

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getProductReviews(productId).then(setReviews);
  }, [productId]);

  return (
    <div className="space-y-4">
      {reviews.map(r => (
        <div key={r.id} className="border rounded p-4">
          <p className="font-bold">{r.user_name}</p>
          <p>{"⭐".repeat(r.rating)}</p>
          <p className="text-sm text-gray-600">{r.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
