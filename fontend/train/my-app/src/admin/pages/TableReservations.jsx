import React, { useEffect, useState } from "react";
import {
  getTableReservations,
  approveReservation,
  rejectReservation,
} from "../../services/adminReservationService";
import { FiCalendar, FiUsers, FiClock, FiPhone, FiCheck, FiX, FiInfo, FiUser } from "react-icons/fi";

const TableReservations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getTableReservations();
      setData(res);
    } catch (err) {
      setError("Không thể tải danh sách đặt bàn");
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
        loadData();
    } catch (err) {
        alert("Có lỗi xảy ra khi duyệt");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Từ chối lịch đặt bàn này?")) return;
    try {
        await rejectReservation(id);
        loadData();
    } catch (err) {
        alert("Có lỗi xảy ra khi từ chối");
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A2C2A]"></div>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-700 text-left">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#4A2C2A] tracking-tighter uppercase italic flex items-center gap-3">
          <FiCalendar className="text-orange-400" /> Duyệt đặt bàn
        </h1>
        <p className="text-gray-400 text-sm font-medium mt-1">
          Quản lý và phê duyệt yêu cầu đặt chỗ từ khách hàng
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-2 font-bold text-sm">
          <FiInfo /> {error}
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
              <th className="p-6">Khách hàng</th>
              <th className="p-6 text-center">Thời gian</th>
              <th className="p-6 text-center">Số người</th>
              <th className="p-6 text-center">Trạng thái</th>
              <th className="p-6 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-gray-400 italic font-medium">
                  Hiện tại không có yêu cầu đặt bàn nào...
                </td>
              </tr>
            ) : (
              data.map((r) => (
                <tr key={r.id} className="hover:bg-orange-50/20 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#4A2C2A]">
                        <FiUser />
                      </div>
                      <div>
                        <p className="font-bold text-[#4A2C2A] leading-tight">{r.customer_name}</p>
                        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 font-bold tracking-wider">
                          <FiPhone size={10} /> {r.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-black text-[#4A2C2A] flex items-center gap-1.5">
                        <FiClock className="text-blue-400" /> {r.reservation_time}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <FiCalendar size={10} /> {new Date(r.reservation_date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </td>

                  <td className="p-6 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-xs font-black text-gray-600">
                      <FiUsers /> {r.number_of_people}
                    </span>
                  </td>

                  <td className="p-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(r.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        r.status === 'Approved' ? 'bg-emerald-500' : r.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}></span>
                      {r.status}
                    </span>
                  </td>

                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      {r.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-100"
                            title="Duyệt đặt bàn"
                          >
                            <FiCheck size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(r.id)}
                            className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100"
                            title="Từ chối"
                          >
                            <FiX size={18} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic pr-4">
                          Đã xử lý
                        </span>
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
  );
};

export default TableReservations;