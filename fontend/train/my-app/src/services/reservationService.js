import api from "./api";

// Đặt bàn
export const createReservation = async (data) => {
  const res = await api.post("/table-reservations", data);
  return res.data;
};

// Xem bàn đã đặt (user)
export const getMyReservations = async () => {
  const res = await api.get("/table-reservations/my");
  return res.data;
};
