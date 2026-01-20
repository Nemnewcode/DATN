import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag, FiChevronRight, FiArrowLeft } from "react-icons/fi";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const navigate = useNavigate();

  /* =======================
      LOAD & LISTEN CART
  ======================== */
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

  // Reset giảm giá nếu giỏ hàng thay đổi
  useEffect(() => {
    setDiscount(null);
    setDiscountAmount(0);
  }, [cart.length]);

  /* =======================
      HELPERS
  ======================== */
  const toppingTotal = (item) =>
    item.toppings?.reduce((sum, t) => sum + Number(t.price), 0) || 0;

  const subTotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) + toppingTotal(item)) * item.quantity,
    0
  );

  const finalTotal = Math.max(0, subTotal - discountAmount);

  // Cập nhật số lượng
  const updateQuantity = (cartItemId, delta) => {
    const updated = cart.map((item) => {
      // Dùng cartItemId nếu bạn đã dùng logic gộp topping ở modal, 
      // nếu chưa thì dùng item.id tạm thời
      const matchId = item.cartItemId || item.id;
      if (matchId === cartItemId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    
    // 🔥 Phát tín hiệu để Header cập nhật tiền ngay lập tức
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Xóa sản phẩm
  const removeItem = (cartItemId) => {
    const matchKey = cart[0]?.cartItemId ? 'cartItemId' : 'id';
    const updated = cart.filter((item) => item[matchKey] !== cartItemId);
    
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    
    // 🔥 Phát tín hiệu để Header trừ tiền ngay lập tức
    window.dispatchEvent(new Event("cartUpdated"));
  };

  /* =======================
      APPLY DISCOUNT
  ======================== */
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
      alert("✅ Áp dụng mã giảm giá thành công");
    } catch {
      setDiscount(null);
      setDiscountAmount(0);
      alert("❌ Mã giảm giá không hợp lệ hoặc đã hết hạn");
    }
  };

  /* =======================
      CHECKOUT
  ======================== */
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("🛒 Giỏ hàng trống!");

    const token = localStorage.getItem("token");
    if (!token) {
      window.dispatchEvent(new Event("openLoginModal"));
      return;
    }

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

      alert("✅ Đặt hàng thành công!");
      
      // Xóa giỏ hàng
      localStorage.removeItem("cart");
      setCart([]);
      
      // 🔥 Reset Header về 0đ
      window.dispatchEvent(new Event("cartUpdated"));
      
      navigate("/don-hang-cua-toi");
    } catch {
      alert("❌ Đặt hàng thất bại, vui lòng thử lại");
    }
  };

  return (
    <section className="bg-[#FAF7F2] min-h-screen py-16 px-6 animate-in fade-in duration-500 text-left">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-12">
            <button onClick={() => navigate("/thuc-don")} className="flex items-center gap-2 text-gray-400 hover:text-[#4A2C2A] font-bold text-xs uppercase tracking-widest transition-all mb-4">
                <FiArrowLeft /> Tiếp tục mua sắm
            </button>
            <h2 className="text-4xl font-black text-[#4A2C2A] tracking-tighter uppercase italic flex items-center gap-4">
               <FiShoppingBag className="text-[#a06b49]" /> Giỏ hàng của bạn
            </h2>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-orange-50">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#a06b49]">
                <FiShoppingBag size={40} />
            </div>
            <p className="text-[#4A2C2A] text-xl font-bold mb-2">Giỏ hàng của bạn đang trống</p>
            <p className="text-gray-400 mb-10 max-w-sm mx-auto font-medium">Có vẻ như bạn chưa chọn được món đồ uống nào. Khám phá menu ngay nhé!</p>
            <button 
                onClick={() => navigate("/thuc-don")} 
                className="bg-[#4A2C2A] text-[#FFDBB6] px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
            >
              Xem thực đơn
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* DANH SÁCH SẢN PHẨM */}
            <div className="w-full lg:flex-1 space-y-6">
              {cart.map((item) => (
                <div key={item.cartItemId || item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-50 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 border border-orange-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-black text-[#4A2C2A] uppercase italic tracking-tight">{item.name}</h3>
                    {item.toppings?.length > 0 && (
                      <p className="text-[10px] text-[#a06b49] font-black uppercase tracking-widest mt-2 flex flex-wrap gap-2 sm:justify-start justify-center">
                        {item.toppings.map((t, idx) => (
                          <span key={idx} className="bg-orange-50 px-2 py-1 rounded-md">+{t.name}</span>
                        ))}
                      </p>
                    )}
                    <p className="text-gray-400 font-bold mt-3 text-sm">
                      Đơn giá: {Number(item.price).toLocaleString()}₫
                    </p>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:border-l sm:pl-8 border-gray-100">
                    <button 
                      onClick={() => removeItem(item.cartItemId || item.id)}
                      className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      <FiTrash2 size={18} />
                    </button>
                    
                    <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
                      <button onClick={() => updateQuantity(item.cartItemId || item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-[#4A2C2A] transition-colors"><FiMinus /></button>
                      <span className="w-10 text-center font-black text-[#4A2C2A]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId || item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-[#4A2C2A] transition-colors"><FiPlus /></button>
                    </div>
                    
                    <p className="text-lg font-black text-[#4A2C2A] tracking-tighter">
                       {((Number(item.price) + toppingTotal(item)) * item.quantity).toLocaleString()}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BOX THANH TOÁN */}
            <div className="w-full lg:w-[420px] sticky top-28">
              <div className="bg-[#4A2C2A] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-[#FFDBB6]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                
                <h3 className="text-xl font-black uppercase italic tracking-widest mb-8 flex items-center gap-2">
                   <FiTag className="text-[#a06b49]" /> Hóa đơn
                </h3>
                
                <div className="space-y-5 mb-10">
                  <div className="flex justify-between font-bold opacity-70 uppercase text-[10px] tracking-[0.2em]">
                    <span>Tạm tính</span>
                    <span>{subTotal.toLocaleString()}₫</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between font-bold text-emerald-400 uppercase text-[10px] tracking-[0.2em]">
                      <span>Giảm giá</span>
                      <span>-{discountAmount.toLocaleString()}₫</span>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <span className="font-black uppercase text-[10px] tracking-[0.3em] opacity-50 mb-1">Tổng cộng</span>
                    <span className="text-4xl font-black tracking-tighter italic">
                      {finalTotal.toLocaleString()}₫
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mb-8 relative z-10">
                  <input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="MÃ GIẢM GIÁ"
                    className="flex-1 bg-white/10 border border-white/10 px-5 py-4 rounded-2xl text-xs font-bold focus:outline-none focus:bg-white/20 transition-all placeholder:text-white/20"
                  />
                  <button onClick={applyDiscount} className="bg-[#a06b49] text-white px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c48d6a] transition-all shadow-lg">
                    Áp dụng
                  </button>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#FFDBB6] text-[#4A2C2A] py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                  Xác nhận đơn hàng <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <p className="mt-6 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">
                Miễn phí vận chuyển cho đơn hàng từ 500k
              </p>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;