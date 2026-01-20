import api from "./api";

// Lấy danh sách Featured News (ADMIN)
export const getFeaturedNews = async () => {
  const res = await api.get("/admin/featured-news");
  return res.data;
};

// Tạo mới Featured News
export const createFeaturedNews = async (data) => {
  const res = await api.post("/admin/featured-news", data);
  return res.data;
};

// Cập nhật Featured News
export const updateFeaturedNews = async (id, data) => {
  const res = await api.put(`/admin/featured-news/${id}`, data);
  return res.data;
};

// Xoá Featured News
export const deleteFeaturedNews = async (id) => {
  const res = await api.delete(`/admin/featured-news/${id}`);
  return res.data;
};
