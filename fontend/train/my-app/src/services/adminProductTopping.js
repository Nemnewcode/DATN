import api from "./api";

export const getProductToppings = async (productId) => {
  const res = await api.get(`/admin/product-toppings/${productId}`);
  return res.data;
};

export const updateProductToppings = async (productId, toppingIds) => {
  const res = await api.post(
    `/admin/product-toppings/${productId}`,
    toppingIds
  );
  return res.data;
};
