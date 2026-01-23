import React, { useEffect, useState } from "react";
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  toggleDiscount,
} from "../../services/adminDiscount";
import { FiTag, FiPlus, FiSave, FiX, FiEdit3, FiRefreshCw, FiCalendar, FiActivity, FiClock } from "react-icons/fi";
import Toast from "../../components/Toast"; 

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const [form, setForm] = useState({
    code: "",
    discount_type: "percent",
    value: "",
    start_date: "",
    end_date: "",
  });

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const data = await getDiscounts();
      setDiscounts(data);
    } catch (err) {
      showNotification("❌ Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🛠️ CHUẨN HÓA DỮ LIỆU GỬI ĐI
    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      value: Number(form.value), 
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };

    try {
      if (editingId) {
        await updateDiscount(editingId, payload);
        showNotification("✅ Đã cập nhật mã giảm giá!");
      } else {
        await createDiscount(payload);
        showNotification("🎉 Đã tạo mã giảm giá mới!");
      }
      resetForm();
      loadDiscounts();
    } catch (err) {
      showNotification("❌ Lỗi: Mã Code trùng hoặc ngày không hợp lệ");
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({
      code: d.code,
      discount_type: d.discount_type,
      value: d.value,
      start_date: d.start_date ? d.start_date.slice(0, 10) : "",
      end_date: d.end_date ? d.end_date.slice(0, 10) : "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await toggleDiscount(id);
      showNotification(currentStatus ? "🔒 Đã tạm ngưng mã" : "🔓 Đã kích hoạt mã");
      loadDiscounts();
    } catch (err) {
      showNotification("❌ Không thể đổi trạng thái");
    }
  };

  if (loading && discounts.length === 0) return (
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
      <div className="mb-10 border-b border-orange-100 pb-8">
        <h1 className="text-4xl font-black text-[#4A2C2A] tracking-tighter uppercase italic flex items-center gap-3">
          <FiTag className="text-[#a06b49]" /> Quản lý <span className="text-[#a06b49]">Giảm giá</span>
        </h1>
      </div>

      {/* FORM SECTION */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-orange-50 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFDBB6]/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>
        
        <h2 className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-[0.3em] mb-8 flex items-center gap-3 relative z-10">
          <div className={`p-2 rounded-lg ${editingId ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
            {editingId ? <FiEdit3 /> : <FiPlus />}
          </div>
          {editingId ? "Chỉnh sửa Voucher" : "Tạo Voucher mới"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã Code</label>
            <input
              type="text"
              placeholder="COFFEE20"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all font-black text-[#4A2C2A] uppercase outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Loại hình</label>
            <select
              value={form.discount_type}
              onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] font-bold text-[#4A2C2A] outline-none"
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Tiền mặt (₫)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giá trị</label>
            <input
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] font-black text-[#4A2C2A] outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bắt đầu</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl font-bold text-[#4A2C2A] outline-none text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kết thúc</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl font-bold text-[#4A2C2A] outline-none text-xs"
            />
          </div>

          <div className="md:col-span-3 lg:col-span-5 flex justify-end gap-4 mt-4">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                <FiX /> Hủy bỏ
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-[#4A2C2A] text-[#FFDBB6] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
            >
              <FiSave size={16} /> {editingId ? "Lưu thay đổi" : "Kích hoạt Voucher"}
            </button>
          </div>
        </form>
      </section>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-orange-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">
                <th className="p-8">Mã ưu đãi</th>
                <th className="p-8">Hình thức</th>
                <th className="p-8 text-right">Mức giảm</th>
                <th className="p-8 text-center">Thời hạn áp dụng</th>
                <th className="p-8 text-center">Trạng thái</th>
                <th className="p-8 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {discounts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center text-gray-400 italic">Chưa có mã giảm giá nào...</td>
                </tr>
              ) : (
                discounts.map((d) => (
                  <tr key={d.id} className="hover:bg-orange-50/20 transition-all group">
                    <td className="p-8">
                      <div className="flex items-center gap-3 font-black text-[#4A2C2A] text-lg uppercase tracking-widest group-hover:text-[#a06b49]">
                        <FiTag size={14} className="text-[#a06b49]" /> {d.code}
                      </div>
                    </td>
                    <td className="p-8 uppercase text-[10px] font-black text-gray-400 tracking-widest">
                      {d.discount_type === "percent" ? "Tỷ lệ %" : "Tiền mặt ₫"}
                    </td>
                    <td className="p-8 text-right font-black text-[#4A2C2A] text-xl italic tracking-tighter">
                      {d.discount_type === "percent" ? `${d.value}%` : `${Number(d.value).toLocaleString()}₫`}
                    </td>
                    {/* CỘT THỜI HẠN ĐÃ ĐƯỢC THÊM LẠI Ở ĐÂY */}
                    <td className="p-8 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                          <FiCalendar size={12} /> {d.start_date ? d.start_date.slice(0, 10) : "N/A"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-lg">
                          <FiClock size={12} /> {d.end_date ? d.end_date.slice(0, 10) : "Không thời hạn"}
                        </div>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <button
                        onClick={() => handleToggle(d.id, d.is_active)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                          d.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm" : "bg-gray-50 text-gray-400 border-gray-100"
                        }`}
                      >
                        {d.is_active ? "Đang chạy" : "Tạm ngưng"}
                      </button>
                    </td>
                    <td className="p-8 text-right">
                      <button onClick={() => handleEdit(d)} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#4A2C2A] hover:text-[#FFDBB6] transition-all">
                        <FiEdit3 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Discounts;