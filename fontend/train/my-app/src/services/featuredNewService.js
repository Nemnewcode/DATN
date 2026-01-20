import api from "./api";

export const getFeaturedNews = async () => {
  const res = await api.get("/featured-news");
  return res.data;
};
export const getFeaturedNewsBySlug = async (slug) => {
  const res = await api.get(`/featured-news/${slug}`);
  return res.data;
};