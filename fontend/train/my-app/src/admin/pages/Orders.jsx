import React, { useEffect, useState } from "react";
import {
  getAdminOrders,
  confirmAdminOrder,
  cancelAdminOrder,
  completeAdminOrder,
  getAdminOrderTimeline,
} from "../../services/adminOrder";
import { FiPackage, FiCheckCircle, FiXCircle, FiTruck, FiClock, FiSearch, FiInfo, FiActivity } from "react-icons/fi";
import Toast from "../../components/Toast";

const statusStyles = (status) => {
  switch (status) {
    case "Pending": return "bg-amber-50 text-amber-600 border-amber-100";
    case "Confirmed": return "bg-blue-50 text-blue-600 border-blue-100";
    case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "Cancelled": return "bg-rose-50 text-rose-600 border-rose-100";
    default: return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

const statusIcon = (status) => {
  switch (status) {
    case "Pending": return <FiClock />;
    case "Confirmed": return <FiTruck />;
    case "Completed": return <FiCheckCircle />;
    case "Cancelled": return <FiXCircle />;
    default: return <FiPackage />;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [timelines, setTimelines] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => { loadOrders(); }, []);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrders();
      setOrders(data);
    } catch (error) {
      showNotification("❌ Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const loadTimeline = async (orderId) => {
    if (timelines[orderId]) {
      setTimelines(prev => ({ ...prev, [orderId]: null }));
      return;
    }
    try {
      const data = await getAdminOrderTimeline(orderId);
      setTimelines(prev => ({ ...prev, [orderId]: data }));
    } catch (err) {
      showNotification("❌ Không thể tải lịch sử đơn hàng");
    }
  };

  const handleAction = async (id, actionFn, successMsg, confirmMsg) => {
    if (!window.confirm(confirmMsg)) return;
    try {
      await actionFn(id);
      showNotification(`✅ ${successMsg}`);
      loadOrders();
    } catch (error) {
      showNotification("❌ Thao tác thất bại");
    }
  };

  const filteredOrders = filter === "All" ? orders : orders.filter(o => o.status === filter);

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
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
        <div>
          <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Vận hành cửa hàng</span>
          <h1 className="text-4xl font-black text-[#4A2C2A] tracking-tighter uppercase italic leading-none">
            Quản lý <span className="text-[#a06b49]">Đơn hàng</span>
          </h1>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-orange-50 overflow-x-auto no-scrollbar">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((s) => (
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

      {/* BẢNG ĐƠN HÀNG */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-orange-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
                <th className="p-8">Mã đơn</th>
                <th className="p-8">Khách hàng</th>
                <th className="p-8">Chi tiết món</th>
                <th className="p-8 text-right">Tổng thanh toán</th>
                <th className="p-8 text-center">Trạng thái</th>
                <th className="p-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-24 text-center text-gray-400 italic font-medium">
                    Không tìm thấy đơn hàng nào...
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <React.Fragment key={o.id}>
                    <tr className="hover:bg-orange-50/30 transition-all group align-top">
                      <td className="p-8">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-[#4A2C2A] text-lg tracking-tighter">#{o.id}</span>
                          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic leading-none flex items-center gap-1">
                            <FiClock size={10} /> {new Date(o.created_at).toLocaleTimeString("vi-VN")}
                          </span>
                        </div>
                      </td>

                      <td className="p-8">
                        <div className="font-black text-[#4A2C2A] text-sm uppercase tracking-tight">{o.user.name}</div>
                        <div className="text-gray-400 text-[10px] font-bold mt-1 lowercase opacity-70">
                          {o.user.email}
                        </div>
                      </td>

                      <td className="p-8 max-w-xs">
                        <div className="space-y-3">
                          {o.items.map((i, idx) => (
                            <div key={idx} className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                              <div className="text-xs font-black text-[#4A2C2A]">
                                {i.product_name} <span className="text-[#a06b49] ml-1">×{i.quantity}</span>
                              </div>
                              {i.toppings?.length > 0 && (
                                <p className="text-[9px] text-gray-400 font-bold italic mt-1 leading-relaxed">
                                  + {i.toppings.map(t => t.name).join(", ")}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-8 text-right">
                        <div className="text-xl font-black text-[#4A2C2A] italic tracking-tighter">
                          {Number(o.total).toLocaleString("vi-VN")}₫
                        </div>
                      </td>

                      <td className="p-8 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${statusStyles(o.status)}`}>
                          {statusIcon(o.status)} {o.status}
                        </span>
                      </td>

                      <td className="p-8 text-right">
                        <div className="flex flex-col items-end gap-4">
                          <div className="flex gap-2">
                            {o.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleAction(o.id, confirmAdminOrder, "Đã xác nhận đơn hàng!", "Xác nhận bắt đầu pha chế đơn này?")}
                                  className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                  title="Xác nhận"
                                >
                                  <FiCheckCircle size={18} />
                                </button>
                                <button
                                  onClick={() => handleAction(o.id, cancelAdminOrder, "Đã hủy đơn hàng!", "Bạn có chắc muốn hủy đơn này?")}
                                  className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                  title="Hủy đơn"
                                >
                                  <FiXCircle size={18} />
                                </button>
                              </>
                            )}

                            {o.status === "Confirmed" && (
                              <button
                                onClick={() => handleAction(o.id, completeAdminOrder, "Đơn hàng hoàn tất!", "Xác nhận đã giao đơn hàng cho khách?")}
                                className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-sm"
                              >
                                Giao xong
                              </button>
                            )}
                          </div>
                          
                          <button
                            onClick={() => loadTimeline(o.id)}
                            className="flex items-center gap-1.5 text-[10px] font-black text-[#a06b49] hover:text-[#4A2C2A] uppercase tracking-widest transition-all group/btn"
                          >
                            <FiActivity className={`${timelines[o.id] ? "animate-pulse" : ""}`} />
                            {timelines[o.id] ? "Đóng Timeline" : "Xem lịch sử"}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* TIMELINE CẬP NHẬT TRẠNG THÁI */}
                    {timelines[o.id] && (
                      <tr className="bg-gray-50/50 animate-in slide-in-from-top duration-300 overflow-hidden">
                        <td colSpan="6" className="p-10 border-t border-gray-100">
                          <div className="max-w-3xl mx-auto relative pl-12 space-y-8 before:absolute before:inset-0 before:left-[19px] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#4A2C2A]/20 before:via-[#4A2C2A]/10 before:to-transparent">
                            {timelines[o.id].map((step, idx) => (
                              <div key={idx} className="relative flex items-center">
                                {/* Dot Icon */}
                                <div className={`absolute -left-12 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-md border border-gray-100 z-10 transition-colors ${statusStyles(step.status)}`}>
                                  {statusIcon(step.status)}
                                </div>
                                
                                {/* Content Card */}
                                <div className="flex-1 bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 flex justify-between items-center group/card hover:border-[#FFDBB6] transition-all">
                                  <div>
                                    <p className="text-[11px] font-black text-[#4A2C2A] uppercase tracking-widest flex items-center gap-2">
                                      {step.status}
                                      <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                                      <span className="text-gray-400 lowercase font-bold italic tracking-normal">Cập nhật: {step.updated_by || "Hệ thống"}</span>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-300 block mb-0.5">Thời gian</span>
                                    <span className="text-[11px] font-black text-[#4A2C2A] bg-gray-50 px-3 py-1 rounded-lg">
                                      {new Date(step.updated_at).toLocaleString("vi-VN")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;