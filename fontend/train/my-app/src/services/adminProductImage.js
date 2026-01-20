import api from "./api";

/* ================= ADD IMAGE ================= */
export const addProductImage = (productId, data) => {
  return api.post(`/admin/product-images/${productId}`, data);
};

/* ================= SET MAIN IMAGE ================= */
export const setMainImage = (imageId) => {
  return api.patch(`/admin/product-images/${imageId}/main`);
};

/* ================= DELETE IMAGE ================= */
export const deleteProductImage = (imageId) => {
  return api.delete(`/admin/product-images/${imageId}`);
};

/* ================= TOGGLE IMAGE ACTIVE (OPTIONAL) ================= */
export const toggleImage = (imageId) => {
  return api.patch(`/admin/product-images/${imageId}/toggle`);
};
