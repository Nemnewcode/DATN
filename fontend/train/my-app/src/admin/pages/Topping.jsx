import React, { useEffect, useState } from "react";
import {
  getAdminToppings,
  createAdminTopping,
  updateAdminTopping,
  toggleAdminTopping,
} from "../../services/adminTopping";
import { FiPlus, FiEdit3, FiRefreshCw, FiCheck, FiX, FiLayers, FiDollarSign, FiSave, FiAlertCircle } from "react-icons/fi";
import Toast from "../../components/Toast";

const Topping = () => {
  const [toppings, setToppings] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    apply_for: "drink",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Trạng thái thông báo Toast
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    loadToppings();
  }, []);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const loadToppings = async () => {
    setLoading(true);
    try {
      const data = await getAdminToppings();
      setToppings(data);
    } catch (error) {
      showNotification("❌ Không thể tải danh sách Topping");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAdminTopping(editingId, form);
        showNotification("✅ Đã cập nhật Topping thành công!");
      } else {
        await createAdminTopping(form);
        showNotification("🎉 Đã thêm Topping mới!");
      }
      setForm({ name: "", price: "", apply_for: "drink" });
      setEditingId(null);
      loadToppings();
    } catch (error) {
      showNotification("❌ Lỗi hệ thống khi lưu dữ liệu");
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      price: t.price,
      apply_for: t.apply_for,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await toggleAdminTopping(id);
      showNotification(currentStatus ? "👁️ Đã tạm ngưng Topping" : "✅ Đã kích hoạt Topping");
      loadToppings();
    } catch (error) {
      showNotification("❌ Không thể thay đổi trạng thái");
    }
  };

  if (loading && toppings.length === 0) return (
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
      <div className="mb-10 border-b border-orange-100 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Cấu hình Menu</span>
          <h1 className="text-4xl font-black text-[#4A2C2A] tracking-tighter uppercase italic flex items-center gap-4 leading-none">
            Quản lý <span className="text-[#a06b49]">Topping</span>
          </h1>
        </div>
        <p className="text-gray-400 text-sm font-medium italic">Tổng cộng {toppings.length} loại topping</p>
      </div>

      {/* FORM SECTION */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-orange-50 mb-12 relative overflow-hidden group transition-all hover:shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFDBB6]/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>
        
        <h2 className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-[0.3em] mb-8 flex items-center gap-3 relative z-10">
          <div className={`p-2 rounded-lg ${editingId ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
            {editingId ? <FiEdit3 /> : <FiPlus />}
          </div>
          {editingId ? "Chỉnh sửa thông tin" : "Thêm loại mới"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên Topping</label>
            <input
              placeholder="VD: Trân châu đường đen"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phụ thu (₫)</label>
            <div className="relative">
              <FiDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a06b49]" />
              <input
                type="number"
                placeholder="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-gray-50 border-none pl-12 p-5 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Áp dụng cho</label>
            <select
              value={form.apply_for}
              onChange={(e) => setForm({ ...form, apply_for: e.target.value })}
              className="w-full bg-gray-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A] cursor-pointer appearance-none"
            >
              <option value="drink">Đồ uống (chung)</option>
              <option value="coffee">Cà phê</option>
              <option value="juice">Nước ép</option>
              <option value="all">Tất cả danh mục</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className={`w-full h-16 flex items-center justify-center gap-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
              editingId 
                ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700" 
                : "bg-[#4A2C2A] text-[#FFDBB6] shadow-[#4A2C2A]/30 hover:bg-black"
            }`}>
              {editingId ? <FiSave size={18} /> : <FiPlus strokeWidth={3} size={18} />}
              {editingId ? "Cập nhật" : "Tạo Topping"}
            </button>
          </div>
        </form>
      </section>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-orange-50 overflow-hidden mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.3em]">
              <th className="p-8">Thông tin Topping</th>
              <th className="p-8">Giá phụ thu</th>
              <th className="p-8">Áp dụng cho</th>
              <th className="p-8 text-center">Trạng thái</th>
              <th className="p-8 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {toppings.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-24 text-center text-gray-400 italic font-medium">
                  Chưa có loại topping nào được tạo...
                </td>
              </tr>
            ) : (
              toppings.map((t) => (
                <tr key={t.id} className="hover:bg-orange-50/30 transition-all group">
                  <td className="p-8">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-[#4A2C2A] text-lg tracking-tight leading-none group-hover:text-[#a06b49] transition-colors">{t.name}</span>
                      <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">UID: #{t.id}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="text-xl font-black text-[#4A2C2A] italic tracking-tighter">
                      {Number(t.price).toLocaleString()}₫
                    </span>
                  </td>
                  <td className="p-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#a06b49] bg-orange-50 px-4 py-1.5 rounded-lg border border-orange-100">
                      {t.apply_for}
                    </span>
                  </td>
                  <td className="p-8 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                      t.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-400 border-gray-100"
                    }`}>
                      {t.is_active ? <FiCheck strokeWidth={3} /> : <FiX strokeWidth={3} />}
                      {t.is_active ? "Sẵn sàng" : "Đang tắt"}
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(t)}
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#4A2C2A] hover:text-[#FFDBB6] transition-all shadow-sm"
                        title="Sửa Topping"
                      >
                        <FiEdit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleToggle(t.id, t.is_active)}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm ${
                          t.is_active 
                          ? "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white" 
                          : "bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                        }`}
                        title={t.is_active ? "Tạm ngưng" : "Kích hoạt"}
                      >
                        <FiRefreshCw size={18} className={t.is_active ? "" : "animate-spin-slow"} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Topping;