import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminProducts, deleteAdminProduct } from "../../services/adminProduct";
import api from "../../services/api";
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiEyeOff, FiCoffee, FiFilter } from "react-icons/fi";
// Import Toast Component của bạn
import Toast from "../../components/Toast"; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Trạng thái cho Toast
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    loadInitialData();
  }, []);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [prodData, catRes] = await Promise.all([
        getAdminProducts(),
        api.get("/categories")
      ]);
      setProducts(prodData);
      setCategories(catRes.data);
    } catch (error) {
      showNotification("❌ Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    const data = await getAdminProducts();
    setProducts(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await deleteAdminProduct(id);
      showNotification("🗑️ Đã xóa sản phẩm thành công!");
      loadProducts();
    } catch (error) {
      showNotification("❌ Xóa sản phẩm thất bại");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/products/${id}/toggle`);
      showNotification(currentStatus ? "👁️ Đã ẩn sản phẩm khỏi Menu" : "✅ Đã hiển thị sản phẩm lên Menu");
      loadProducts();
    } catch (error) {
      showNotification("❌ Không thể thay đổi trạng thái");
    }
  };

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-100 border-t-[#4A2C2A]"></div>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-700 text-left relative">
      
      {/* HIỂN THỊ TOAST THÔNG BÁO */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: "" })} 
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#4A2C2A] tracking-tighter uppercase italic">
            Quản lý sản phẩm
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-1">
            Điều chỉnh danh mục menu và giá cả sản phẩm
          </p>
        </div>

        <Link
          to="/admin/products/create"
          className="flex items-center justify-center gap-2 bg-[#4A2C2A] text-[#FFDBB6] px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#4A2C2A]/20 hover:scale-105 transition-all active:scale-95"
        >
          <FiPlus strokeWidth={3} size={18} /> Thêm sản phẩm
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-white p-5 rounded-[2rem] shadow-sm border border-orange-50">
        <div className="flex items-center gap-2 text-[#4A2C2A] font-black mr-2">
          <FiFilter className="text-[#a06b49]" />
          <span className="text-[10px] uppercase tracking-[0.2em]">Bộ lọc:</span>
        </div>
        
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
            selectedCategory === "All" 
            ? "bg-[#4A2C2A] text-[#FFDBB6] shadow-lg shadow-[#4A2C2A]/20" 
            : "bg-gray-50 text-gray-400 hover:bg-orange-50"
          }`}
        >
          TẤT CẢ
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              selectedCategory === cat.name 
              ? "bg-[#4A2C2A] text-[#FFDBB6] shadow-lg shadow-[#4A2C2A]/20" 
              : "bg-gray-50 text-gray-400 hover:bg-orange-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-orange-50 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.3em]">
                <th className="p-8">Sản phẩm</th>
                <th className="p-8">Danh mục</th>
                <th className="p-8">Giá niêm yết</th>
                <th className="p-8 text-center">Trạng thái</th>
                <th className="p-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-400 italic font-medium">
                    Không tìm thấy sản phẩm nào trong danh mục này...
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-orange-50/30 transition-all group">
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden bg-gray-50 flex-shrink-0 border border-orange-50 shadow-inner relative">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                              <FiCoffee size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-[#4A2C2A] text-lg tracking-tight leading-tight mb-1">{p.name}</p>
                          <p className="text-[10px] text-gray-300 uppercase tracking-[0.2em] font-black">ID: #{p.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-8">
                      <span className="px-4 py-1.5 bg-orange-50 text-[#a06b49] rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-8">
                      <p className="text-xl font-black text-[#4A2C2A] tracking-tighter italic">
                        {Number(p.price).toLocaleString("vi-VN")}₫
                      </p>
                    </td>

                    <td className="p-8 text-center">
                      <button
                        onClick={() => handleToggle(p.id, p.is_active)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all border-2 ${
                          p.is_active
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white"
                            : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white"
                        }`}
                      >
                        {p.is_active ? <FiEye strokeWidth={2.5} /> : <FiEyeOff strokeWidth={2.5} />}
                        {p.is_active ? "Đang bán" : "Ngừng bán"}
                      </button>
                    </td>

                    <td className="p-8">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/admin/products/edit/${p.id}`}
                          className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#4A2C2A] hover:text-[#FFDBB6] transition-all shadow-sm"
                        >
                          <FiEdit3 size={20} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;