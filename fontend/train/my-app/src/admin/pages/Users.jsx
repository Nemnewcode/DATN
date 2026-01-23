import React, { useEffect, useState } from "react";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  toggleAdminUser,
} from "../../services/adminUsers";
import {
  FiUserPlus,
  FiEdit2,
  FiLock,
  FiUnlock,
  FiMail,
  FiShield,
  FiX,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import Toast from "../../components/Toast"; // Import Toast component của bạn

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
    is_active: true,
    phone: "",
    address: "",
  });

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      showNotification("❌ Lỗi tải danh sách người dùng");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateAdminUser(editing.id, form);
        showNotification("✅ Đã cập nhật thông tin người dùng!");
      } else {
        await createAdminUser(form);
        showNotification("🎉 Đã tạo tài khoản mới thành công!");
      }
      setShowForm(false);
      setEditing(null);
      fetchUsers();
    } catch (error) {
      showNotification("❌ Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleEdit = (u) => {
    setEditing(u);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      is_active: u.is_active,
      phone: u.phone || "",
      address: u.address || "",
    });
    setShowForm(true);
  };

  const handleToggle = async (user) => {
    const confirmMsg = user.is_active 
      ? `Khóa tài khoản của ${user.name}?` 
      : `Mở khóa tài khoản cho ${user.name}?`;
      
    if (window.confirm(confirmMsg)) {
      try {
        await toggleAdminUser(user.id);
        showNotification(user.is_active ? "🔒 Đã khóa tài khoản" : "🔓 Đã mở khóa tài khoản");
        fetchUsers();
      } catch (error) {
        showNotification("❌ Thao tác thất bại");
      }
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-700 text-left relative">
      
      {/* HIỂN THỊ TOAST */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: "" })} 
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-orange-100 pb-8">
        <div>
          <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Nhân sự & Hệ thống</span>
          <h1 className="text-4xl font-black text-[#4A2C2A] tracking-tighter uppercase italic leading-none">
            Quản lý <span className="text-[#a06b49]">Tài khoản</span>
          </h1>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm({ name: "", email: "", password: "", role: "User", is_active: true, phone: "", address: "" });
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-3 bg-[#4A2C2A] text-[#FFDBB6] px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#4A2C2A]/20 hover:scale-105 transition-all"
        >
          <FiUserPlus size={18} /> Thêm tài khoản
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-orange-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
                <th className="p-8">Thành viên</th>
                <th className="p-8">Thông tin liên lạc</th>
                <th className="p-8">Vai trò</th>
                <th className="p-8 text-center">Trạng thái</th>
                <th className="p-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-orange-50/20 transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#FFDBB6] flex items-center justify-center font-black text-[#4A2C2A] text-xl shadow-inner border border-[#4A2C2A]/10">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-[#4A2C2A] text-lg tracking-tight mb-1">{u.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">UID: #{u.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-8">
                    <div className="space-y-1.5">
                      <p className="text-sm text-gray-600 font-bold flex items-center gap-2">
                        <FiMail className="text-[#a06b49]" /> {u.email}
                      </p>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-2 italic">
                        <FiPhone className="text-gray-300" /> {u.phone || "---"}
                      </p>
                    </div>
                  </td>

                  <td className="p-8">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        u.role === "Admin" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}>
                      <FiShield size={12} /> {u.role}
                    </span>
                  </td>

                  <td className="p-8 text-center">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        u.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                      {u.is_active ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </td>

                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(u)}
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#4A2C2A] hover:text-[#FFDBB6] transition-all shadow-sm"
                        title="Chỉnh sửa"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleToggle(u)}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm ${
                          u.is_active ? "bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white" : "bg-emerald-50 text-emerald-500 hover:bg-emerald-600 hover:text-white"
                        }`}
                        title={u.is_active ? "Khóa" : "Mở khóa"}
                      >
                        {u.is_active ? <FiLock size={18} /> : <FiUnlock size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-[#4A2C2A]/60 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-lg relative shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-[#4A2C2A] p-10 text-center relative">
               <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"><FiX size={24} /></button>
               <h2 className="text-3xl font-black text-[#FFDBB6] uppercase italic tracking-tighter">
                {editing ? "Hiệu chỉnh" : "Khởi tạo"} <span className="text-[#a06b49]">User</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên hiển thị</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Họ và tên" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] font-bold text-[#4A2C2A]" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vai trò</label>
                  <select name="role" value={form.role} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] font-bold text-[#4A2C2A] cursor-pointer">
                    <option value="User">Thành viên (User)</option>
                    <option value="Admin">Quản trị (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email đăng nhập</label>
                <input name="email" value={form.email} onChange={handleChange} placeholder="user@teahouse.com" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] font-bold text-[#4A2C2A]" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{editing ? "Mật khẩu (Bỏ trống nếu không đổi)" : "Mật khẩu khởi tạo"}</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] font-bold text-[#4A2C2A]" required={!editing} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="09xx xxx xxx" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#FFDBB6] font-bold text-[#4A2C2A]" />
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100 mt-2">
                <span className="text-xs font-black text-[#4A2C2A] uppercase tracking-wider">Trạng thái kích hoạt</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <button className="w-full bg-[#4A2C2A] text-[#FFDBB6] py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all mt-4">
                {editing ? "Cập nhật tài khoản" : "Tạo tài khoản ngay"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;