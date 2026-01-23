import React, { useEffect, useState } from "react";
import {
  getTableReservations,
  approveReservation,
  rejectReservation,
} from "../../services/adminReservationService";
import { FiCalendar, FiUsers, FiClock, FiPhone, FiCheck, FiX, FiInfo, FiUser, FiHash } from "react-icons/fi";
import Toast from "../../components/Toast"; // Đảm bảo đường dẫn này chính xác

const TableReservations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [filter, setFilter] = useState("All");

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getTableReservations();
      setData(res);
    } catch (err) {
      setError("Không thể tải danh sách đặt bàn");
      showNotification("❌ Lỗi tải dữ liệu từ máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Xác nhận duyệt lịch đặt bàn này?")) return;
    try {
      await approveReservation(id);
      showNotification("✅ Đã phê duyệt lịch đặt bàn thành công!");
      loadData();
    } catch (err) {
      showNotification("❌ Có lỗi xảy ra khi duyệt");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Từ chối lịch đặt bàn này?")) return;
    try {
      await rejectReservation(id);
      showNotification("🚫 Đã từ chối yêu cầu đặt bàn");
      loadData();
    } catch (err) {
      showNotification("❌ Có lỗi xảy ra khi từ chối");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Rejected":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  // Logic lọc dữ liệu
  const filteredData = filter === "All" ? data : data.filter(r => r.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-orange-100 border-t-[#4A2C2A] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-700 text-left relative">
      
      {/* HIỂN THỊ TOAST */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: "" })} 
        />
      )}

      {/* HEADER & FILTER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6 border-b border-orange-100 pb-8">
        <div>
          <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Lịch hẹn khách hàng</span>
          <h1 className="text-4xl font-black text-[#4A2C2A] tracking-tighter uppercase italic leading-none">
            Duyệt <span className="text-[#a06b49]">Đặt bàn</span>
          </h1>
        </div>

        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-orange-50 overflow-x-auto">
          {["All", "Pending", "Approved", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === s ? "bg-[#4A2C2A] text-[#FFDBB6] shadow-lg shadow-[#4A2C2A]/20" : "text-gray-400 hover:text-[#4A2C2A]"
              }`}
            >
              {s === "All" ? "Tất cả" : s}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-8 p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-[1.5rem] flex items-center gap-3 font-bold text-sm shadow-sm animate-shake">
          <FiInfo size={20} /> {error}
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-orange-50 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.3em]">
                <th className="p-8">Khách hàng</th>
                <th className="p-8 text-center">Thời gian đặt</th>
                <th className="p-8 text-center">Số lượng khách</th>
                <th className="p-8 text-center">Trạng thái</th>
                <th className="p-8 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-24 text-center text-gray-400 italic font-medium">
                    Không tìm thấy yêu cầu đặt bàn nào trong mục này...
                  </td>
                </tr>
              ) : (
                filteredData.map((r) => (
                  <tr key={r.id} className="hover:bg-orange-50/30 transition-all group">
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-[#FFDBB6] flex items-center justify-center text-[#4A2C2A] text-xl shadow-inner border border-[#4A2C2A]/10 font-black">
                          {r.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-[#4A2C2A] text-lg tracking-tight leading-none mb-1 group-hover:text-[#a06b49] transition-colors">{r.customer_name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-1.5">
                            <FiPhone size={12} className="text-[#a06b49]" /> {r.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-8">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-sm font-black text-[#4A2C2A] bg-orange-50 px-3 py-1 rounded-lg flex items-center gap-2 border border-orange-100 shadow-sm">
                          <FiClock className="text-[#a06b49]" /> {r.reservation_time}
                        </span>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1 mt-1">
                          <FiCalendar size={10} /> {new Date(r.reservation_date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </td>

                    <td className="p-8 text-center">
                      <div className="inline-flex items-center gap-2 px-5 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                        <FiUsers className="text-gray-400" />
                        <span className="text-lg font-black text-[#4A2C2A] tracking-tighter italic">
                          {r.number_of_people}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Khách</span>
                      </div>
                    </td>

                    <td className="p-8 text-center">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border-2 shadow-sm ${getStatusStyle(r.status)}`}>
                        <span className={`w-2 h-2 rounded-full animate-pulse ${
                          r.status === 'Approved' ? 'bg-emerald-500' : r.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'
                        }`}></span>
                        {r.status === 'Pending' ? 'Chờ duyệt' : r.status}
                      </span>
                    </td>

                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-3">
                        {r.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleApprove(r.id)}
                              className="w-12 h-12 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-md border border-emerald-100 hover:-translate-y-1 active:scale-90"
                              title="Duyệt lịch"
                            >
                              <FiCheck size={22} strokeWidth={3} />
                            </button>
                            <button
                              onClick={() => handleReject(r.id)}
                              className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-md border border-rose-100 hover:-translate-y-1 active:scale-90"
                              title="Từ chối"
                            >
                              <FiX size={22} strokeWidth={3} />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                            <FiHash className="text-gray-300" />
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic pr-1">
                              Đã xử lý xong
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TIPS SECTION */}
      <div className="flex flex-col md:flex-row gap-6 opacity-60">
          <div className="flex-1 bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100/50 flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                  <FiInfo size={20} />
              </div>
              <p className="text-xs text-amber-800 font-medium leading-relaxed italic">
                  <b>Lưu ý:</b> Các yêu cầu đang ở trạng thái <b>Pending</b> (Chờ duyệt) cần được xử lý sớm nhất có thể để đảm bảo trải nghiệm của khách hàng.
              </p>
          </div>
          <div className="flex-1 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50 flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <FiClock size={20} />
              </div>
              <p className="text-xs text-blue-800 font-medium leading-relaxed italic">
                  Hệ thống sẽ tự động cập nhật lịch mới nhất mỗi khi bạn tải lại trang. Các yêu cầu đã duyệt sẽ hiển thị tại lịch sử cá nhân của khách hàng.
              </p>
          </div>
      </div>
    </div>
  );
};

export default TableReservations;