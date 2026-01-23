import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag, FiChevronRight, FiArrowLeft, FiLoader } from "react-icons/fi";
import Toast from "../components/Toast"; // Đảm bảo đường dẫn này chính xác

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const navigate = useNavigate();

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  };

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const updated = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(updated);
    };
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  useEffect(() => {
    setDiscount(null);
    setDiscountAmount(0);
  }, [cart.length]);

  const toppingTotal = (item) =>
    item.toppings?.reduce((sum, t) => sum + Number(t.price), 0) || 0;

  const subTotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) + toppingTotal(item)) * item.quantity,
    0
  );

  const finalTotal = Math.max(0, subTotal - discountAmount);

  const updateQuantity = (cartItemId, delta) => {
    const matchKey = cart[0]?.cartItemId ? 'cartItemId' : 'id';
    const updated = cart.map((item) => {
      if (item[matchKey] === cartItemId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (cartItemId) => {
    const matchKey = cart[0]?.cartItemId ? 'cartItemId' : 'id';
    const updated = cart.filter((item) => item[matchKey] !== cartItemId);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    showNotification("🗑️ Đã xóa món khỏi giỏ hàng");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const applyDiscount = async () => {
    if (!discountCode) return;
    try {
      const res = await fetch(
        `http://localhost:5041/api/orders/check-discount/${discountCode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setDiscount(data);

      let amount = 0;
      if (data.discount_type === "percent") {
        amount = Math.min(subTotal, subTotal * (data.value / 100));
      } else {
        amount = Math.min(subTotal, data.value);
      }

      setDiscountAmount(amount);
      showNotification("✅ Đã áp dụng mã giảm giá thành công");
    } catch {
      setDiscount(null);
      setDiscountAmount(0);
      showNotification("❌ Mã giảm giá không hợp lệ hoặc đã hết hạn");
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return showNotification("🛒 Giỏ hàng của bạn đang trống!");

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("🔒 Vui lòng đăng nhập để đặt hàng");
      window.dispatchEvent(new Event("openLoginModal"));
      return;
    }

    setIsCheckingOut(true);
    const orderData = {
      discount_id: discount ? discount.id : null,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        topping_ids: item.toppings?.map((t) => t.id) || [],
      })),
    };

    try {
      const res = await fetch("http://localhost:5041/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error();

      showNotification("🎉 Đặt hàng thành công! Đang chuyển hướng...");
      
      setTimeout(() => {
        localStorage.removeItem("cart");
        setCart([]);
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/don-hang-cua-toi");
      }, 1500);

    } catch {
      showNotification("❌ Đặt hàng thất bại, vui lòng thử lại");
      setIsCheckingOut(false);
    }
  };

  return (
    <section className="bg-[#FAF7F2] min-h-screen py-20 px-6 animate-in fade-in duration-700 text-left relative overflow-hidden">
      {/* HIỂN THỊ TOAST */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: "" })} 
        />
      )}

      {/* Decorative Blur */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <button onClick={() => navigate("/thuc-don")} className="flex items-center gap-3 text-[#a06b49] hover:text-[#4A2C2A] font-black text-[10px] uppercase tracking-[0.3em] transition-all mb-4 group">
            <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" /> Quay lại thực đơn
          </button>
          <h2 className="text-5xl font-black text-[#4A2C2A] tracking-tighter uppercase italic flex items-center gap-6">
            Giỏ hàng <span className="text-[#a06b49]">của bạn</span>
          </h2>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[4rem] p-24 text-center shadow-xl shadow-orange-900/5 border border-orange-50">
            <div className="w-24 h-24 bg-orange-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-[#a06b49] shadow-inner rotate-12">
              <FiShoppingBag size={48} />
            </div>
            <h3 className="text-[#4A2C2A] text-2xl font-black uppercase italic mb-3">Giỏ hàng đang trống</h3>
            <p className="text-gray-400 mb-12 max-w-sm mx-auto font-medium leading-relaxed">Một tách trà nóng đang chờ đón bạn. Đừng để giỏ hàng cô đơn nhé!</p>
            <button 
              onClick={() => navigate("/thuc-don")} 
              className="bg-[#4A2C2A] text-[#FFDBB6] px-14 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Khám phá Menu ngay
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* DANH SÁCH SẢN PHẨM */}
            <div className="w-full lg:flex-1 space-y-8">
              {cart.map((item) => (
                <div key={item.cartItemId || item.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-orange-50 flex flex-col sm:flex-row items-center gap-8 transition-all hover:shadow-xl group relative overflow-hidden">
                  {/* Item Image */}
                  <div className="w-32 h-32 rounded-[2rem] overflow-hidden flex-shrink-0 bg-gray-50 border border-orange-50 shadow-inner">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl font-black text-[#4A2C2A] uppercase italic tracking-tighter mb-2 group-hover:text-[#a06b49] transition-colors">{item.name}</h3>
                    {item.toppings?.length > 0 && (
                      <div className="flex flex-wrap gap-2 sm:justify-start justify-center mt-3">
                        {item.toppings.map((t, idx) => (
                          <span key={idx} className="bg-orange-50 text-[#a06b49] px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-orange-100">
                            +{t.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-gray-400 font-bold mt-4 text-xs tracking-widest uppercase">
                      Đơn giá: {Number(item.price).toLocaleString()}₫
                    </p>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-6 sm:border-l sm:pl-10 border-gray-100">
                    <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                      <button onClick={() => updateQuantity(item.cartItemId || item.id, -1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl text-[#4A2C2A] transition-all shadow-sm"><FiMinus /></button>
                      <span className="w-12 text-center font-black text-[#4A2C2A] text-lg">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId || item.id, 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl text-[#4A2C2A] transition-all shadow-sm"><FiPlus /></button>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <p className="text-xl font-black text-[#4A2C2A] tracking-tighter italic">
                         {((Number(item.price) + toppingTotal(item)) * item.quantity).toLocaleString()}₫
                      </p>
                      <button 
                        onClick={() => removeItem(item.cartItemId || item.id)}
                        className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BOX THANH TOÁN (BILL) */}
            <div className="w-full lg:w-[450px] sticky top-28">
              <div className="bg-[#4A2C2A] rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden text-[#FFDBB6]">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#a06b49]/20 rounded-full -ml-20 -mb-20 blur-xl"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-3 text-[#a06b49]">
                     <FiTag /> Order Summary
                  </h3>
                  
                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between font-bold opacity-60 uppercase text-[10px] tracking-[0.2em]">
                      <span>Tạm tính</span>
                      <span>{subTotal.toLocaleString()}₫</span>
                    </div>
                    
                    {discountAmount > 0 && (
                      <div className="flex justify-between font-black text-emerald-400 uppercase text-[10px] tracking-[0.2em] bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                        <span className="flex items-center gap-2"><FiTag /> Giảm giá ({discount.code})</span>
                        <span>-{discountAmount.toLocaleString()}₫</span>
                      </div>
                    )}

                    <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                      <div>
                        <span className="font-black uppercase text-[10px] tracking-[0.4em] opacity-40 block mb-2">Tổng cộng</span>
                        <span className="text-5xl font-black tracking-tighter italic leading-none">
                          {finalTotal.toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="flex gap-3 mb-10 p-2 bg-white/5 rounded-[1.5rem] border border-white/10">
                    <input
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="MÃ GIẢM GIÁ"
                      className="flex-1 bg-transparent px-5 py-4 rounded-xl text-xs font-black tracking-widest focus:outline-none placeholder:text-white/20 uppercase"
                    />
                    <button onClick={applyDiscount} className="bg-[#FFDBB6] text-[#4A2C2A] px-8 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">
                      Dùng mã
                    </button>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-[#a06b49] text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-[#c48d6a] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                  >
                    {isCheckingOut ? <FiLoader className="animate-spin" /> : <><FiShoppingBag /> Thanh toán ngay</>}
                  </button>
                </div>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
                  <div className="h-[1px] w-8 bg-[#4A2C2A]"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4A2C2A]">Tea House Guarantee</p>
                  <div className="h-[1px] w-8 bg-[#4A2C2A]"></div>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;