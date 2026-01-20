import axios from "axios";

export const applyDiscount = async (code, orderTotal) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    "http://localhost:5000/api/discounts/apply",
    {
      code,
      order_total: orderTotal,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
