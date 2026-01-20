import React, { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiCheckCircle, FiArrowRight } from "react-icons/fi";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Hàm kích hoạt LoginModal từ bất cứ đâu
  const openLogin = () => {
    window.dispatchEvent(new Event("openLoginModal"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert("🎉 Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      // Sau khi đăng ký xong, mở luôn modal đăng nhập cho khách
      openLogin(); 
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Email đã tồn tại hoặc lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center p-6 text-left">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-orange-50 animate-in fade-in zoom-in duration-500">
        
        {/* HEADER */}
        <div className="bg-[#4A2C2A] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
          <h2 className="text-3xl font-black text-[#FFDBB6] uppercase italic tracking-tighter mb-2">
            Gia nhập <span className="text-[#a06b49]">Tea House</span>
          </h2>
          <p className="text-[#FFDBB6]/60 text-xs font-bold uppercase tracking-widest">
            Trải nghiệm trà sữa thượng hạng
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-10 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-500 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
              <FiCheckCircle className="rotate-180" /> {error}
            </div>
          )}

          {/* TRƯỜNG NHẬP LIỆU */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input name="name" className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-bold text-[#4A2C2A]" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input name="email" type="email" placeholder="email@example.com" className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-bold text-[#4A2C2A]" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input name="password" type="password" placeholder="••••••••" className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-bold text-[#4A2C2A]" value={form.password} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input name="confirmPassword" type="password" placeholder="••••••••" className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-bold text-[#4A2C2A]" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#4A2C2A] text-[#FFDBB6] py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all ${
              loading ? "opacity-70" : "hover:scale-[1.02] active:scale-95"
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Đăng ký ngay <FiArrowRight strokeWidth={3} /></>
            )}
          </button>

          {/* 👉 CHỖ THAY ĐỔI: Sử dụng button thay vì Link để mở Modal */}
          <div className="text-center pt-4">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
               Đã có tài khoản?{" "}
               <button 
                 type="button"
                 onClick={openLogin} 
                 className="text-[#a06b49] hover:underline transition-all font-black"
               >
                 Đăng nhập ngay
               </button>
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;