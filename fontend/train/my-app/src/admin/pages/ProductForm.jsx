import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { createAdminProduct, updateAdminProduct } from "../../services/adminProduct";
import { addProductImage, setMainImage, deleteProductImage } from "../../services/adminProductImage";
import { getProductToppings, updateProductToppings } from "../../services/adminProductTopping";
import { FiSave, FiImage, FiPlus, FiTrash2, FiStar, FiCoffee, FiArrowLeft, FiLoader } from "react-icons/fi";
import Toast from "../../components/Toast"; // Đảm bảo đúng đường dẫn component Toast

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    description: "",
    is_active: true,
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [toppings, setToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  
  // Trạng thái thông báo Toast
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    loadCategories();
    loadToppings();
    if (id) loadProduct();
  }, [id]);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) { console.error("Lỗi tải danh mục"); }
  };

  const loadToppings = async () => {
    try {
      const res = await api.get("/admin/toppings");
      setToppings(res.data.filter((t) => t.is_active));
    } catch (err) { console.error("Lỗi tải topping"); }
  };

  const loadProduct = async () => {
    try {
      const res = await api.get(`/admin/products/${id}`);
      setForm({
        name: res.data.name,
        price: res.data.price,
        category_id: res.data.category_id,
        description: res.data.description || "",
        is_active: res.data.is_active,
      });
      setImages(res.data.images || []);
      const toppingIds = await getProductToppings(id);
      setSelectedToppings(toppingIds);
    } catch (err) { showNotification("❌ Lỗi tải thông tin món"); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const toggleTopping = (toppingId) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId) ? prev.filter((id) => id !== toppingId) : [...prev, toppingId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        category_id: Number(form.category_id),
        description: form.description,
        is_active: form.is_active,
      };

      if (id) {
        await updateAdminProduct(id, payload);
        await updateProductToppings(id, selectedToppings);
        showNotification("✅ Cập nhật món thành công!");
      } else {
        const res = await createAdminProduct(payload);
        if (res?.id && selectedToppings.length > 0) {
          await updateProductToppings(res.id, selectedToppings);
        }
        showNotification("🎉 Đã thêm món mới thành công!");
      }
      
      // Đợi Toast hiển thị một chút rồi mới chuyển trang
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      showNotification("❌ Thao tác thất bại, vui lòng kiểm tra lại");
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async () => {
    if (!imageUrl) return;
    try {
      await addProductImage(id, { image_url: imageUrl, is_main: images.length === 0 });
      setImageUrl("");
      showNotification("📸 Đã thêm ảnh mới");
      loadProduct();
    } catch { showNotification("❌ Thêm ảnh thất bại"); }
  };

  const handleSetMain = async (imageId) => {
    try {
      await setMainImage(imageId);
      showNotification("⭐ Đã cập nhật ảnh chính");
      loadProduct();
    } catch (err) { showNotification("❌ Không thể đổi ảnh chính"); }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Xóa ảnh này?")) return;
    try {
      await deleteProductImage(imageId);
      showNotification("🗑️ Đã xóa ảnh");
      loadProduct();
    } catch (err) { showNotification("❌ Xóa ảnh thất bại"); }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700 pb-32 text-left relative">
      
      {/* HIỂN THỊ TOAST */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: "" })} 
        />
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate("/admin/products")} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-orange-100 hover:bg-[#4A2C2A] hover:text-white transition-all group">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-1 block">Quản lý Menu</span>
            <h1 className="text-4xl font-black text-[#4A2C2A] tracking-tighter uppercase italic leading-none">
              {id ? "Hiệu chỉnh món" : "Tạo món mới"}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* CỘT TRÁI & GIỮA: THÔNG TIN & TOPPING */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-orange-50">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <FiCoffee className="text-[#a06b49]" /> Thông tin món uống
            </h2>
            
            <form id="productForm" onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#4A2C2A] uppercase tracking-widest ml-1">Tên món</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="VD: Trà sữa nướng" className="w-full bg-gray-50 border-none p-5 rounded-[1.5rem] focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A] text-lg" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#4A2C2A] uppercase tracking-widest ml-1">Giá bán (₫)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0" className="w-full bg-gray-50 border-none p-5 rounded-[1.5rem] focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#4A2C2A] uppercase tracking-widest ml-1">Danh mục</label>
                  <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full bg-gray-50 border-none p-5 rounded-[1.5rem] focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A] appearance-none cursor-pointer" required>
                    <option value="">Chọn loại món</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-[#4A2C2A] uppercase tracking-widest ml-1">Mô tả hương vị</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="5" placeholder="Ghi chú về nguyên liệu, hương vị..." className="w-full bg-gray-50 border-none p-5 rounded-[1.5rem] focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-medium text-[#4A2C2A] resize-none" />
              </div>

              <div className="flex items-center justify-between p-6 bg-orange-50/50 rounded-[1.5rem] border border-orange-100">
                <div>
                  <p className="text-sm font-black text-[#4A2C2A] uppercase tracking-tight">Trạng thái kinh doanh</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Món sẽ hiển thị trên Menu khách hàng</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="sr-only peer" />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all shadow-inner"></div>
                </label>
              </div>
            </form>
          </section>

          {id && (
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-orange-50 animate-in fade-in duration-1000">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Danh sách Topping đi kèm</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toppings.map((t) => (
                  <button key={t.id} onClick={() => toggleTopping(t.id)} className={`flex flex-col p-4 rounded-2xl border-2 transition-all text-left ${selectedToppings.includes(t.id) ? "border-[#4A2C2A] bg-orange-50/50" : "border-gray-50 text-gray-400 hover:border-orange-200"}`}>
                    <span className={`text-[11px] font-black uppercase tracking-tight ${selectedToppings.includes(t.id) ? "text-[#4A2C2A]" : ""}`}>{t.name}</span>
                    <span className="text-[10px] font-bold opacity-60 mt-1">+{Number(t.price).toLocaleString()}₫</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* CỘT PHẢI: HÌNH ẢNH */}
        <div className="space-y-10">
          {id ? (
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-orange-50 sticky top-28">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <FiImage className="text-blue-400" /> Thư viện hình ảnh
              </h2>
              
              <div className="space-y-4 mb-8">
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Dán link ảnh tại đây..." className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100" />
                <button type="button" onClick={handleAddImage} className="w-full bg-[#4A2C2A] text-[#FFDBB6] p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#a06b49] transition-all shadow-lg">
                  <FiPlus size={16} /> Thêm vào thư viện
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative group rounded-[1.5rem] overflow-hidden border-2 border-gray-50 aspect-square shadow-inner">
                    <img src={img.image_url} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#4A2C2A]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 text-white backdrop-blur-[2px]">
                      <button onClick={() => handleSetMain(img.id)} title="Đặt làm ảnh chính" className={`p-2.5 rounded-xl transition-all ${img.is_main ? "bg-[#FFDBB6] text-[#4A2C2A] scale-110" : "bg-white/20 hover:bg-white"}`}>
                        <FiStar size={16} strokeWidth={img.is_main ? 3 : 2} />
                      </button>
                      <button onClick={() => handleDeleteImage(img.id)} title="Xóa ảnh" className="p-2.5 rounded-xl bg-rose-500/80 hover:bg-rose-600 transition-all">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    {img.is_main && (
                      <div className="absolute top-3 left-3 bg-[#FFDBB6] text-[#4A2C2A] px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                        <FiStar size={10} strokeWidth={3} />
                        <span className="text-[8px] font-black uppercase tracking-tighter">Main</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="bg-[#4A2C2A] p-10 rounded-[3rem] text-[#FFDBB6] shadow-2xl flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
                <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner">☕</div>
                <div>
                  <p className="text-lg font-black uppercase italic tracking-tighter mb-2">Chế độ khởi tạo</p>
                  <p className="text-xs opacity-60 leading-relaxed font-medium">Bạn cần nhấn "Tạo món" để lưu thông tin cơ bản trước khi có thể tải ảnh lên và chọn Topping đi kèm.</p>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* ACTION BAR CỐ ĐỊNH PHÍA DƯỚI */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-orange-50 p-6 z-40 flex justify-end gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button type="button" onClick={() => navigate("/admin/products")} className="px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-gray-400 hover:text-[#4A2C2A] transition-all">Huỷ bỏ</button>
        <button form="productForm" disabled={loading} className="bg-[#4A2C2A] text-[#FFDBB6] px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-[#4A2C2A]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50">
          {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
          {id ? "Cập nhật dữ liệu" : "Tạo món ngay"}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;