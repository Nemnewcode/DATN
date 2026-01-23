import { useEffect, useState } from "react";
import { getAdminReviews, approveReview } from "../../services/reviewService";

const Review = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getAdminReviews().then(setReviews);
  }, []);

  const handleApprove = async (id) => {
    await approveReview(id);
    setReviews(prev =>
      prev.map(r => r.id === id ? { ...r, is_approved: true } : r)
    );
  };

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Người dùng</th>
          <th>⭐</th>
          <th>Nhận xét</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map(r => (
          <tr key={r.id}>
            <td>{r.product_name}</td>
            <td>{r.user_name}</td>
            <td>{r.rating}</td>
            <td>{r.comment}</td>
            <td>
              {r.is_approved ? "Đã duyệt" : (
                <button onClick={() => handleApprove(r.id)}>
                  Duyệt
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Review;
