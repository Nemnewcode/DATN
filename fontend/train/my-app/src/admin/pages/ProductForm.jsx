import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { createAdminProduct, updateAdminProduct } from "../../services/adminProduct";
import { addProductImage, setMainImage, deleteProductImage } from "../../services/adminProductImage";
import { getProductToppings, updateProductToppings } from "../../services/adminProductTopping";
import { FiSave, FiImage, FiPlus, FiTrash2, FiStar, FiCoffee, FiArrowLeft } from "react-icons/fi";

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

  useEffect(() => {
    loadCategories();
    loadToppings();
    if (id) loadProduct();
  }, [id]);

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const loadToppings = async () => {
    const res = await api.get("/admin/toppings");
    setToppings(res.data.filter((t) => t.is_active));
  };

  const loadProduct = async () => {
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
      } else {
        const res = await createAdminProduct(payload);
        if (res?.id && selectedToppings.length > 0) {
          await updateProductToppings(res.id, selectedToppings);
        }
      }
      alert("✅ Lưu thành công");
      navigate("/admin/products");
    } catch (err) {
      alert("❌ Thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ================= IMAGE ACTIONS (FIX ERROR) =================
  const handleAddImage = async () => {
    if (!imageUrl) return;
    try {
      await addProductImage(id, { image_url: imageUrl, is_main: images.length === 0 });
      setImageUrl("");
      loadProduct(); // Load lại để cập nhật danh sách ảnh
    } catch { 
      alert("❌ Thêm ảnh thất bại"); 
    }
  };

  const handleSetMain = async (imageId) => {
    try {
      await setMainImage(imageId);
      loadProduct(); // Load lại để cập nhật trạng thái is_main
    } catch (err) {
      alert("❌ Không thể đặt làm ảnh chính");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Xóa ảnh này?")) return;
    try {
      await deleteProductImage(imageId);
      loadProduct(); // Load lại danh sách ảnh
    } catch (err) {
      alert("❌ Xóa ảnh thất bại");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/products")} className="p-3 bg-white rounded-2xl shadow-sm border border-orange-100 hover:bg-orange-50 transition-all">
            <FiArrowLeft className="text-[#4A2C2A]" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#4A2C2A] tracking-tighter uppercase italic">
              {id ? "Hiệu chỉnh món" : "Thêm món mới"}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-50">
            <h2 className="text-sm font-black text-[#4A2C2A] uppercase tracking-widest mb-6 flex items-center gap-2">
              <FiCoffee className="text-orange-400" /> Thông tin cơ bản
            </h2>
            
            <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên sản phẩm</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giá (₫)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Danh mục</label>
                  <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-bold text-[#4A2C2A]" required>
                    <option value="">Chọn loại món</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mô tả</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] transition-all outline-none font-medium text-[#4A2C2A] resize-none" />
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                <span className="text-sm font-bold text-[#4A2C2A]">Trạng thái kinh doanh</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </form>
          </section>

          {id && (
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-50 animate-in fade-in duration-700">
              <h2 className="text-sm font-black text-[#4A2C2A] uppercase tracking-widest mb-6">Lựa chọn Topping</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {toppings.map((t) => (
                  <button key={t.id} onClick={() => toggleTopping(t.id)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedToppings.includes(t.id) ? "border-[#4A2C2A] bg-orange-50/50 text-[#4A2C2A]" : "border-gray-100 text-gray-400"}`}>
                    <span className="text-xs font-bold">{t.name}</span>
                    <span className="text-[10px] font-black opacity-60">+{Number(t.price).toLocaleString()}₫</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          {id ? (
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-50 sticky top-8">
              <h2 className="text-sm font-black text-[#4A2C2A] uppercase tracking-widest mb-6 flex items-center gap-2">
                <FiImage className="text-blue-400" /> Thư viện ảnh
              </h2>
              
              <div className="flex gap-2 mb-6">
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Dán link ảnh..." className="flex-1 bg-gray-50 border-none px-4 py-3 rounded-xl text-xs outline-none" />
                <button type="button" onClick={handleAddImage} className="bg-[#4A2C2A] text-white p-3 rounded-xl transition-all hover:scale-105"><FiPlus /></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group rounded-2xl overflow-hidden border border-gray-100 h-28">
                    <img src={img.image_url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                      <button onClick={() => handleSetMain(img.id)} className={`p-2 rounded-lg ${img.is_main ? "bg-[#FFDBB6] text-[#4A2C2A]" : "bg-white/20 hover:bg-white/40"}`}><FiStar size={14} /></button>
                      <button onClick={() => handleDeleteImage(img.id)} className="p-2 rounded-lg bg-rose-500/80 hover:bg-rose-500"><FiTrash2 size={14} /></button>
                    </div>
                    {img.is_main && <div className="absolute top-2 left-2 bg-[#FFDBB6] text-[#4A2C2A] p-1 rounded-md shadow-md"><FiStar size={10} /></div>}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="bg-[#4A2C2A] p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl">💡</div>
                <p className="text-sm opacity-80 leading-relaxed italic">Hãy lưu món trước khi thêm ảnh và Topping.</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-10 right-10 flex items-center gap-4">
        <button type="button" onClick={() => navigate("/admin/products")} className="bg-white text-gray-500 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl border border-gray-100 hover:bg-gray-50 transition-all">Huỷ</button>
        <button form="productForm" disabled={loading} className="bg-[#4A2C2A] text-[#FFDBB6] px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
          {loading ? "Đang xử lý..." : <><FiSave /> {id ? "Cập nhật" : "Tạo món"}</>}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;