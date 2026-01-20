import api from "./api";

export const getDiscounts = async () => {
  const res = await api.get("/admin/discounts");
  return res.data;
};

export const createDiscount = async (data) => {
  const res = await api.post("/admin/discounts", data);
  return res.data;
};

export const updateDiscount = async (id, data) => {
  const res = await api.put(`/admin/discounts/${id}`, data);
  return res.data;
};

export const toggleDiscount = async (id) => {
  const res = await api.patch(`/admin/discounts/${id}/toggle`);
  return res.data;
};
