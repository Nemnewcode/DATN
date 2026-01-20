import api from "./api";

export const getTableReservations = async () => {
  const res = await api.get("/admin/table-reservations");
  return res.data;
};

export const approveReservation = async (id) => {
  return api.put(`/admin/table-reservations/${id}/approve`);
};

export const rejectReservation = async (id) => {
  return api.put(`/admin/table-reservations/${id}/reject`);
};
