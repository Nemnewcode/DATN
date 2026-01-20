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
} from "react-icons/fi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
    is_active: true,
    phone: "",
    address: "",
  });

  const fetchUsers = async () => {
    const data = await getAdminUsers();
    setUsers(data);
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
      } else {
        await createAdminUser(form);
      }
      setShowForm(false);
      setEditing(null);
      fetchUsers();
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
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

  const handleToggle = async (id) => {
    if (window.confirm("Xác nhận thay đổi trạng thái tài khoản này?")) {
      await toggleAdminUser(id);
      fetchUsers();
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#4A2C2A] tracking-tighter uppercase italic">
            Quản lý tài khoản
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-1">
            Quản lý phân quyền và thông tin người dùng
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm({
              name: "",
              email: "",
              password: "",
              role: "User",
              is_active: true,
              phone: "",
              address: "",
            });
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#4A2C2A] text-[#FFDBB6] px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
        >
          <FiUserPlus /> Thêm tài khoản
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-6 text-xs font-black text-gray-400 uppercase">
                Người dùng
              </th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase">
                Vai trò
              </th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase">
                Trạng thái
              </th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-orange-50/30">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FFDBB6] flex items-center justify-center font-black text-[#4A2C2A]">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#4A2C2A]">{u.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <FiMail /> {u.email}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <FiPhone /> {u.phone || "Chưa có SĐT"}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <FiMapPin /> {u.address || "Chưa có địa chỉ"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-6">
                  <span
                    className={`flex items-center gap-1 text-xs font-black uppercase ${
                      u.role === "Admin" ? "text-purple-600" : "text-blue-600"
                    }`}
                  >
                    <FiShield /> {u.role}
                  </span>
                </td>

                <td className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      u.is_active
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {u.is_active ? "Hoạt động" : "Bị khóa"}
                  </span>
                </td>

                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="p-2 bg-gray-50 rounded-xl hover:bg-[#4A2C2A] hover:text-[#FFDBB6]"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleToggle(u.id)}
                      className={`p-2 rounded-xl ${
                        u.is_active
                          ? "bg-rose-50 text-rose-500"
                          : "bg-emerald-50 text-emerald-500"
                      }`}
                    >
                      {u.is_active ? <FiLock /> : <FiUnlock />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <FiX size={22} />
            </button>

            <h2 className="text-2xl font-black text-[#4A2C2A] mb-6">
              {editing ? "Cập nhật tài khoản" : "Tạo tài khoản"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Tên hiển thị" className="w-full bg-gray-50 p-4 rounded-xl" required />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full bg-gray-50 p-4 rounded-xl" required />
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mật khẩu" className="w-full bg-gray-50 p-4 rounded-xl" required={!editing} />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" className="w-full bg-gray-50 p-4 rounded-xl" />
              <textarea name="address" value={form.address} onChange={handleChange} placeholder="Địa chỉ" className="w-full bg-gray-50 p-4 rounded-xl" rows={2} />

              <select name="role" value={form.role} onChange={handleChange} className="w-full bg-gray-50 p-4 rounded-xl">
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
                Cho phép hoạt động
              </label>

              <button className="w-full bg-[#4A2C2A] text-[#FFDBB6] py-4 rounded-xl font-black">
                Lưu thay đổi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
