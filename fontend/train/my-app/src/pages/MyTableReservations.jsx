import React, { useEffect, useState } from "react";
import { getMyReservations, cancelReservation } from "../services/reservationService";
import { FiCalendar, FiClock, FiUsers, FiHash, FiFileText, FiCoffee, FiXCircle, FiAlertCircle } from "react-icons/fi";
import Toast from "../components/Toast"; // Đảm bảo đường dẫn này đúng

const statusMap = {
  Pending: { text: "Chờ xác nhận", class: "bg-amber-50 text-amber-600 border-amber-100" },
  Approved: { text: "Đã xác nhận", class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  Rejected: { text: "Đã từ chối", class: "bg-rose-50 text-rose-600 border-rose-100" },
  Cancelled: { text: "Đã hủy", class: "bg-gray-100 text-gray-400 border-gray-200 grayscale opacity-60" },
};

const MyTableReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 Quản lý trạng thái Toast
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    getMyReservations()
      .then(setReservations)
      .finally(() => setLoading(false));
  }, []);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch đặt bàn này?")) return;

    try {
      await cancelReservation(id);
      
      // ✅ Cập nhật UI ngay lập tức
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Cancelled" } : r))
      );
      
      // ✅ Hiển thị Toast thông báo
      showNotification("🗑️ Đã hủy lịch đặt bàn thành công");
    } catch (err) {
      showNotification("❌ Không thể hủy bàn lúc này. Vui lòng thử lại sau");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F2]">
        <div className="w-12 h-12 border-4 border-orange-100 border-t-[#4A2C2A] rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Đang tải lịch hẹn...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] py-20 px-6 text-left animate-in fade-in duration-700 relative">
      
      {/* 🔥 HIỂN THỊ TOAST */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: "" })} 
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-orange-100 pb-8">
          <div>
            <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Lịch sử cá nhân</span>
            <h1 className="text-5xl font-black text-[#4A2C2A] italic uppercase tracking-tighter leading-none">
              Bàn đã <span className="text-[#a06b49]">đặt</span>
            </h1>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-orange-50 text-xs font-bold text-gray-500 italic">
            Bạn có {reservations.length} yêu cầu
          </div>
        </div>

        {/* LIST */}
        {reservations.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-orange-50">
            <FiCoffee size={48} className="mx-auto mb-6 text-orange-200" />
            <h2 className="text-[#4A2C2A] text-xl font-black uppercase italic">Chưa có lịch hẹn nào</h2>
            <button onClick={() => window.location.href='/dat-ban'} className="mt-8 bg-[#4A2C2A] text-[#FFDBB6] px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl">Đặt bàn ngay</button>
          </div>
        ) : (
          <div className="grid gap-6">
            {reservations.map((r) => (
              <div key={r.id} className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-orange-50 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                  
                  {/* LEFT INFO */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#4A2C2A] rounded-xl flex items-center justify-center text-[#FFDBB6] shadow-lg"><FiHash /></div>
                      <p className="text-xl font-black text-[#4A2C2A] italic uppercase tracking-tight">Mã bàn #{r.id}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <FiCalendar className="text-[#a06b49]" /> {new Date(r.reservation_date).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <FiClock className="text-[#a06b49]" /> {r.reservation_time}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <FiUsers className="text-[#a06b49]" /> {r.number_of_people} khách
                      </div>
                    </div>

                    {/* 🔴 NÚT HỦY KHI ĐANG CHỜ (PENDING) */}
                    {r.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
                      >
                        <FiXCircle /> Hủy lịch hẹn
                      </button>
                    )}
                  </div>

                  {/* RIGHT STATUS */}
                  <div className="min-w-[150px] text-right flex flex-col items-center md:items-end gap-2">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${statusMap[r.status].class}`}>
                      {statusMap[r.status].text}
                    </span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Ngày đặt: {new Date(r.created_at).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTableReservations;