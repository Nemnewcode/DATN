import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../services/userService";
import AccountForm from "../components/AccountForm";
import { FiUser, FiSettings, FiCalendar, FiShield } from "react-icons/fi";

const Account = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    created_at: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Thay vì navigate("/login"), ta dùng dispatch event mở modal nếu hệ thống bạn dùng Modal
      window.dispatchEvent(new Event("openLoginModal"));
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setFormData({
          username: data.username ?? "",
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
          role: data.role ?? "",
          created_at: data.created_at ?? "",
        });
      } catch (err) {
        setMessage("Không thể tải thông tin tài khoản");
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);
  const handleChange = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};


  // Đồng bộ hóa với AccountForm mới bằng cách truyền setFormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      setMessage("Cập nhật thông tin thành công!");
      setIsError(false);

      // Cập nhật tên mới vào localStorage để Header nhận diện ngay
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.name = formData.name;
      localStorage.setItem("user", JSON.stringify(user));
      
      // Phát tín hiệu để Header cập nhật lại "Xin chào, [Tên]"
      window.dispatchEvent(new Event("storage")); 
    } catch {
      setMessage("Cập nhật thất bại, vui lòng thử lại");
      setIsError(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F2]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#4A2C2A]/20 border-t-[#4A2C2A] rounded-full animate-spin"></div>
            <p className="text-[#4A2C2A] font-bold animate-pulse uppercase text-xs tracking-widest">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] py-20 px-6 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        
        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-orange-50 mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          {/* Avatar Placeholder */}
          <div className="w-32 h-32 bg-[#4A2C2A] rounded-[2.5rem] flex items-center justify-center text-[#FFDBB6] shadow-2xl relative z-10">
            <FiUser size={48} />
          </div>

          <div className="flex-1 relative z-10 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h2 className="text-3xl font-black text-[#4A2C2A] uppercase italic tracking-tighter">
                {formData.name || "Thành viên mới"}
                </h2>
                <span className="bg-orange-100 text-[#a06b49] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mx-auto md:mx-0">
                   {formData.role || "Khách hàng"}
                </span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <FiShield className="text-[#a06b49]" /> ID: #{formData.username}
                </div>
                <div className="flex items-center gap-2">
                    <FiCalendar className="text-[#a06b49]" /> Tham gia: {new Date(formData.created_at).toLocaleDateString('vi-VN')}
                </div>
            </div>
          </div>
          
          <div className="hidden lg:block text-[#4A2C2A]/10">
            <FiSettings size={80} className="animate-spin-slow" />
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-orange-50">
          <div className="flex items-center gap-4 mb-10 text-left">
            <div className="w-1 h-8 bg-[#a06b49] rounded-full"></div>
            <h3 className="text-xl font-black text-[#4A2C2A] uppercase italic tracking-tight">Chi tiết hồ sơ</h3>
          </div>

          <AccountForm
            form={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            message={message}
            isError={isError}
          />

        </div>

      </div>
    </div>
  );
};

export default Account;