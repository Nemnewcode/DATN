import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminProducts, deleteAdminProduct } from "../../services/adminProduct";
import api from "../../services/api";
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiEyeOff, FiCoffee, FiFilter } from "react-icons/fi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Lưu danh sách danh mục
  const [selectedCategory, setSelectedCategory] = useState("All"); // Danh mục đang chọn
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Gọi đồng thời cả sản phẩm và danh mục
      const [prodData, catRes] = await Promise.all([
        getAdminProducts(),
        api.get("/categories")
      ]);
      
      setProducts(prodData);
      setCategories(catRes.data);
    } catch (error) {
      alert("❌ Không tải được dữ liệu");
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
      loadProducts();
    } catch (error) {
      alert("❌ Xóa sản phẩm thất bại");
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/admin/products/${id}/toggle`);
      loadProducts();
    } catch (error) {
      alert("❌ Không thể thay đổi trạng thái sản phẩm");
    }
  };

  // Logic lọc sản phẩm
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A2C2A]"></div>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-700 text-left">
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
          className="flex items-center justify-center gap-2 bg-[#4A2C2A] text-[#FFDBB6] px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#4A2C2A]/20 hover:scale-105 transition-all active:scale-95"
        >
          <FiPlus strokeWidth={3} /> Thêm sản phẩm
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-white p-4 rounded-[1.5rem] shadow-sm border border-orange-50">
        <div className="flex items-center gap-2 text-[#4A2C2A] font-bold mr-2">
          <FiFilter />
          <span className="text-sm uppercase tracking-wider">Lọc:</span>
        </div>
        
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
            selectedCategory === "All" 
            ? "bg-[#4A2C2A] text-[#FFDBB6] shadow-md" 
            : "bg-gray-100 text-gray-500 hover:bg-orange-100"
          }`}
        >
          TẤT CẢ
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase transition-all ${
              selectedCategory === cat.name 
              ? "bg-[#4A2C2A] text-[#FFDBB6] shadow-md" 
              : "bg-gray-100 text-gray-500 hover:bg-orange-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* PRODUCT TABLE CARD */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
              <th className="p-6">Sản phẩm</th>
              <th className="p-6">Danh mục</th>
              <th className="p-6">Giá niêm yết</th>
              <th className="p-6 text-center">Trạng thái</th>
              <th className="p-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-gray-400 italic">
                  Không tìm thấy sản phẩm nào trong danh mục này...
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-orange-50/20 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-orange-50 shadow-sm">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <FiCoffee size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#4A2C2A] leading-tight">{p.name}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">ID: #{p.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {p.category}
                    </span>
                  </td>

                  <td className="p-6">
                    <p className="text-lg font-black text-[#4A2C2A]">
                      {Number(p.price).toLocaleString("vi-VN")}₫
                    </p>
                  </td>

                  <td className="p-6 text-center">
                    <button
                      onClick={() => handleToggle(p.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        p.is_active
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white"
                          : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white"
                      }`}
                    >
                      {p.is_active ? <FiEye /> : <FiEyeOff />}
                      {p.is_active ? "Đang bán" : "Ẩn Menu"}
                    </button>
                  </td>

                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#4A2C2A] hover:text-[#FFDBB6] transition-all shadow-sm"
                        title="Chỉnh sửa"
                      >
                        <FiEdit3 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-3 bg-rose-50 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        title="Xóa sản phẩm"
                      >
                        <FiTrash2 size={18} />
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
  );
};

export default Products;