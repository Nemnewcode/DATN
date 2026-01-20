import React, { useEffect, useState } from "react";
import Toast from "./Toast";
import api from "../services/api";
import AddToCartModal from "../components/AddToCartModal";
import { FiPlus, FiShoppingBag, FiHeart } from "react-icons/fi";

const MenuToday = () => {
  const [products, setProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.slice(0, 8));
      } catch (err) {
        console.error("Lỗi tải menu hôm nay", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (item) => {
    // Logic này thường được xử lý bên trong AddToCartModal, 
    // nhưng nếu bạn giữ ở đây thì tôi đã tối ưu lại UI Toast.
    setToastMessage(`🛒 Đã thêm "${item.name}" vào giỏ hàng`);
    setSelectedProduct(null);
  };

  return (
    <section className="bg-[#FFF8F2] py-20 relative overflow-hidden">
      {/* Decor nền */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
            Thưởng thức mỗi ngày
          </span>
          <h2 className="text-4xl font-black text-[#4A2C2A] italic uppercase tracking-tighter leading-none">
            Menu <span className="text-[#a06b49]">Hôm Nay</span>
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 bg-[#a06b49]"></span>
            <span className="text-[#4A2C2A] text-xl">✨</span>
            <span className="h-[2px] w-8 bg-[#a06b49]"></span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/50 h-96 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 xl:grid-cols-4">
            {products.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-orange-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative"
              >
                {/* Nút yêu thích nhanh */}
                <button className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-sm">
                  <FiHeart />
                </button>

                {/* IMAGE CONTAINER */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.image || "https://via.placeholder.com/300x400?text=Tea+House"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                     <button 
                        onClick={() => setSelectedProduct(item)}
                        className="bg-white text-[#4A2C2A] p-4 rounded-2xl shadow-xl transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 font-bold flex items-center gap-2"
                     >
                        <FiShoppingBag /> Thêm nhanh
                     </button>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-8 text-center">
                  <h3 className="text-lg font-black text-[#4A2C2A] uppercase italic tracking-tight line-clamp-1 group-hover:text-[#a06b49] transition-colors">
                    {item.name}
                  </h3>
                  
                  <p className="text-[#a06b49] font-black text-xl mt-3 tracking-tighter">
                    {item.price.toLocaleString("vi-VN")}₫
                  </p>

                  <button
                    onClick={() => setSelectedProduct(item)}
                    className="mt-6 w-full py-4 bg-gray-50 text-[#4A2C2A] rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#4A2C2A] group-hover:text-[#FFDBB6] transition-all duration-300 shadow-inner group-hover:shadow-lg"
                  >
                    <FiPlus strokeWidth={3} /> Tùy chọn món
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL & TOAST */}
      {selectedProduct && (
        <AddToCartModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={handleAddToCart}
        />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}
    </section>
  );
};

export default MenuToday;