import api from "./api";

// GET profile
export const getProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};


export const updateProfile = async (data) => {
  return api.put("/user/profile", {
    name: data.name,
    phone: data.phone,
    address: data.address,
  });
};
