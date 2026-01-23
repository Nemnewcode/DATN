export const getInventory = (type) =>
  api.get(`/admin/inventory?type=${type}`).then(res => res.data);

export const updateInventory = (id, quantity) =>
  api.put(`/admin/inventory/${id}`, { quantity });

export const importInventory = (id, amount) =>
  api.post(`/admin/inventory/${id}/import`, { amount });
