import api from "./api";

export const getAdminToppings = async () => {
  const res = await api.get("/admin/toppings");
  return res.data;
};

export const createAdminTopping = async (data) => {
  const res = await api.post("/admin/toppings", data);
  return res.data;
};

export const updateAdminTopping = async (id, data) => {
  const res = await api.put(`/admin/toppings/${id}`, data);
  return res.data;
};

export const toggleAdminTopping = async (id) => {
  const res = await api.patch(`/admin/toppings/${id}/toggle`);
  return res.data;
};
