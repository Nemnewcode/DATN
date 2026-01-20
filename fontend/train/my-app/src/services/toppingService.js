import api from "./api";

export const getToppingsByProduct = async (productId) => {
  const res = await api.get(`/products/${productId}/toppings`);
  return res.data;
};
