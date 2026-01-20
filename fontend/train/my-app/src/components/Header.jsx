import React, { useEffect, useState } from "react";
import logo from "../assets/img/logo.png";
import LoginModal from "../pages/LoginModal";
import { Link, useLocation } from "react-router-dom"; 

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const openLogin = () => setShowLogin(true);
    window.addEventListener("openLoginModal", openLogin);
    return () => window.removeEventListener("openLoginModal", openLogin);
  }, []);

  useEffect(() => {
    const updateHeaderState = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cart.reduce((sum, item) => {
        const price = parseInt(item.price?.toString().replace(/[^\d]/g, "")) || 0;
        return sum + price * item.quantity;
      }, 0);

      setCartCount(totalItems);
      setCartTotal(totalPrice);
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    };

    updateHeaderState();
    window.addEventListener("storage", updateHeaderState);
    window.addEventListener("cartUpdated", updateHeaderState);

    return () => {
      window.removeEventListener("storage", updateHeaderState);
      window.removeEventListener("cartUpdated", updateHeaderState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Thực đơn", path: "/thuc-don" },
    { name: "Đặt bàn", path: "/dat-ban" },
    { name: "Đơn hàng", path: "/don-hang-cua-toi" },
  ];

  return (
    <>
      <header className="bg-[#FFDBB6]/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
        <Link to="/" className="flex items-center gap-5 group relative">
          <div className="relative">
            {/* Vòng hào quang rực rỡ phía sau (Glow Effect) - Phóng to hơn */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFDBB6] to-[#a06b49] rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-125"></div>
            
            {/* Box chứa ảnh Logo (Đã tăng kích thước lên w-14 h-14) */}
            <div className="relative bg-[#4A2C2A] p-2 rounded-[1.25rem] shadow-[0_12px_24px_rgba(74,44,42,0.4)] group-hover:shadow-[0_20px_40px_rgba(160,107,73,0.5)] group-hover:-translate-y-1.5 transition-all duration-500 border border-white/10 overflow-hidden w-14 h-14 flex items-center justify-center">
              
              {/* Hiệu ứng quét sáng (Shine Effect) */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <img 
                src={logo} 
                alt="Logo" 
                className="w-11 h-11 object-contain brightness-110 contrast-125 drop-shadow-[0_0_10px_rgba(255,219,182,0.5)] group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
          </div>

          {/* Text Thương hiệu - Căn chỉnh lại để khớp với Logo to */}
          <div className="flex flex-col justify-center">
            <span className="font-black text-2xl md:text-3xl tracking-tighter text-[#4A2C2A] uppercase italic leading-none flex items-center">
              Tea<span className="text-[#a06b49]">House</span>
              <span className="w-2 h-2 bg-[#a06b49] rounded-full ml-1.5 shadow-[0_0_12px_#a06b49] animate-pulse"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a06b49] opacity-90 mt-1.5 ml-1">
              Specialty Coffee & Tea
            </span>
          </div>
        </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 relative py-1
                  ${location.pathname === link.path ? "text-[#a06b49]" : "text-[#4A2C2A] hover:text-[#a06b49] opacity-80 hover:opacity-100"}
                `}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#a06b49] rounded-full shadow-md"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6">
            
            {/* User Menu */}
            {!user ? (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 text-[#4A2C2A] font-black text-xs uppercase tracking-widest hover:text-[#a06b49] transition-colors"
              >
                <i className="fa fa-user-circle text-xl"></i>
                <span className="hidden md:inline">Đăng nhập</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  className="flex items-center gap-2 bg-[#4A2C2A] text-[#FFDBB6] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#a06b49] transition-all shadow-lg"
                >
                  <i className="fa fa-coffee"></i>
                  <span>Hi, {user.name.split(' ')[0]}</span>
                  <i className={`fa fa-chevron-down text-[10px] transition-transform duration-300 ${openUserMenu ? 'rotate-180' : ''}`}></i>
                </button>

                {openUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-orange-50 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-[10px] font-black uppercase text-gray-400">Tài khoản</p>
                        <p className="font-bold text-[#4A2C2A] truncate">{user.name}</p>
                    </div>
                    <div className="p-2">
                        <Link to="/tai-khoan" className="flex items-center gap-3 px-4 py-2 text-sm text-[#4A2C2A] hover:bg-orange-50 rounded-xl transition-colors">
                            <i className="fa fa-id-card-o opacity-50"></i> Thông tin cá nhân
                        </Link>
                        <Link to="/don-hang-cua-toi" className="flex items-center gap-3 px-4 py-2 text-sm text-[#4A2C2A] hover:bg-orange-50 rounded-xl transition-colors">
                            <i className="fa fa-history opacity-50"></i> Lịch sử đơn hàng
                        </Link>
                        <Link to="/my-table-reservations" className="flex items-center gap-3 px-4 py-2 text-sm text-[#4A2C2A] hover:bg-orange-50 rounded-xl transition-colors">
                            <i className="fa fa-history opacity-50"></i> Lịch sử đặt bàn
                        </Link>
                        {user.role === "Admin" && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-purple-600 font-bold hover:bg-purple-50 rounded-xl transition-colors">
                            <i className="fa fa-shield"></i> Trang Admin
                        </Link>
                        )}
                        <hr className="my-2 border-gray-100" />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-colors"
                        >
                            <i className="fa fa-sign-out"></i> Đăng xuất
                        </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart Widget */}
            <Link
              to="/gio-hang"
              className="group flex items-center gap-3 bg-[#a06b49]/10 p-1.5 pr-4 rounded-full hover:bg-[#a06b49]/20 transition-all border border-[#a06b49]/10"
            >
              <div className="relative bg-[#4A2C2A] w-9 h-9 flex items-center justify-center rounded-full shadow-lg group-hover:scale-110 transition-transform">
                <i className="fa fa-shopping-basket text-[#FFDBB6] text-sm"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#FFDBB6] animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-black text-[#a06b49] uppercase leading-none mb-1 opacity-70">Giỏ hàng</p>
                <p className="text-sm font-black text-[#4A2C2A] leading-none">
                  {cartTotal.toLocaleString("vi-VN")}₫
                </p>
              </div>
            </Link>

          </div>
        </div>
      </header>

      <LoginModal isOpen={showLogin} closeModal={() => setShowLogin(false)} />
    </>
  );
};

export default Header;