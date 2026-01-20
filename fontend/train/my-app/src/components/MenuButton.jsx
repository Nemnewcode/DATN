import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiArrowRight } from "react-icons/fi";

const MenuButton = () => {
  return (
    <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-[60] flex flex-col gap-4">
      {/* Nút Đặt Bàn Nổi */}
      <Link
        to="/dat-ban"
        title="Đặt bàn ngay"
        className="group relative flex items-center justify-end"
      >
        {/* Label hiển thị khi hover (hiệu ứng trượt từ phải sang trái) */}
        <span className="absolute right-full mr-4 bg-[#4A2C2A] text-[#FFDBB6] px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl opacity-0 group-hover:opacity-100 group-hover:mr-2 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10">
          Đặt bàn ngay
        </span>

        {/* Nút chính */}
        <div className="w-14 h-14 bg-[#4A2C2A] text-[#FFDBB6] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(74,44,42,0.4)] group-hover:bg-[#a06b49] group-hover:rounded-[1.5rem] group-hover:scale-110 transition-all duration-500 border border-white/5 relative overflow-hidden">
          {/* Hiệu ứng tia sáng chạy qua khi hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <FiCalendar size={24} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Badge thông báo nhỏ (tùy chọn) */}
          <span className="absolute -top-1 -left-1 w-3 h-3 bg-[#a06b49] rounded-full border-2 border-[#FFF8F2] animate-ping"></span>
        </div>
      </Link>

      {/* Bạn có thể thêm các nút phụ như Hotline hoặc Zalo ở đây */}
      <a
        href="tel:0326630444"
        title="Gọi hotline"
        className="group flex items-center justify-end"
      >
         <span className="absolute right-full mr-4 bg-white text-[#4A2C2A] px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl opacity-0 group-hover:opacity-100 group-hover:mr-2 transition-all duration-300 pointer-events-none whitespace-nowrap border border-orange-50">
          0326.630.444
        </span>
        <div className="w-12 h-12 bg-white text-[#4A2C2A] rounded-2xl flex items-center justify-center shadow-lg border border-orange-100 hover:bg-orange-50 transition-all duration-300">
           <i className="fa fa-phone text-lg"></i>
        </div>
      </a>
    </div>
  );
};

export default MenuButton;