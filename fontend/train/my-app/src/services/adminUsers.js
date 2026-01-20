import api from "./api";

export const getAdminUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const createAdminUser = async (data) => {
  const res = await api.post("/admin/users", data);
  return res.data;
};

export const updateAdminUser = async (id, data) => {
  const res = await api.put(`/admin/users/${id}`, data);
  return res.data;
};

export const toggleAdminUser = async (id) => {
  const res = await api.put(`/admin/users/${id}/toggle`);
  return res.data;
};
