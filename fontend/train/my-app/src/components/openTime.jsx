import React from "react";
import { FiClock, FiCalendar, FiArrowRight } from "react-icons/fi";

const OpenTime = () => {
  return (
    <section className="bg-[#FFF8F2] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* KHỐI NỘI DUNG */}
        <div className="relative group">
          {/* Decor nền mờ phía sau */}
          <div className="absolute -inset-4 bg-[#a06b49]/10 rounded-[3rem] blur-2xl group-hover:bg-[#a06b49]/20 transition-all duration-500"></div>
          
          <div className="relative bg-[#4A2C2A] text-[#FFDBB6] rounded-[2.5rem] p-10 lg:p-16 shadow-2xl overflow-hidden border border-white/5">
            {/* Họa tiết trang trí góc */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
            
            <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
              Chào đón bạn đến
            </span>
            
            <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tighter uppercase italic leading-none">
              Thời gian <br /> <span className="text-[#a06b49]">mở cửa</span>
            </h2>
            
            <p className="text-sm lg:text-base mb-10 opacity-70 leading-relaxed font-medium italic">
              “Cà phê nhé” – Một lời hẹn rất riêng của người Việt. Tea House luôn sẵn sàng phục vụ bạn những tách trà và cà phê tuyệt vời nhất vào mọi khung giờ trong tuần.
            </p>

            <div className="space-y-6 mb-10 relative">
              <div className="flex items-center gap-4 group/item">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover/item:bg-[#FFDBB6] group-hover/item:text-[#4A2C2A] transition-all">
                  <FiCalendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#a06b49]">Thứ 2 – Thứ 6</p>
                  <p className="text-xl font-bold italic">08:30 – 21:30</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group/item">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover/item:bg-[#FFDBB6] group-hover/item:text-[#4A2C2A] transition-all">
                  <FiClock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#a06b49]">Thứ 7 – Chủ Nhật</p>
                  <p className="text-xl font-bold italic">08:00 – 22:00</p>
                </div>
              </div>
            </div>

            <a
              href="/dat-ban"
              className="inline-flex items-center gap-3 bg-[#FFDBB6] text-[#4A2C2A] font-black uppercase text-xs tracking-widest px-10 py-5 rounded-2xl shadow-xl hover:bg-white hover:scale-105 active:scale-95 transition-all"
            >
              Đặt bàn ngay <FiArrowRight strokeWidth={3} />
            </a>
          </div>
        </div>

        {/* KHỐI ẢNH BANNER */}
        <div className="relative group lg:pl-10">
          {/* Khung viền trang trí */}
          <div className="absolute top-10 left-0 lg:-left-5 w-full h-full border-2 border-orange-100 rounded-[2.5rem] -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
          
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-auto h-full min-h-[500px]">
            <img
              src="https://cafe5.maugiaodien.com/wp-content/uploads/2021/06/banner_time_open-1201x800.jpg"
              alt="Tea House Ambiance"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Lớp phủ mờ khi hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A2C2A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Badge nhỏ nổi lên */}
          <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl hidden md:block animate-bounce">
              <p className="text-[#a06b49] font-black text-2xl tracking-tighter italic uppercase">Fresh Everyday</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mt-1">Since 2024</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default OpenTime;