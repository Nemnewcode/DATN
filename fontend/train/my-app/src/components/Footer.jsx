import React from "react";
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiClock, FiMapPin } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#4A2C2A] text-[#FFDBB6] mt-20 border-t-4 border-[#a06b49]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Cột 1: Thương hiệu */}
        <div className="space-y-4">
          <h3 className="text-2xl font-black italic tracking-tighter uppercase text-[#FFDBB6]">
            Tea<span className="text-[#a06b49]">House</span>
          </h3>
          <p className="text-sm leading-relaxed opacity-80 font-medium">
            Hành trình tìm kiếm hương vị trà và cà phê đích thực. Chúng tôi mang đến trải nghiệm thưởng thức tinh tế trong từng giọt thức uống.
          </p>
          <div className="flex gap-3 pt-2">
            {[
              { icon: <FiFacebook />, href: "#" },
              { icon: <FiInstagram />, href: "#" },
              { icon: <FiTwitter />, href: "#" },
            ].map((social, index) => (
              <a 
                key={index}
                href={social.href} 
                className="w-10 h-10 rounded-full border border-[#FFDBB6]/20 flex items-center justify-center hover:bg-[#FFDBB6] hover:text-[#4A2C2A] transition-all duration-300 shadow-lg"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Cột 2: Khám phá */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#a06b49]">
            Khám phá
          </h3>
          <ul className="space-y-3 text-sm font-bold">
            <li><a href="/thuc-don" className="hover:translate-x-2 inline-block transition-transform duration-300 opacity-80 hover:opacity-100">Thực đơn đặc biệt</a></li>
            <li><a href="/dat-ban" className="hover:translate-x-2 inline-block transition-transform duration-300 opacity-80 hover:opacity-100">Đặt bàn trực tuyến</a></li>
            <li><a href="/tin-tuc" className="hover:translate-x-2 inline-block transition-transform duration-300 opacity-80 hover:opacity-100">Chuyện của Trà</a></li>
            <li><a href="/khuyen-mai" className="hover:translate-x-2 inline-block transition-transform duration-300 opacity-80 hover:opacity-100">Ưu đãi thành viên</a></li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#a06b49]">
            Liên hệ
          </h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-start gap-3">
              <FiMapPin className="mt-1 flex-shrink-0 text-[#a06b49]" />
              <span className="opacity-80"></span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="flex-shrink-0 text-[#a06b49]" />
              <a href="tel:+84326630444" className="hover:text-white transition opacity-80">+84 326 630 444</a>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="flex-shrink-0 text-[#a06b49]" />
              <a href="mailto:contact@teahouse.com" className="hover:text-white transition opacity-80 lowercase">teahouse@hotmail.com</a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Giờ hoạt động */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#a06b49]">
            Mở cửa
          </h3>
          <div className="bg-black/20 p-6 rounded-3xl border border-white/5 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <FiClock className="text-[#FFDBB6]" />
              <span className="text-xs font-black uppercase tracking-widest">Thời gian</span>
            </div>
            <p className="text-sm font-bold italic">Thứ 2 - Thứ 6: <span className="text-[#a06b49]">08:00 - 21:00</span></p>
            <p className="text-sm font-bold italic mt-2">Thứ 7 - CN: <span className="text-[#a06b49]">07:30 - 22:30</span></p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#3b241f] py-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-60">
          <p>© {currentYear} Tea House - Coffee OS System.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#FFDBB6] transition">Chính sách bảo mật</a>
            <a href="#" className="hover:text-[#FFDBB6] transition">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}