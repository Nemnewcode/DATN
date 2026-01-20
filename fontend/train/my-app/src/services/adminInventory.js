import api from "./api";

export const getInventories = async () => {
  const res = await api.get("/admin/inventories");
  return res.data;
};

export const updateInventory = async (productId, quantity) => {
  const res = await api.put(`/admin/inventories/${productId}`, quantity, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const toggleInventory = async (productId) => {
  const res = await api.patch(`/admin/inventories/${productId}/toggle`);
  return res.data;
};
