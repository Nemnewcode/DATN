import api from "./api";

export const getAdminOrders = async () => {
  const res = await api.get("/admin/orders");
  return res.data;
};

export const confirmAdminOrder = async (id) => {
  const res = await api.put(`/admin/orders/${id}/confirm`);
  return res.data;
};

export const cancelAdminOrder = async (id) => {
  const res = await api.put(`/admin/orders/${id}/cancel`);
  return res.data;
};

export const completeAdminOrder = async (id) => {
  const res = await api.put(`/admin/orders/${id}/complete`);
  return res.data;
};
export const getAdminOrderTimeline = async (orderId) => {
  const res = await api.get(`/admin/orders/${orderId}/timeline`);
  return res.data;
};