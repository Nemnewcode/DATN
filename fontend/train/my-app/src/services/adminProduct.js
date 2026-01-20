import api from "./api";

export const getAdminProducts = async () => {
  const res = await api.get("/admin/products");
  return res.data;
};

export const createAdminProduct = async (data) => {
  const res = await api.post("/admin/products", data);
  return res.data;
};

export const updateAdminProduct = async (id, data) => {
  const res = await api.put(`/admin/products/${id}`, data);
  return res.data;
};

export const deleteAdminProduct = async (id) => {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
};
