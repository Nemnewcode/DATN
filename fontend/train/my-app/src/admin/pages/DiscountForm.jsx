import { useEffect, useState } from "react";
import {
  createDiscount,
  updateDiscount
} from "../../services/adminDiscount";
import { FiTag, FiPercent, FiDollarSign, FiCalendar, FiSave, FiRefreshCcw } from "react-icons/fi";

export default function DiscountForm({ onSuccess, editing }) {
  const [form, setForm] = useState({
    code: "",
    discount_type: "percent",
    value: "",
    start_date: "",
    end_date: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      // Đảm bảo định dạng ngày yyyy-MM-dd để input type="date" hiển thị được
      setForm({
        ...editing,
        start_date: editing.start_date?.slice(0, 10) || "",
        end_date: editing.end_date?.slice(0, 10) || ""
      });
    }
  }, [editing]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        await updateDiscount(editing.id, form);
      } else {
        await createDiscount(form);
      }

      setForm({
        code: "",
        discount_type: "percent",
        value: "",
        start_date: "",
        end_date: ""
      });

      onSuccess();
    } catch (error) {
      alert("❌ Có lỗi xảy ra khi lưu mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-50 relative overflow-hidden animate-in fade-in duration-500"
    >
      {/* Decor Background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 opacity-50 transition-transform group-hover:scale-110"></div>

      <div className="relative mb-8">
        <h2 className="text-xl font-black text-[#4A2C2A] uppercase tracking-tight italic flex items-center gap-2">
          {editing ? <FiRefreshCcw className="text-blue-500" /> : <FiTag className="text-orange-400" />}
          {editing ? "Cập nhật chiến dịch" : "Tạo mã giảm giá mới"}
        </h2>
        <p className="text-gray-400 text-xs font-medium mt-1">
          Thiết lập các thông số khuyến mãi cho cửa hàng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Mã giảm giá */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã Code</label>
          <div className="relative">
            <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              placeholder="VÍ DỤ: COFFEE50"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A] uppercase"
              required
            />
          </div>
        </div>

        {/* Loại giảm giá */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hình thức giảm</label>
          <div className="relative">
            {form.discount_type === "percent" ? 
              <FiPercent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" /> : 
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            }
            <select
              value={form.discount_type}
              onChange={e => setForm({ ...form, discount_type: e.target.value })}
              className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A] appearance-none cursor-pointer"
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Tiền mặt (₫)</option>
            </select>
          </div>
        </div>

        {/* Giá trị */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giá trị giảm</label>
          <input
            type="number"
            placeholder="Nhập con số..."
            value={form.value}
            onChange={e => setForm({ ...form, value: e.target.value })}
            className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]"
            required
          />
        </div>

        {/* Ngày bắt đầu */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
            <FiCalendar size={10} /> Ngày bắt đầu
          </label>
          <input
            type="date"
            value={form.start_date || ""}
            onChange={e => setForm({ ...form, start_date: e.target.value })}
            className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A] cursor-pointer"
          />
        </div>

        {/* Ngày kết thúc */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
            <FiCalendar size={10} /> Ngày hết hạn
          </label>
          <input
            type="date"
            value={form.end_date || ""}
            onChange={e => setForm({ ...form, end_date: e.target.value })}
            className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A] cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          disabled={loading}
          className="bg-[#4A2C2A] text-[#FFDBB6] px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-[#4A2C2A]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <FiSave size={16} />
          )}
          {editing ? "Cập nhật dữ liệu" : "Kích hoạt mã"}
        </button>
      </div>
    </form>
  );
}