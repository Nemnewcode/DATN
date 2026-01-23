import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiMail, FiCalendar, FiClock, FiUsers, FiEdit3, FiCoffee } from "react-icons/fi";
import Toast from "../components/Toast"; // Đảm bảo đường dẫn này chính xác

const BookTable = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    reservation_date: "",
    reservation_time: "",
    number_of_people: 1,
    note: "",
  });

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      showNotification("🔒 Vui lòng đăng nhập để thực hiện đặt bàn");
      setTimeout(() => navigate("/login"), 2000);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5041/api/table-reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          number_of_people: Number(formData.number_of_people),
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          showNotification("🔒 Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
          navigate("/login");
          return;
        }
        throw new Error("Backend error");
      }

      showNotification("✅ Đặt bàn thành công! Đang chờ xác nhận...");
      
      setFormData({
        customer_name: "",
        phone: "",
        email: "",
        reservation_date: "",
        reservation_time: "",
        number_of_people: 1,
        note: "",
      });
      
      // Chuyển hướng sau khi thành công (tùy chọn)
      // setTimeout(() => navigate("/tai-khoan/lich-su-dat-ban"), 2000);

    } catch (err) {
      showNotification("❌ Lỗi kết nối máy chủ, vui lòng thử lại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#FAF7F2] min-h-screen py-20 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: "" })} 
        />
      )}

      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-orange-100/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-orange-100/50 rounded-full blur-3xl"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(74,44,42,0.1)] border border-orange-50 relative z-10">
        
        {/* CỘT TRÁI: BRANDING & DECOR */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-[#4A2C2A] text-[#FFDBB6] relative overflow-hidden">
          {/* Hào quang phía sau */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
              <FiCoffee />
            </div>
            <h2 className="text-5xl font-black leading-tight italic tracking-tighter">
              Dành riêng <br /> cho bạn môt <br /> <span className="text-white">góc bình yên.</span>
            </h2>
            <p className="text-sm opacity-70 leading-relaxed font-medium max-w-xs">
              Mỗi vị trí tại Tea House đều được chăm chút để mang lại sự thoải mái nhất. Đặt chỗ trước giúp chúng tôi chuẩn bị đón tiếp bạn chu đáo hơn.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
             <div className="h-[1px] w-12 bg-[#FFDBB6]/40"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Since 2024 • Tea House</span>
          </div>
        </div>

        {/* CỘT PHẢI: FORM */}
        <div className="p-10 lg:p-16 text-left">
          <div className="mb-10">
            <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Reservation</span>
            <h1 className="text-4xl font-black text-[#4A2C2A] uppercase italic tracking-tighter leading-none">
              Đặt bàn <span className="text-[#a06b49]">ngay</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-widest ml-1">Họ và tên</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a06b49]" />
                  <input
                    type="text"
                    name="customer_name"
                    placeholder="Tên khách hàng"
                    value={formData.customer_name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-widest ml-1">Số điện thoại</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a06b49]" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số liên lạc"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-widest ml-1">Địa chỉ Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a06b49]" />
                <input
                  type="email"
                  name="email"
                  placeholder="nhận thông báo xác nhận"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-widest ml-1">Ngày đến</label>
                <input
                  type="date"
                  name="reservation_date"
                  value={formData.reservation_date}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A] cursor-pointer"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-widest ml-1">Giờ đến</label>
                <input
                  type="time"
                  name="reservation_time"
                  value={formData.reservation_time}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A] cursor-pointer"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-widest ml-1">Số lượng người</label>
              <div className="relative">
                <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a06b49]" />
                <select
                  name="number_of_people"
                  value={formData.number_of_people}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] font-bold text-[#4A2C2A] appearance-none cursor-pointer outline-none"
                >
                  {[1, 2, 4, 6, 8, 10, 15, 20].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "người" : "người"} {n >= 10 ? "(Liên hệ sảnh)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-widest ml-1">Yêu cầu đặc biệt</label>
              <div className="relative">
                <FiEdit3 className="absolute left-4 top-5 text-[#a06b49]" />
                <textarea
                  name="note"
                  rows="3"
                  placeholder="Ghi chú về vị trí bàn hoặc sự kiện..."
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-medium text-[#4A2C2A] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A2C2A] text-[#FFDBB6] py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#FFDBB6]/30 border-t-[#FFDBB6] rounded-full animate-spin"></div>
              ) : (
                "Gửi yêu cầu đặt bàn"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookTable;