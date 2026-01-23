import React, { useEffect, useState } from "react";
import {
  getInventories,
  updateInventory,
  toggleInventory,
} from "../../services/adminInventory";
import { FiBox, FiAlertTriangle, FiCheckCircle, FiPower, FiRefreshCw, FiDatabase, FiTag } from "react-icons/fi";
import Toast from "../../components/Toast"; // Đảm bảo đúng đường dẫn component Toast

const Inventory = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("Ingredient");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  useEffect(() => {
    loadData();
  }, [type]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getInventories(type);
      setData(res);
    } catch (error) {
      showNotification("❌ Lỗi tải dữ liệu tồn kho");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, qty) => {
    try {
      await updateInventory(id, Number(qty));
      showNotification("✅ Đã cập nhật số lượng tồn kho");
      loadData();
    } catch (error) {
      showNotification("❌ Cập nhật thất bại");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await toggleInventory(id);
      showNotification(currentStatus ? "🔒 Đã tạm ngưng theo dõi" : "🔓 Đã kích hoạt theo dõi");
      loadData();
    } catch (error) {
      showNotification("❌ Không thể đổi trạng thái");
    }
  };

  if (loading && data.length === 0) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-orange-100 border-t-[#4A2C2A] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-700 text-left relative">
      {/* HIỂN THỊ TOAST */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: "" })} 
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-orange-100 pb-8">
        <div>
          <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Vận hành kho hàng</span>
          <h1 className="text-4xl font-black text-[#4A2C2A] tracking-tighter uppercase italic leading-none flex items-center gap-4">
            Quản lý <span className="text-[#a06b49]">Tồn kho</span>
          </h1>
        </div>

        {/* FILTER TABS */}
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-orange-50">
          <button
            onClick={() => setType("Ingredient")}
            className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              type === "Ingredient"
                ? "bg-[#4A2C2A] text-[#FFDBB6] shadow-lg shadow-[#4A2C2A]/20"
                : "text-gray-400 hover:text-[#4A2C2A]"
            }`}
          >
            <FiDatabase /> Nguyên liệu
          </button>
          <button
            onClick={() => setType("Topping")}
            className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              type === "Topping"
                ? "bg-[#4A2C2A] text-[#FFDBB6] shadow-lg shadow-[#4A2C2A]/20"
                : "text-gray-400 hover:text-[#4A2C2A]"
            }`}
          >
            <FiTag /> Topping
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-orange-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.3em]">
                <th className="p-8">Vật tư / Loại</th>
                <th className="p-8 text-center">Mã quản lý</th>
                <th className="p-8 text-center">Số lượng tồn</th>
                <th className="p-8 text-center">Đơn vị</th>
                <th className="p-8 text-center">Cảnh báo</th>
                <th className="p-8 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-24 text-center text-gray-400 italic font-medium">Không tìm thấy dữ liệu vật tư...</td>
                </tr>
              ) : (
                data.map((i) => (
                  <tr key={i.id} className={`hover:bg-orange-50/30 transition-all group ${!i.is_active ? 'opacity-50' : ''}`}>
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${i.quantity <= i.min_quantity ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-orange-50 text-[#a06b49] border-orange-100'}`}>
                          <FiBox size={20} />
                        </div>
                        <div>
                          <p className="font-black text-[#4A2C2A] text-lg tracking-tight leading-none uppercase">{i.item_type}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Hệ thống kho vận</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-8 text-center">
                      <span className="font-black text-gray-300 tracking-tighter">#{i.item_id}</span>
                    </td>

                    <td className="p-8 text-center">
                      <div className="relative inline-block group/input">
                        <input
                          type="number"
                          defaultValue={i.quantity}
                          className={`w-28 bg-gray-50 border-2 rounded-xl p-3 text-center font-black text-[#4A2C2A] transition-all outline-none focus:ring-2 focus:ring-[#FFDBB6] ${i.quantity <= i.min_quantity ? 'border-rose-200' : 'border-transparent'}`}
                          onBlur={(e) => handleUpdate(i.id, e.target.value)}
                          disabled={!i.is_active}
                        />
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover/input:opacity-100 transition-opacity">
                            <FiRefreshCw className="text-[#a06b49] animate-spin-slow bg-white rounded-full p-0.5 shadow-sm" />
                        </div>
                      </div>
                    </td>

                    <td className="p-8 text-center">
                      <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">
                        {i.unit}
                      </span>
                    </td>

                    <td className="p-8 text-center">
                      {i.quantity <= i.min_quantity ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100 animate-pulse">
                          <FiAlertTriangle /> Sắp hết hàng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <FiCheckCircle /> Ổn định
                        </span>
                      )}
                    </td>

                    <td className="p-8 text-right">
                      <button
                        onClick={() => handleToggle(i.id, i.is_active)}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm ${
                          i.is_active 
                          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white" 
                          : "bg-gray-100 text-gray-400 hover:bg-[#4A2C2A] hover:text-[#FFDBB6]"
                        }`}
                        title={i.is_active ? "Tắt theo dõi" : "Bật theo dõi"}
                      >
                        <FiPower size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-8 flex items-center gap-3 opacity-40">
          <div className="h-[1px] w-8 bg-[#4A2C2A]"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4A2C2A]">Hệ thống tự động cập nhật mỗi khi có đơn hàng</p>
          <div className="h-[1px] w-8 bg-[#4A2C2A]"></div>
      </div>
    </div>
  );
};

export default Inventory;