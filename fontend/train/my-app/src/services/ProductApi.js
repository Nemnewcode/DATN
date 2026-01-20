const API_URL = "http://localhost:5041/api/products";

export const getProducts = async () => {
  const res = await fetch(API_URL);
  return res.json();
};
