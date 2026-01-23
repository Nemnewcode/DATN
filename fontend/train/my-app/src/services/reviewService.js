import api from "./api";

export const createReview = (data) =>
  api.post("/reviews", data);

export const getProductReviews = (productId) =>
  api.get(`/reviews/product/${productId}`).then(res => res.data);

export const getAdminReviews = () =>
  api.get("/reviews/admin").then(res => res.data);

export const approveReview = (id) =>
  api.put(`/reviews/${id}/approve`);
