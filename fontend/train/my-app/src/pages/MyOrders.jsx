import React, { useEffect, useState } from "react";
import { getMyOrders, getOrderTimeline, cancelOrder } from "../services/orderService";
import { FiPackage, FiCheckCircle, FiXCircle, FiClock, FiShoppingBag, FiTruck, FiChevronRight, FiChevronDown, FiActivity } from "react-icons/fi";
import Toast from "../components/Toast"; // Đảm bảo bạn đã có component này

const getStatusStyles = (status) => {
  switch (status) {
    case "Pending": return "bg-amber-50 text-amber-600 border-amber-100";
    case "Confirmed": return "bg-blue-50 text-blue-600 border-blue-100";
    case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "Cancelled": return "bg-rose-50 text-rose-600 border-rose-100";
    default: return "bg-gray-50 text-gray-600 border-gray-100";
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

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [timelines, setTimelines] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
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
      const data = await getOrderTimeline(orderId);
      setTimelines((prev) => ({ ...prev, [orderId]: data }));
    } catch (err) {
      showNotification("❌ Không tải được tiến trình đơn hàng");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2]">
      <div className="w-12 h-12 border-4 border-orange-100 border-t-[#4A2C2A] rounded-full animate-spin"></div>
      <p className="mt-4 text-xs font-black uppercase tracking-widest text-[#4A2C2A]/60">Đang tìm kiếm đơn hàng...</p>
    </div>
  );

  return (
    <section className="bg-[#FAF7F2] min-h-screen py-20 px-6 text-left">
      {/* HIỂN THỊ TOAST */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: "" })} 
        />
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-orange-100 pb-8">
          <div>
            <span className="text-[#a06b49] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Cám ơn bạn đã tin tưởng</span>
            <h2 className="text-5xl font-black text-[#4A2C2A] uppercase italic tracking-tighter leading-none">
              Lịch sử <span className="text-[#a06b49]">mua hàng</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm font-medium italic">Hiển thị {orders.length} đơn hàng gần nhất</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-orange-50 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#a06b49]">
              <FiShoppingBag size={40} />
            </div>
            <h3 className="text-[#4A2C2A] text-xl font-bold mb-2">Bạn chưa có đơn hàng nào</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto font-medium leading-relaxed">Hãy khám phá Menu Tea House và chọn cho mình một ly trà thơm ngon nhé!</p>
            <button onClick={() => window.location.href='/thuc-don'} className="bg-[#4A2C2A] text-[#FFDBB6] px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">Đặt món ngay</button>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div key={order.id} className="group bg-white rounded-[2.5rem] shadow-sm border border-orange-50 overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 duration-500">
                
                {/* HEADER: Mã đơn & Trạng thái */}
                <div className="p-8 pb-0 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4A2C2A] rounded-2xl flex items-center justify-center text-[#FFDBB6] shadow-lg group-hover:rotate-6 transition-transform">
                        <FiPackage size={20} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-[#4A2C2A] italic uppercase tracking-tighter leading-none">Đơn hàng #{order.id}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-1 leading-none">
                        <FiClock size={10} /> {new Date(order.created_at).toLocaleString("vi-VN")}
                        </p>
                    </div>
                  </div>
                  <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border-2 flex items-center gap-2 ${getStatusStyles(order.status)}`}>
                    {statusIcon(order.status)} {order.status}
                  </span>
                </div>

                {/* BODY: Danh sách món */}
                <div className="p-8">
                  <div className="bg-gray-50/50 rounded-[2rem] p-6 space-y-4 border border-gray-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <p className="font-black text-[#4A2C2A] text-base leading-tight">
                            {item.name} <span className="text-[#a06b49] ml-2">×{item.quantity}</span>
                          </p>
                          {item.toppings?.length > 0 && (
                            <p className="text-[10px] text-gray-400 font-bold italic mt-1.5 flex items-center gap-1">
                              + {item.toppings.map(t => t.name).join(", ")}
                            </p>
                          )}
                        </div>
                        <span className="font-black text-[#4A2C2A] italic text-base">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    ))}
                    
                    <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Tổng cộng</p>
                        <p className="text-2xl font-black text-[#a06b49] italic tracking-tighter leading-none">
                            {order.total.toLocaleString("vi-VN")}₫
                        </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                    <button
                      onClick={() => loadTimeline(order.id)}
                      className="flex items-center gap-2 text-[10px] font-black text-[#a06b49] hover:text-[#4A2C2A] uppercase tracking-[0.2em] transition-all"
                    >
                      <FiActivity className={timelines[order.id] ? "animate-pulse" : ""} />
                      {timelines[order.id] ? "Thu gọn hành trình" : "Theo dõi hành trình"}
                      {timelines[order.id] ? <FiChevronDown /> : <FiChevronRight />}
                    </button>

                    {order.status === "Pending" && (
                        <button
                          onClick={async () => {
                            if (!window.confirm("Bạn chắc chắn muốn hủy đơn này?")) return;
                            try {
                              await cancelOrder(order.id);
                              showNotification("🗑️ Đã hủy đơn hàng thành công");
                              loadOrders();
                            } catch (err) {
                              showNotification("❌ Lỗi: " + (err.response?.data || "Không thể hủy đơn"));
                            }
                          }}
                          className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                          Hủy đơn hàng
                        </button>
                    )}
                  </div>

                  {/* TIMELINE (HÀNH TRÌNH ĐƠN HÀNG) */}
                  {timelines[order.id] && (
                    <div className="mt-8 pt-8 border-t border-gray-100 animate-in slide-in-from-top duration-500">
                      <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:left-[11px] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#4A2C2A]/20 before:via-[#4A2C2A]/10 before:to-transparent">
                        {timelines[order.id].map((step, idx) => (
                          <div key={idx} className="relative flex items-center justify-between">
                            {/* Dot */}
                            <div className="absolute -left-10 flex h-6 w-6 items-center justify-center rounded-full bg-white border-4 border-orange-100 shadow-md z-10">
                                <div className={`h-2 w-2 rounded-full ${idx === 0 ? "bg-[#4A2C2A] animate-ping" : "bg-gray-300"}`}></div>
                            </div>
                            
                            <div className="flex-1 bg-gray-50/50 p-4 rounded-2xl flex justify-between items-center border border-gray-100 group-hover:border-orange-100 transition-colors">
                                <div>
                                    <p className="text-xs font-black text-[#4A2C2A] uppercase tracking-wider">{step.status}</p>
                                    <p className="text-[10px] text-gray-400 font-bold lowercase mt-0.5 italic">Cập nhật lúc: {new Date(step.updated_at).toLocaleTimeString("vi-VN")}</p>
                                </div>
                                <span className="text-[10px] font-black text-gray-300">
                                    {new Date(step.updated_at).toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrders;