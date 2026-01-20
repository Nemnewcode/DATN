import React, { useEffect, useState } from "react";
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  toggleDiscount,
} from "../../services/adminDiscount";
// ĐÃ SỬA: Thay FiTicket bằng FiTag
import { FiTag, FiPlus, FiSave, FiX, FiEdit3, FiRefreshCw, FiCalendar, FiActivity } from "react-icons/fi";

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    discount_type: "percent",
    value: "",
    start_date: "",
    end_date: "",
  });

  const loadDiscounts = async () => {
    try {
      const data = await getDiscounts();
      setDiscounts(data);
    } catch (err) {
      alert("❌ Không tải được danh sách discount");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDiscount(editingId, form);
        alert("✅ Cập nhật thành công");
      } else {
        await createDiscount(form);
        alert("✅ Tạo discount thành công");
      }
      resetForm();
      loadDiscounts();
    } catch (err) {
      alert("❌ Lưu discount thất bại");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      code: "",
      discount_type: "percent",
      value: "",
      start_date: "",
      end_date: "",
    });
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({
      code: d.code,
      discount_type: d.discount_type,
      value: d.value,
      start_date: d.start_date?.slice(0, 10) || "",
      end_date: d.end_date?.slice(0, 10) || "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (id) => {
    try {
      await toggleDiscount(id);
      loadDiscounts();
    } catch (err) {
      alert("❌ Không đổi được trạng thái");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A2C2A]"></div>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-700 text-left">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#4A2C2A] tracking-tighter uppercase italic flex items-center gap-3">
          <FiTag className="text-orange-400" /> Quản lý Mã giảm giá
        </h1>
        <p className="text-gray-400 text-sm font-medium mt-1">
          Thiết lập các chương trình khuyến mãi và voucher cho khách hàng
        </p>
      </div>

      {/* FORM SECTION */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-50 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        
        <h2 className="text-sm font-black text-[#4A2C2A] uppercase tracking-widest mb-6 flex items-center gap-2">
          {editingId ? <FiEdit3 /> : <FiPlus />} {editingId ? "Cập nhật mã" : "Tạo mã mới"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã Code</label>
            <input
              type="text"
              placeholder="Ví dụ: COFFEE20"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full bg-gray-50 border-none p-3 rounded-xl focus:ring-2 focus:ring-[#FFDBB6] transition-all font-bold text-[#4A2C2A] uppercase outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Loại giảm</label>
            <select
              value={form.discount_type}
              onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
              className="w-full bg-gray-50 border-none p-3 rounded-xl focus:ring-2 focus:ring-[#FFDBB6] transition-all font-bold text-[#4A2C2A] outline-none"
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Tiền mặt (₫)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giá trị</label>
            <input
              type="number"
              placeholder="0"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="w-full bg-gray-50 border-none p-3 rounded-xl focus:ring-2 focus:ring-[#FFDBB6] transition-all font-bold text-[#4A2C2A] outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bắt đầu</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full bg-gray-50 border-none p-3 rounded-xl focus:ring-2 focus:ring-[#FFDBB6] transition-all font-bold text-[#4A2C2A] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kết thúc</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="w-full bg-gray-50 border-none p-3 rounded-xl focus:ring-2 focus:ring-[#FFDBB6] transition-all font-bold text-[#4A2C2A] outline-none"
            />
          </div>

          <div className="md:col-span-3 lg:col-span-5 flex justify-end gap-3 mt-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                <FiX /> Hủy
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#4A2C2A] text-[#FFDBB6] font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#4A2C2A]/20 hover:scale-105 active:scale-95 transition-all"
            >
              <FiSave /> {editingId ? "Cập nhật" : "Tạo mã"}
            </button>
          </div>
        </form>
      </section>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
              <th className="p-6">Mã Voucher</th>
              <th className="p-6">Hình thức</th>
              <th className="p-6 text-right">Mức giảm</th>
              <th className="p-6 text-center">Thời hạn</th>
              <th className="p-6 text-center">Trạng thái</th>
              <th className="p-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-orange-50/20 transition-all group">
                <td className="p-6">
                  <div className="flex items-center gap-3 font-black text-[#4A2C2A] tracking-wider">
                    <FiTag className="text-orange-400" /> {d.code}
                  </div>
                </td>
                <td className="p-6 uppercase text-[10px] font-black text-gray-400 tracking-widest">
                  {d.discount_type}
                </td>
                <td className="p-6 text-right font-black text-[#4A2C2A] text-lg">
                  {d.discount_type === "percent" ? `${d.value}%` : `${Number(d.value).toLocaleString()}₫`}
                </td>
                <td className="p-6">
                  <div className="flex flex-col items-center gap-1 text-[11px] font-bold text-gray-500">
                    <span className="flex items-center gap-1"><FiCalendar className="text-blue-400" /> {d.start_date?.slice(0, 10) || "—"}</span>
                    <span className="flex items-center gap-1"><FiActivity className="text-rose-400" /> {d.end_date?.slice(0, 10) || "—"}</span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <button
                    onClick={() => handleToggle(d.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      d.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-400 border-gray-100"
                    }`}
                  >
                    {d.is_active ? "Đang chạy" : "Tạm ngưng"}
                  </button>
                </td>
                <td className="p-6 text-right">
                  <button onClick={() => handleEdit(d)} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#4A2C2A] hover:text-[#FFDBB6] transition-all shadow-sm">
                    <FiEdit3 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Discounts;