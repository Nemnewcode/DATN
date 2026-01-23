import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/img/logo.png"; 

const menu = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/users", label: "Tài khoản", icon: "👤" },
  { to: "/admin/orders", label: "Đơn hàng", icon: "🧾" },
  { to: "/admin/reservations", label: "Đặt bàn", icon: "🍽️" },
  { to: "/admin/products", label: "Sản phẩm", icon: "🥤" },
  { to: "/admin/inventory", label: "Tồn kho", icon: "📦" },
  { to: "/admin/discounts", label: "Giảm giá", icon: "🎟️" },
  { to: "/admin/toppings", label: "Topping", icon: "🧋" },
  { to: "/admin/featured-news", label: "Tin tức", icon: "📰" },
  { to: "/admin/review", label: "Đánh giá", icon: "⭐" },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside 
      className="fixed inset-y-0 left-0 z-50 flex flex-col bg-[#4A2C2A] text-white transition-all duration-500 ease-in-out border-r border-white/10 w-20 hover:w-72 group/sidebar shadow-2xl overflow-hidden"
    >
      {/* ===== LOGO SECTION (ĐÃ CẬP NHẬT) ===== */}
      <div className="flex items-center p-4 h-24 flex-shrink-0 overflow-hidden">
        {/* Khối Logo rực rỡ giống Header */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-[#FFDBB6] rounded-xl blur-md opacity-20 group-hover/sidebar:opacity-50 transition-opacity duration-500 scale-110"></div>
          <div className="relative bg-[#36201e] p-2 rounded-xl border border-white/5 shadow-lg shadow-black/40">
            <img src={logo} alt="Logo" className="h-8 w-8 object-contain brightness-125 contrast-110" />
          </div>
        </div>

        {/* Text thương hiệu hiện ra khi mở rộng */}
        <div className="ml-4 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <h2 className="text-xl font-black tracking-tighter uppercase italic leading-none">
            TEA<span className="text-[#FFDBB6]">HOUSE</span>
          </h2>
          <p className="text-[9px] uppercase font-black text-[#FFDBB6]/60 tracking-[0.2em] mt-1 text-left">Admin Panel</p>
        </div>
      </div>

      {/* ===== MENU NAVIGATION ===== */}
      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menu.map((item) => {
          const active = pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center h-12 rounded-2xl transition-all duration-300 relative group/item
                ${
                  active
                    ? "bg-[#FFDBB6] text-[#4A2C2A] shadow-lg shadow-black/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <div className="w-14 flex-shrink-0 flex items-center justify-center text-xl transition-transform group-hover/item:scale-110">
                {item.icon}
              </div>

              <span className={`font-bold text-sm whitespace-nowrap transition-all duration-300 opacity-0 group-hover/sidebar:opacity-100 ml-2`}>
                {item.label}
              </span>

              {/* Tooltip khi thu nhỏ */}
              <div className="absolute left-20 bg-[#4A2C2A] text-[#FFDBB6] px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 pointer-events-none group-hover/sidebar:hidden group-hover/item:opacity-100 transition-opacity shadow-xl border border-white/10 whitespace-nowrap z-[60]">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ===== FOOTER SECTION ===== */}
      <div className="p-4 border-t border-white/5 bg-black/10 flex-shrink-0">
        <Link
          to="/"
          className="flex items-center h-12 rounded-xl transition-all duration-300 bg-[#5c3734] text-[#FFDBB6] hover:bg-[#FFDBB6] hover:text-[#4A2C2A]"
        >
          <div className="w-12 flex-shrink-0 flex items-center justify-center text-lg">🏠</div>
          <span className="font-black text-[10px] uppercase tracking-widest opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-1">
            Trang chủ
          </span>
        </Link>

        <div className="mt-4 flex items-center h-10 overflow-hidden">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#FFDBB6] flex items-center justify-center text-[#4A2C2A] font-black text-xs border-2 border-[#5c3734]">
            AD
          </div>
          <div className="ml-3 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <p className="text-xs font-bold leading-none text-left">Admin</p>
            <p className="text-[10px] text-white/40 mt-1 text-left">coffee@admin.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;