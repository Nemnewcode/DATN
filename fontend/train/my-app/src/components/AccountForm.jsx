import React from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave, FiAlertCircle, FiCheckCircle } from "react-icons/fi";


const AccountForm = ({
  form,
  onChange,
  onSubmit,
  message,
  isError,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* THÔNG BÁO TRẠNG THÁI */}
      {message && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-pulse ${
          isError ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
        }`}>
          {isError ? <FiAlertCircle size={18} /> : <FiCheckCircle size={18} />}
          {message}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên tài khoản - Chỉ đọc */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Tên tài khoản
            </label>
            <div className="relative group">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                value={form.username}
                disabled
                className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl font-bold text-gray-400 cursor-not-allowed italic"
              />
            </div>
          </div>

          {/* Email - Chỉ đọc */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Địa chỉ Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                value={form.email}
                disabled
                className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl font-bold text-gray-400 cursor-not-allowed italic"
              />
            </div>
          </div>
        </div>

        <hr className="border-orange-50 my-2" />

        {/* Họ tên - Có thể sửa */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-[#a06b49]">
            Họ và tên thành viên
          </label>
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a06b49]" />
            <input
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full bg-white border border-orange-100 pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-bold text-[#4A2C2A] shadow-sm transition-all"
              placeholder="Nhập họ và tên..."
            />
          </div>
        </div>

        {/* Số điện thoại - Có thể sửa */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-[#a06b49]">
            Số điện thoại liên lạc
          </label>
          <div className="relative">
            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a06b49]" />
            <input
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="w-full bg-white border border-orange-100 pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-bold text-[#4A2C2A] shadow-sm transition-all"
              placeholder="Số điện thoại của bạn..."
            />
          </div>
        </div>

        {/* Địa chỉ - Có thể sửa */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-[#a06b49]">
            Địa chỉ nhận hàng
          </label>
          <div className="relative">
            <FiMapPin className="absolute left-4 top-6 text-[#a06b49]" />
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => onChange("address", e.target.value)}
              className="w-full bg-white border border-orange-100 pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-bold text-[#4A2C2A] shadow-sm transition-all resize-none"
              placeholder="Nhập địa chỉ giao hàng chi tiết..."
            />
          </div>
        </div>

        {/* NÚT THAO TÁC */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            className="flex-1 bg-[#4A2C2A] text-[#FFDBB6] py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <FiSave size={16} /> Lưu thay đổi
          </button>

          <button
            type="button"
            className="flex-1 border-2 border-[#4A2C2A] text-[#4A2C2A] py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
          >
            <FiLock size={16} /> Đổi mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;