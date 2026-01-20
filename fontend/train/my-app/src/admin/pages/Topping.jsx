import React, { useEffect, useState } from "react";
import {
  getAdminToppings,
  createAdminTopping,
  updateAdminTopping,
  toggleAdminTopping,
} from "../../services/adminTopping";
import { FiPlus, FiEdit3, FiRefreshCw, FiCheck, FiX, FiLayers, FiDollarSign, FiSave } from "react-icons/fi";

const Topping = () => {
  const [toppings, setToppings] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    apply_for: "drink",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToppings();
  }, []);

  const loadToppings = async () => {
    setLoading(true);
    try {
      const data = await getAdminToppings();
      setToppings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAdminTopping(editingId, form);
      } else {
        await createAdminTopping(form);
      }
      setForm({ name: "", price: "", apply_for: "drink" });
      setEditingId(null);
      loadToppings();
    } catch (error) {
      alert("❌ Có lỗi xảy ra khi lưu");
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

  const handleToggle = async (id) => {
    try {
      await toggleAdminTopping(id);
      loadToppings();
    } catch (error) {
      alert("❌ Không thể đổi trạng thái");
    }
  };

  if (loading && toppings.length === 0) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A2C2A]"></div>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-700 text-left">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#4A2C2A] tracking-tighter uppercase italic flex items-center gap-3">
          <FiLayers className="text-orange-400" /> Quản lý Topping
        </h1>
        <p className="text-gray-400 text-sm font-medium mt-1">
          Thiết lập các loại topping đi kèm cho đồ uống và món ăn
        </p>
      </div>

      {/* FORM SECTION */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-50 mb-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-50 transition-transform group-hover:scale-110"></div>
        
        <h2 className="text-sm font-black text-[#4A2C2A] uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
          {editingId ? <FiEdit3 className="text-blue-500" /> : <FiPlus className="text-emerald-500" />}
          {editingId ? "Cập nhật Topping" : "Thêm mới Topping"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 font-bold">Tên Topping</label>
            <input
              placeholder="Trân châu, Kem cheese..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 font-bold font-bold">Giá (₫)</label>
            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="number"
                placeholder="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 font-bold">Áp dụng cho</label>
            <select
              value={form.apply_for}
              onChange={(e) => setForm({ ...form, apply_for: e.target.value })}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A] cursor-pointer appearance-none"
            >
              <option value="drink">Đồ uống (chung)</option>
              <option value="coffee">Cà phê</option>
              <option value="juice">Nước ép</option>
              <option value="all">Tất cả</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className={`w-full h-[56px] flex items-center justify-center gap-2 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-all active:scale-95 ${
              editingId ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700" : "bg-[#4A2C2A] text-[#FFDBB6] shadow-[#4A2C2A]/20 hover:scale-105 hover:bg-black"
            }`}>
              {editingId ? <FiSave /> : <FiPlus strokeWidth={3} />}
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </section>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
              <th className="p-6">Tên Topping</th>
              <th className="p-6">Giá phụ thu</th>
              <th className="p-6">Phân loại</th>
              <th className="p-6 text-center">Trạng thái</th>
              <th className="p-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {toppings.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-gray-400 italic font-medium">
                  Chưa có loại topping nào được tạo...
                </td>
              </tr>
            ) : (
              toppings.map((t) => (
                <tr key={t.id} className="hover:bg-orange-50/20 transition-all group">
                  <td className="p-6 font-bold text-[#4A2C2A]">{t.name}</td>
                  <td className="p-6">
                    <span className="text-lg font-black text-[#4A2C2A]">
                      {Number(t.price).toLocaleString()}₫
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      {t.apply_for}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      t.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-400 border-gray-100"
                    }`}>
                      {t.is_active ? <FiCheck /> : <FiX />}
                      {t.is_active ? "Hoạt động" : "Tạm tắt"}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#4A2C2A] hover:text-[#FFDBB6] transition-all shadow-sm"
                        title="Sửa Topping"
                      >
                        <FiEdit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleToggle(t.id)}
                        className={`p-3 rounded-2xl transition-all shadow-sm ${
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