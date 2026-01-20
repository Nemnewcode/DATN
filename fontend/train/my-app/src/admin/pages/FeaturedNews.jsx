import React, { useEffect, useState } from "react";
import {
  getFeaturedNews,
  createFeaturedNews,
  updateFeaturedNews,
  deleteFeaturedNews,
} from "../../services/adminFeaturedNews";
import { getAdminProducts } from "../../services/adminProduct";
import { FiPlus, FiEdit3, FiTrash2, FiImage, FiType, FiLink, FiCheck, FiX, FiSave, FiFileText } from "react-icons/fi";

const FeaturedNews = () => {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    recipe_content: "",
    drink_id: "",
    is_active: true,
    thumbnail: null,
  });

  const slugify = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getFeaturedNews();
      setData(res);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const loadProds = async () => {
        const res = await getAdminProducts();
        setProducts(res);
    };
    loadProds();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xoá bài viết này?")) return;
    try {
      await deleteFeaturedNews(id);
      fetchData();
    } catch (err) { alert("Xoá thất bại"); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "title") {
      setForm({ ...form, title: value, slug: slugify(value) });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, thumbnail: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm({ title: "", slug: "", short_description: "", recipe_content: "", drink_id: "", is_active: true, thumbnail: null });
    setPreview(null);
    setEditing(null);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      slug: item.slug,
      short_description: item.short_description || "",
      recipe_content: item.recipe_content,
      drink_id: item.drink_id,
      is_active: item.is_active,
      thumbnail: null,
    });
    setPreview(item.thumbnail);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.drink_id) return alert("Vui lòng chọn sản phẩm liên quan");

    setIsSubmitting(true);
    const formData = new FormData();
    // Đưa tất cả các trường vào FormData kể cả short_description
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    try {
      if (editing) {
        await updateFeaturedNews(editing.id, formData);
      } else {
        await createFeaturedNews(formData);
      }
      
      alert("✅ Đã lưu tin tức thành công");
      resetForm();
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert("❌ Lỗi hệ thống khi lưu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 text-left animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-black text-[#4A2C2A] uppercase italic tracking-tighter">Tin tức nổi bật</h1>
            <p className="text-gray-400 text-sm font-medium">Quản lý bài viết và công thức đồ uống</p>
        </div>
        <button
          type="button"
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-[#4A2C2A] text-[#FFDBB6] px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
        >
          <FiPlus strokeWidth={3} /> Thêm Featured News
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-widest">
            <tr>
              <th className="p-6">Thông tin bài viết</th>
              <th className="p-6">Sản phẩm</th>
              <th className="p-6 text-center">Trạng thái</th>
              <th className="p-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-orange-50/20 transition-all group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={item.thumbnail} className="w-12 h-12 rounded-xl object-cover border" alt="" />
                    <div>
                        <p className="font-bold text-[#4A2C2A]">{item.title}</p>
                        <p className="text-[10px] text-gray-400 italic">{item.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                        {item.drink_name}
                    </span>
                </td>
                <td className="p-6 text-center">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${item.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {item.is_active ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                </td>
                <td className="p-6 text-right space-x-2">
                  <button onClick={() => handleEdit(item)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#4A2C2A] hover:text-[#FFDBB6] transition-all"><FiEdit3 size={16}/></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><FiTrash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-[#4A2C2A]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-2xl font-black text-[#4A2C2A] uppercase italic tracking-tight">{editing ? "Cập nhật bài viết" : "Thêm bài viết mới"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-rose-500 transition-colors"><FiX size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-5 custom-scrollbar">
              {/* Tiêu đề */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề tin tức</label>
                <div className="relative">
                  <FiType className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input name="title" value={form.title} onChange={handleChange} className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-bold text-[#4A2C2A]" placeholder="Nhập tiêu đề..." required />
                </div>
              </div>

              {/* MÔ TẢ NGẮN (BỔ SUNG) */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mô tả ngắn</label>
                <div className="relative">
                  <FiFileText className="absolute left-4 top-6 text-gray-300" />
                  <textarea name="short_description" rows={2} value={form.short_description} onChange={handleChange} className="w-full bg-gray-50 border-none pl-12 p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-medium text-[#4A2C2A] resize-none" placeholder="Tóm tắt ngắn gọn nội dung bài viết..." />
                </div>
              </div>

              {/* Sản phẩm liên quan */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sản phẩm liên quan</label>
                <select name="drink_id" value={form.drink_id} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-bold text-[#4A2C2A] appearance-none cursor-pointer" required>
                  <option value="">-- Chọn món trong Menu --</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              {/* Nội dung chi tiết */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nội dung chi tiết / Công thức</label>
                <textarea name="recipe_content" rows={5} value={form.recipe_content} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] outline-none font-medium text-[#4A2C2A]" placeholder="Viết nội dung bài viết tại đây..." required />
              </div>

              {/* Hình ảnh */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hình ảnh đại diện</label>
                <div className="flex items-center gap-4">
                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:bg-orange-50 cursor-pointer transition-all">
                        <FiImage className="text-gray-300 mb-1" size={24}/>
                        <span className="text-[10px] font-bold text-gray-400">Chọn ảnh từ máy</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    {preview && <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded-2xl border-2 border-[#FFDBB6]" />}
                </div>
              </div>

              {/* Checkbox hiển thị */}
              <label className="flex items-center gap-3 p-2 w-fit cursor-pointer group">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-5 h-5 rounded-lg text-[#4A2C2A] focus:ring-0 border-none bg-gray-100 cursor-pointer" />
                <span className="text-sm font-bold text-gray-500 group-hover:text-[#4A2C2A] transition-colors">Công khai bài viết</span>
              </label>

              {/* NÚT LƯU */}
              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
                >
                  Đóng
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`flex-1 bg-[#4A2C2A] text-[#FFDBB6] py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 transition-all'}`}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-[#FFDBB6]/30 border-t-[#FFDBB6] rounded-full animate-spin"></div>
                  ) : (
                    <FiSave size={16}/>
                  )}
                  {editing ? "Cập nhật ngay" : "Đăng bài viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedNews;