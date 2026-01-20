import React, { useEffect, useState } from "react";
import {
  getAdminOrders,
  confirmAdminOrder,
  cancelAdminOrder,
  completeAdminOrder,
  getAdminOrderTimeline,
} from "../../services/adminOrder";
import { FiPackage, FiCheckCircle, FiXCircle, FiTruck, FiClock, FiSearch } from "react-icons/fi";

const statusStyles = (status) => {
  switch (status) {
    case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Cancelled": return "bg-rose-100 text-rose-700 border-rose-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
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

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (error) {
      alert("❌ Không tải được đơn hàng");
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
      alert("❌ Không tải được timeline");
    }
  };

  const handleAction = async (id, actionFn, message) => {
    if (!window.confirm(message)) return;
    await actionFn(id);
    loadOrders();
  };

  const filteredOrders = filter === "All" ? orders : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A2C2A]"></div>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#4A2C2A] tracking-tighter uppercase italic">
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-400 text-sm font-medium">Theo dõi và xử lý đơn đặt hàng từ khách hàng</p>
        </div>
        
        {/* FILTER TABS */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-orange-50">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                filter === s ? "bg-[#4A2C2A] text-[#FFDBB6] shadow-md" : "text-gray-400 hover:text-[#4A2C2A]"
              }`}
            >
              {s === "All" ? "Tất cả" : s}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-widest">
              <th className="p-6">Mã đơn</th>
              <th className="p-6">Khách hàng</th>
              <th className="p-6">Chi tiết món</th>
              <th className="p-6 text-right">Tổng thanh toán</th>
              <th className="p-6 text-center">Trạng thái</th>
              <th className="p-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-20 text-center text-gray-400 italic">Chưa có đơn hàng nào trong mục này...</td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <React.Fragment key={o.id}>
                  <tr className="hover:bg-orange-50/20 transition-colors align-top">
                    <td className="p-6">
                      <span className="font-black text-[#4A2C2A]">#{o.id}</span>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase">
                        {new Date(o.created_at).toLocaleTimeString("vi-VN")}
                      </p>
                    </td>

                    <td className="p-6">
                      <div className="font-bold text-[#4A2C2A]">{o.user.name}</div>
                      <div className="text-gray-400 text-[11px] flex items-center gap-1 mt-0.5">
                        {o.user.email}
                      </div>
                    </td>

                    <td className="p-6 max-w-xs">
                      {o.items.map((i, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <div className="text-sm font-bold text-gray-700">
                            {i.product_name} <span className="text-[#a06b49]">×{i.quantity}</span>
                          </div>
                          {i.toppings?.length > 0 && (
                            <p className="text-[10px] text-gray-400 italic">
                              + {i.toppings.map(t => t.name).join(", ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </td>

                    <td className="p-6 text-right">
                      <div className="text-lg font-black text-[#4A2C2A]">
                        {Number(o.total).toLocaleString("vi-VN")}₫
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles(o.status)}`}>
                        {statusIcon(o.status)} {o.status}
                      </span>
                    </td>

                    <td className="p-6 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          {o.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleAction(o.id, confirmAdminOrder, "Xác nhận đơn hàng này?")}
                                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                title="Xác nhận"
                              >
                                <FiCheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleAction(o.id, cancelAdminOrder, "Hủy đơn hàng này?")}
                                className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                title="Hủy đơn"
                              >
                                <FiXCircle size={18} />
                              </button>
                            </>
                          )}

                          {o.status === "Confirmed" && (
                            <button
                              onClick={() => handleAction(o.id, completeAdminOrder, "Hoàn tất đơn hàng này?")}
                              className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-sm"
                            >
                              Giao xong
                            </button>
                          )}
                        </div>
                        
                        <button
                          onClick={() => loadTimeline(o.id)}
                          className="text-[10px] font-black text-gray-400 hover:text-[#4A2C2A] uppercase tracking-widest transition-colors underline decoration-dotted"
                        >
                          {timelines[o.id] ? "Ẩn Timeline" : "Lịch sử đơn"}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* TIMELINE EXPANSION */}
                  {timelines[o.id] && (
                    <tr className="bg-gray-50/50 animate-in slide-in-from-top duration-300">
                      <td colSpan="6" className="p-8 border-t border-dashed border-gray-200">
                        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-300 before:via-gray-300 before:to-transparent">
                          {timelines[o.id].map((step, idx) => (
                            <div key={idx} className="relative flex items-center justify-between pl-10">
                              <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white border-4 border-gray-100 shadow-sm transition-colors text-gray-400 group-hover:text-[#4A2C2A]">
                                {statusIcon(step.status)}
                              </div>
                              <div className="flex flex-1 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <div>
                                  <p className="text-xs font-black text-[#4A2C2A] uppercase tracking-wider">{step.status}</p>
                                  <p className="text-[10px] text-gray-400 font-medium">Cập nhật bởi: {step.updated_by || "System"}</p>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 italic">
                                  {new Date(step.updated_at).toLocaleString("vi-VN")}
                                </span>
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
  );
};

export default Orders;