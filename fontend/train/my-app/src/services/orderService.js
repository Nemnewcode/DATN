import api from "./api";

/**
 * Tạo đơn hàng (có hoặc không có discount)
 */
export const createOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data;
};

/**
 * Lấy đơn hàng của user
 */
export const getMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};
export const getOrderTimeline = async (orderId) => {
  const res = await api.get(`/orders/${orderId}/timeline`);
  return res.data;
};
export const cancelOrder = async (orderId) => {
  const res = await api.patch(`/orders/${orderId}/cancel`);
  return res.data;
};