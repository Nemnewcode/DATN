import React, { useEffect, useState } from "react";
import { createDiscount, updateDiscount } from "../../services/adminDiscount";
import { FiTag, FiPercent, FiDollarSign, FiCalendar, FiSave, FiRefreshCcw, FiX } from "react-icons/fi";
import Toast from "../Toast"; // Đảm bảo đường dẫn này đúng với dự án của bạn

const DiscountForm = ({ onSuccess, editing, onCancel }) => {
  const [form, setForm] = useState({
    code: "",
    discount_type: "percent",
    value: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  // Theo dõi biến editing để đổ dữ liệu vào form khi sửa
  useEffect(() => {
    if (editing) {
      setForm({
        code: editing.code || "",
        discount_type: editing.discount_type || "percent",
        value: editing.value || "",
        // Cắt chuỗi lấy yyyy-MM-dd để input type="date" hiểu được
        start_date: editing.start_date ? editing.start_date.slice(0, 10) : "",
        end_date: editing.end_date ? editing.end_date.slice(0, 10) : "",
      });
    } else {
      setForm({
        code: "",
        discount_type: "percent",
        value: "",
        start_date: "",
        end_date: "",
      });
    }
  }, [editing]);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🛠️ CHUẨN HÓA DỮ LIỆU GỬI ĐI (Fix lỗi 400 Bad Request)
    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      value: Number(form.value), // Bắt buộc là số
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };

    try {
      if (editing && editing.id) {
        await updateDiscount(editing.id, payload);
        showNotification("✅ Đã cập nhật mã giảm giá!");
      } else {
        await createDiscount(payload);
        showNotification("🎉 Đã tạo mã giảm giá mới!");
      }

      // Reset form sau khi lưu thành công
      setForm({ code: "", discount_type: "percent", value: "", start_date: "", end_date: "" });
      
      // Gọi hàm load lại danh sách ở file cha
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error) {
      console.error("Lỗi API:", error);
      showNotification("❌ Lỗi: Mã Code đã tồn tại hoặc dữ liệu sai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* HIỂN THỊ TOAST */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: "" })} 
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-[3rem] shadow-sm border border-orange-50 relative overflow-hidden text-left mb-10"
      >
        {/* Decor Background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFDBB6]/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>

        <div className="relative mb-8">
          <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">
            Cấu hình ưu đãi
          </span>
          <h2 className="text-3xl font-black text-[#4A2C2A] uppercase tracking-tighter italic flex items-center gap-3 leading-none">
            {editing ? <FiRefreshCcw className="text-blue-500" /> : <FiTag className="text-[#a06b49]" />}
            {editing ? "Hiệu chỉnh" : "Khởi tạo"} <span className="text-[#a06b49]">Voucher</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
          {/* Mã Code */}
          <div className="space-y-2 lg:col-span-1">
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

          {/* Loại hình */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Loại hình</label>
            <select
              value={form.discount_type}
              onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] font-bold text-[#4A2C2A] outline-none cursor-pointer appearance-none"
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Tiền mặt (₫)</option>
            </select>
          </div>

          {/* Giá trị */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mức giảm</label>
            <input
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] font-black text-[#4A2C2A] outline-none"
              required
            />
          </div>

          {/* Ngày bắt đầu */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bắt đầu</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl font-bold text-[#4A2C2A] outline-none text-xs"
            />
          </div>

          {/* Ngày kết thúc */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kết thúc</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl font-bold text-[#4A2C2A] outline-none text-xs"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-3 lg:col-span-5 flex justify-end gap-4 mt-4">
            {editing && (
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                <FiX /> Hủy bỏ
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-[#4A2C2A] text-[#FFDBB6] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FiSave size={16} />
              )}
              {editing ? "Lưu thay đổi" : "Kích hoạt Voucher"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DiscountForm;