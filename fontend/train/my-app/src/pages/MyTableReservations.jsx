import React, { useEffect, useState } from "react";
import { getMyReservations } from "../services/reservationService";
import { FiCalendar, FiClock, FiUsers, FiHash, FiFileText, FiCoffee, FiChevronRight } from "react-icons/fi";

const statusMap = {
  Pending: {
    text: "Chờ xác nhận",
    class: "bg-amber-50 text-amber-600 border-amber-100",
  },
  Approved: { // Đã khớp với logic Approved từ Admin
    text: "Đã xác nhận",
    class: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  Rejected: { // Đã khớp với logic Rejected từ Admin
    text: "Đã từ chối",
    class: "bg-rose-50 text-rose-600 border-rose-100",
  },
};

const MyTableReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReservations()
      .then(setReservations)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-orange-100 border-t-[#4A2C2A] rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Đang tìm kiếm lịch hẹn...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 text-left animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-orange-100 pb-8">
        <div>
          <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">
            Lịch sử cá nhân
          </span>
          <h1 className="text-4xl font-black text-[#4A2C2A] italic uppercase tracking-tighter leading-none">
            Bàn đã <span className="text-[#a06b49]">đặt</span>
          </h1>
        </div>
        <p className="text-gray-400 text-sm font-medium italic">
          Bạn có {reservations.length} yêu cầu đặt bàn
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-orange-50">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#a06b49]">
            <FiCoffee size={40} />
          </div>
          <p className="text-[#4A2C2A] text-xl font-bold mb-2">Chưa có lịch hẹn nào</p>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto font-medium">Bạn có muốn dành một chỗ ngồi tuyệt vời tại Tea House hôm nay không?</p>
          <button onClick={() => window.location.href='/dat-ban'} className="bg-[#4A2C2A] text-[#FFDBB6] px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all">
            Đặt bàn ngay
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {reservations.map((r) => (
            <div
              key={r.id}
              className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-orange-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
            >
              {/* Trang trí góc */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/30 rounded-full -mr-16 -mt-16 group-hover:bg-orange-100/50 transition-colors"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                {/* Thông tin chính */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4A2C2A] rounded-xl flex items-center justify-center text-[#FFDBB6] shadow-lg">
                        <FiHash size={18} />
                    </div>
                    <p className="text-xl font-black text-[#4A2C2A] italic uppercase tracking-tight">
                      Mã đặt bàn #{r.id}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                        <FiCalendar className="text-[#a06b49]" />
                        <span>{new Date(r.reservation_date).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                        <FiClock className="text-[#a06b49]" />
                        <span>{r.reservation_time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                        <FiUsers className="text-[#a06b49]" />
                        <span>{r.number_of_people} người</span>
                    </div>
                  </div>

                  {r.note && (
                    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl">
                        <FiFileText className="mt-1 text-gray-400" />
                        <p className="text-sm text-gray-500 italic">Ghi chú: {r.note}</p>
                    </div>
                  )}
                </div>

                {/* Trạng thái và Ngày tạo */}
                <div className="flex flex-col items-center md:items-end gap-3 min-w-[150px]">
                  <span
                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${
                        statusMap[r.status]?.class || "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {statusMap[r.status]?.text || r.status}
                  </span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Đặt lúc: {new Date(r.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTableReservations;