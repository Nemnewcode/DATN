import React, { useEffect } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-[9999] animate-in slide-in-from-right-full fade-in duration-500">
      {/* Khối nội dung Toast */}
      <div className="relative bg-[#4A2C2A] text-[#FFDBB6] p-5 pr-12 rounded-[1.5rem] shadow-[0_20px_50px_rgba(74,44,42,0.3)] border border-white/10 backdrop-blur-md flex items-center gap-4 min-w-[320px]">
        
        {/* Icon bọc trong vòng tròn */}
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
          <FiCheckCircle size={24} strokeWidth={2.5} />
        </div>

        {/* Nội dung text */}
        <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">
            Thông báo hệ thống
          </p>
          <p className="font-bold text-sm leading-tight italic">
            {message}
          </p>
        </div>

        {/* Nút đóng nhanh */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 opacity-40 hover:opacity-100 transition-opacity"
        >
          <FiX size={16} />
        </button>

        {/* Thanh Progress Bar (Thời gian chờ) */}
        <div className="absolute bottom-0 left-6 right-6 h-[3px] bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#a06b49] animate-toastProgress origin-left"></div>
        </div>
      </div>
    </div>
  );
};

export default Toast;