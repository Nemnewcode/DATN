import React, { useEffect, useState } from "react";
import {
  getInventories,
  updateInventory,
  toggleInventory,
} from "../../services/adminInventory";

const Inventory = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getInventories();
    setData(res);
  };

  const handleUpdate = async (id, qty) => {
    await updateInventory(id, Number(qty));
    loadData();
  };

  const handleToggle = async (id) => {
    await toggleInventory(id);
    loadData();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý tồn kho</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Sản phẩm</th>
            <th className="p-3 border">Giá</th>
            <th className="p-3 border">Số lượng</th>
            <th className="p-3 border">Theo dõi kho</th>
            <th className="p-3 border">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {data.map((i) => (
            <tr key={i.product_id}>
              <td className="p-3 border">{i.product_name}</td>

              <td className="p-3 border text-right">
                {Number(i.price).toLocaleString("vi-VN")}₫
              </td>

              <td className="p-3 border text-center">
                <input
                  type="number"
                  defaultValue={i.quantity ?? 0}
                  className="border w-24 px-2 py-1"
                  onBlur={(e) =>
                    handleUpdate(i.product_id, e.target.value)
                  }
                  disabled={!i.is_tracking}
                />
              </td>

              <td className="p-3 border text-center">
                {i.is_tracking ? "✔️" : "❌"}
              </td>

              <td className="p-3 border text-center">
                <button
                  onClick={() => handleToggle(i.product_id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  {i.is_tracking ? "Tắt" : "Bật"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
