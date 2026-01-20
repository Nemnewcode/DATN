import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddToCartModal from "../components/AddToCartModal";
import { FiShoppingBag, FiArrowLeft, FiCoffee } from "react-icons/fi";

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`http://localhost:5041/api/products/by-category/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // Hàm định dạng tiêu đề từ slug (ví dụ: trà-trai-cay -> TRÀ TRÁI CÂY)
  const formatTitle = (text) => {
    return text ? text.replace(/-/g, " ").toUpperCase() : "";
  };

  return (
    <section className="bg-[#FFF8F2] min-h-screen py-16 animate-in fade-in duration-500 text-left">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* BREADCRUMB & HEADER */}
        <div className="mb-12">
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 text-gray-400 hover:text-[#4A2C2A] font-bold text-xs uppercase tracking-widest transition-all mb-4"
          >
            <FiArrowLeft /> Quay lại trang chủ
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-orange-100 pb-8">
            <div>
              <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">
                Khám phá thực đơn
              </span>
              <h2 className="text-4xl font-black text-[#4A2C2A] italic uppercase tracking-tighter leading-none">
                Danh mục <span className="text-[#a06b49]">{formatTitle(slug)}</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm font-medium italic">
              Hiển thị {products.length} sản phẩm thơm ngon
            </p>
          </div>
        </div>

        {loading ? (
          /* SKELETON LOADING */
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/50 h-[400px] rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-orange-50">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                  <FiCoffee size={40} />
                </div>
                <p className="text-[#4A2C2A] text-xl font-bold mb-2">Chưa có sản phẩm nào</p>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto font-medium">Chúng tôi đang cập nhật thêm món mới cho danh mục này. Quay lại sau nhé!</p>
                <button onClick={() => navigate("/thuc-don")} className="bg-[#4A2C2A] text-[#FFDBB6] px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest">
                  Xem danh mục khác
                </button>
              </div>
            ) : (
              <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-orange-50 flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  >
                    {/* PRODUCT IMAGE */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/400x400?text=Tea+House")}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                         <button 
                            onClick={() => setSelectedProduct(item)}
                            className="bg-white text-[#4A2C2A] p-4 rounded-2xl shadow-xl transform translate-y-10 group-hover:translate-y-0 transition-all duration-500"
                         >
                            <FiShoppingBag size={20} />
                         </button>
                      </div>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="p-8 text-center flex-1 flex flex-col">
                      <h3 className="text-lg font-black text-[#4A2C2A] uppercase italic tracking-tight mb-2 group-hover:text-[#a06b49] transition-colors line-clamp-1">
                        {item.name}
                      </h3>

                      <p className="text-[#a06b49] font-black text-xl mb-6 tracking-tighter">
                        {Number(item.price).toLocaleString("vi-VN")}₫
                      </p>

                      <button
                        onClick={() => setSelectedProduct(item)}
                        className="mt-auto w-full bg-gray-50 text-[#4A2C2A] py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-[#4A2C2A] hover:text-[#FFDBB6] shadow-inner"
                      >
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {selectedProduct && (
        <AddToCartModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default CategoryPage;