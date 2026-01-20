import React, { useState } from "react";
import api from "../services/api";
import { FiMail, FiLock, FiX, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const LoginModal = ({ isOpen, closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      // ✅ LƯU TOKEN + USER
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      closeModal();

      // ✅ PHÂN LUỒNG
      if (res.data.user.role === "Admin") {
        window.location.href = "/admin";
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data || "Email hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] bg-[#4A2C2A]/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={closeModal}
    >
      <div
        className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-orange-50 relative animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* NÚT ĐÓNG */}
        <button 
          onClick={closeModal}
          className="absolute top-6 right-6 text-gray-400 hover:text-rose-500 transition-colors z-10"
        >
          <FiX size={24} />
        </button>

        {/* HEADER */}
        <div className="bg-[#4A2C2A] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
          <h3 className="text-3xl font-black text-[#FFDBB6] uppercase italic tracking-tighter mb-2">
            Chào mừng <span className="text-[#a06b49]">Trở lại</span>
          </h3>
          <p className="text-[#FFDBB6]/60 text-xs font-bold uppercase tracking-widest">
            Đăng nhập để tiếp tục thưởng thức
          </p>
        </div>

        {/* FORM */}
        <div className="p-10">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-500 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 mb-6 animate-shake">
              <FiAlertCircle /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left block">
                Địa chỉ Email
              </label>
              <div className="relative text-left">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-bold text-[#4A2C2A] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Mật khẩu
                </label>
                <a href="#" className="text-[10px] font-bold text-[#a06b49] hover:underline uppercase tracking-widest">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-bold text-[#4A2C2A] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* BUTTON SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#4A2C2A] text-[#FFDBB6] py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#4A2C2A]/20 flex items-center justify-center gap-3 transition-all mt-4 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#FFDBB6]/30 border-t-[#FFDBB6] rounded-full animate-spin"></div>
              ) : (
                <>Đăng nhập ngay <FiArrowRight strokeWidth={3} /></>
              )}
            </button>
          </form>

          {/* ĐĂNG KÝ */}
          <div className="text-center mt-8">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
               Chưa có tài khoản?{" "}
               <Link
                 to="/dang-ky"
                 className="text-[#a06b49] hover:underline transition-all font-black"
                 onClick={closeModal}
               >
                 Đăng ký ngay
               </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;