import React, { useState } from "react";
import { FiX, FiPlus, FiMinus, FiCheck, FiShoppingBag } from "react-icons/fi";

const AddToCartModal = ({ product, onClose }) => {
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const toggleTopping = (topping) => {
    const exists = selectedToppings.find((t) => t.id === topping.id);
    if (exists) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Tạo ID duy nhất cho dòng sản phẩm (bao gồm cả các topping đã chọn)
    const cartItemId = `${product.id}-${selectedToppings.map(t => t.id).sort().join('-')}`;

    const cartItem = {
      cartItemId,
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: quantity,
      toppings: selectedToppings,
    };

    // Kiểm tra nếu đã có sản phẩm y hệt trong giỏ thì tăng số lượng
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    // Toast thông báo đẹp hơn
    showToast(`Đã thêm ${quantity} x ${product.name}`);
    onClose();
  };

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#4A2C2A] text-[#FFDBB6] px-8 py-4 rounded-2xl shadow-2xl z-[100] font-bold animate-bounce flex items-center gap-3";
    toast.innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  };

  const totalPrice = (Number(product.price) + selectedToppings.reduce((s, t) => s + Number(t.price), 0)) * quantity;

  return (
    <div className="fixed inset-0 bg-[#4A2C2A]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute top-5 right-5 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-[#4A2C2A] hover:bg-rose-500 hover:text-white transition-all">
          <FiX size={20} />
        </button>

        {/* PRODUCT IMAGE & INFO */}
        <div className="relative h-56 flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        <div className="px-8 pb-8 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-black text-2xl text-[#4A2C2A] italic uppercase tracking-tighter">{product.name}</h3>
            <span className="text-xl font-black text-[#a06b49]">{Number(product.price).toLocaleString("vi-VN")}₫</span>
          </div>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">Hương vị trà sữa tươi ngon độc đáo, công thức chuẩn từ Tea House.</p>

          {/* TOPPINGS SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Tùy chọn Topping</p>
              {selectedToppings.length > 0 && <span className="text-[10px] font-bold text-[#a06b49]">Đã chọn {selectedToppings.length}</span>}
            </div>

            <div className="grid grid-cols-1 gap-2">
              {product.toppings?.length > 0 ? (
                product.toppings.map((t) => {
                  const isSelected = selectedToppings.some((x) => x.id === t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTopping(t)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        isSelected 
                        ? "border-[#4A2C2A] bg-orange-50/50" 
                        : "border-gray-50 bg-gray-50/30 hover:border-orange-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[#4A2C2A] border-[#4A2C2A]" : "border-gray-300"}`}>
                          {isSelected && <FiCheck className="text-white" size={12} />}
                        </div>
                        <span className={`text-sm font-bold ${isSelected ? "text-[#4A2C2A]" : "text-gray-500"}`}>{t.name}</span>
                      </div>
                      <span className="text-xs font-black text-[#a06b49]">+ {Number(t.price).toLocaleString()}₫</span>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-2xl text-center">Món này không có thêm topping</p>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-8 bg-gray-50/80 backdrop-blur-md border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl shadow-inner border border-gray-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-[#4A2C2A] hover:bg-gray-100 transition-colors"
              >
                <FiMinus />
              </button>
              <span className="w-8 text-center font-black text-[#4A2C2A]">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-[#4A2C2A] hover:bg-gray-100 transition-colors"
              >
                <FiPlus />
              </button>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng thanh toán</p>
              <p className="text-2xl font-black text-[#4A2C2A]">{totalPrice.toLocaleString("vi-VN")}₫</p>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-[#4A2C2A] text-[#FFDBB6] py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <FiShoppingBag size={18} /> Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;