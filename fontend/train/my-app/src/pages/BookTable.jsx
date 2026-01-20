import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookTable = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    reservation_date: "",
    reservation_time: "",
    number_of_people: 1,
    note: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

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
          alert("🔒 Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          navigate("/login");
          return;
        }
        throw new Error("Backend error");
      }

      alert("✅ Đặt bàn thành công! Vui lòng chờ admin xác nhận.");
      setFormData({
        customer_name: "",
        phone: "",
        email: "",
        reservation_date: "",
        reservation_time: "",
        number_of_people: 1,
        note: "",
      });
    } catch (err) {
      alert("❌ Lỗi kết nối backend");
      console.error(err);
    }
  };

  return (
    <section className="bg-[#FAF7F2] min-h-screen py-16 px-4 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-orange-50">
        
        {/* CỘT TRÁI: HÌNH ẢNH HOẶC DECOR */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-[#4A2C2A] text-[#FFDBB6] space-y-6">
          <h2 className="text-4xl font-black leading-tight italic">
            Trải nghiệm không gian <br /> ấm cúng.
          </h2>
          <p className="text-sm opacity-80 leading-relaxed font-light">
            Đặt bàn trước để chúng tôi có thể chuẩn bị cho bạn một chỗ ngồi ưng ý nhất tại quán. Sự hiện diện của bạn là niềm vinh hạnh của chúng tôi.
          </p>
          <div className="pt-4">
            <div className="h-1 w-20 bg-[#FFDBB6] rounded-full"></div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM ĐẶT BÀN */}
        <div className="p-8 lg:p-12">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-black text-[#4A2C2A] uppercase tracking-tighter">
              Đặt bàn
            </h1>
            <p className="text-gray-400 text-sm mt-1">Vui lòng điền thông tin bên dưới</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4A2C2A] ml-1 uppercase">Họ và tên</label>
                <input
                  type="text"
                  name="customer_name"
                  placeholder="Nguyễn Văn A"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-transparent p-3 rounded-xl focus:bg-white focus:border-[#4A2C2A] focus:ring-0 transition-all outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4A2C2A] ml-1 uppercase">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="090..."
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-transparent p-3 rounded-xl focus:bg-white focus:border-[#4A2C2A] focus:ring-0 transition-all outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#4A2C2A] ml-1 uppercase">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-transparent p-3 rounded-xl focus:bg-white focus:border-[#4A2C2A] focus:ring-0 transition-all outline-none text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4A2C2A] ml-1 uppercase">Ngày</label>
                <input
                  type="date"
                  name="reservation_date"
                  value={formData.reservation_date}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-transparent p-3 rounded-xl focus:bg-white focus:border-[#4A2C2A] transition-all outline-none text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4A2C2A] ml-1 uppercase">Giờ</label>
                <input
                  type="time"
                  name="reservation_time"
                  value={formData.reservation_time}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-transparent p-3 rounded-xl focus:bg-white focus:border-[#4A2C2A] transition-all outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#4A2C2A] ml-1 uppercase">Số lượng khách</label>
              <select
                name="number_of_people"
                value={formData.number_of_people}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-transparent p-3 rounded-xl focus:bg-white focus:border-[#4A2C2A] transition-all outline-none text-sm appearance-none cursor-pointer"
              >
                {[1, 2, 4, 6, 10, 20].map((n) => (
                  <option key={n} value={n}>
                    {n} người {n >= 10 ? "(Liên hệ trước)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#4A2C2A] ml-1 uppercase">Ghi chú thêm</label>
              <textarea
                name="note"
                rows="3"
                placeholder="Ví dụ: Bàn gần cửa sổ, tiệc sinh nhật..."
                value={formData.note}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-transparent p-3 rounded-xl focus:bg-white focus:border-[#4A2C2A] transition-all outline-none text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#4A2C2A] text-[#FFDBB6] py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-black hover:-translate-y-1 transition-all duration-300 active:scale-95 mt-4"
            >
              Gửi yêu cầu đặt bàn
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookTable;