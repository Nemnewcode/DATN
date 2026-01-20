import React, { useEffect, useState } from "react";
import AddToCartModal from "../components/AddToCartModal";
import { FaFilter, FaCoffee, FaAppleAlt, FaIceCream, FaLeaf, FaBreadSlice, FaPlus } from "react-icons/fa";

const categoryIcons = {
  "nuoc-ep": <FaAppleAlt />,
  "tra-trai-cay": <FaLeaf />,
  "da-xay": <FaIceCream />,
  "ca-phe": <FaCoffee />,
  "banh-ngot": <FaBreadSlice />,
};

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5041/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5041/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const filterByCategory = (slug) => {
    setActiveCategory(slug);
    setShowFilter(false);
    if (slug === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category_slug === slug));
    }
  };

  return (
    <section className="bg-[#FAF7F2] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* ===== HEADER & FILTER ===== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black text-[#4A2C2A] tracking-tighter uppercase italic">
              Menu Đặc Sản
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Khám phá hương vị cà phê và bánh ngọt thủ công</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-3 bg-white border border-orange-100 px-6 py-3 rounded-2xl shadow-sm font-bold text-[#4A2C2A] hover:bg-orange-50 transition-all active:scale-95"
            >
              <FaFilter className="text-sm" />
              {activeCategory === "all" ? "Tất cả món" : categories.find(c => c.slug === activeCategory)?.name}
            </button>

            {showFilter && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-orange-50 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                <button
                  onClick={() => filterByCategory("all")}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-sm transition-colors ${
                    activeCategory === "all" ? "bg-[#4A2C2A] text-white" : "hover:bg-orange-50 text-[#4A2C2A]"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeCategory === "all" ? "bg-white/20" : "bg-gray-100"}`}>
                    <FaFilter />
                  </div>
                  <span className="font-bold">Tất cả món</span>
                </button>

                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => filterByCategory(cat.slug)}
                    className={`w-full flex items-center gap-4 px-5 py-4 text-sm transition-colors ${
                      activeCategory === cat.slug ? "bg-[#4A2C2A] text-white" : "hover:bg-orange-50 text-[#4A2C2A]"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${activeCategory === cat.slug ? "bg-white/20" : "bg-gray-100"}`}>
                      {categoryIcons[cat.slug] || <FaCoffee />}
                    </div>
                    <span className="font-bold">{cat.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== PRODUCTS GRID ===== */}
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map(item => (
            <div 
              key={item.id} 
              className="group bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-xl transition-all duration-500 border border-orange-50 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-[2rem] h-60 mb-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                
                {/* Badge Category */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#4A2C2A] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {item.category_name || "Mới"}
                </div>
              </div>

              {/* Content */}
              <div className="px-2 flex flex-col flex-1">
                <h3 className="font-bold text-[#4A2C2A] text-lg leading-tight min-h-[3rem] line-clamp-2">
                  {item.name}
                </h3>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-[#4A2C2A]">
                    {Number(item.price).toLocaleString("vi-VN")}₫
                  </span>
                  
                  <button
                    onClick={() => setSelectedProduct(item)}
                    className="bg-[#4A2C2A] text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-black hover:scale-110 transition-all shadow-lg shadow-[#4A2C2A]/20"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-medium italic">Chưa có món nào trong danh mục này...</p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <AddToCartModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default Menu;