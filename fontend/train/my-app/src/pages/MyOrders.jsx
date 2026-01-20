import React, { useEffect, useState } from "react";
import {
  getMyOrders,
  getOrderTimeline,
  cancelOrder,
} from "../services/orderService";

/* =======================
    STATUS STYLING
======================= */
const getStatusStyles = (status) => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Confirmed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Completed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Cancelled":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const statusIcon = (status) => {
  switch (status) {
    case "Pending": return "🕒";
    case "Confirmed": return "🤝";
    case "Completed": return "✅";
    case "Cancelled": return "🚫";
    default: return "📦";
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [timelines, setTimelines] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

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
        // Toggle ẩn hiện nếu đã load rồi
        setTimelines(prev => ({...prev, [orderId]: null}));
        return;
    }
    try {
      const data = await getOrderTimeline(orderId);
      setTimelines((prev) => ({ ...prev, [orderId]: data }));
    } catch (err) {
      alert("❌ Không tải được tiến trình");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="animate-bounce font-bold text-[#4A2C2A]">Đang tải đơn hàng...</div>
    </div>
  );

  return (
    <section className="bg-[#FAF7F2] min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#4A2C2A] uppercase tracking-tighter italic">
                Lịch sử mua hàng
            </h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">Theo dõi hành trình những món quà của bạn</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
            <p className="text-gray-400">Bạn chưa có đơn hàng nào tại quán.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="group bg-white rounded-[2rem] shadow-sm border border-orange-50 overflow-hidden transition-all hover:shadow-md">
                
                {/* HEADER: Mã đơn & Trạng thái */}
                <div className="p-6 pb-0 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-[#4A2C2A]">Đơn hàng #{order.id}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black border ${getStatusStyles(order.status)}`}>
                    {statusIcon(order.status)} {order.status.toUpperCase()}
                  </span>
                </div>

                {/* BODY: Danh sách món */}
                <div className="p-6 space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <p className="font-bold text-[#4A2C2A]">{item.name} <span className="text-gray-400 ml-1">× {item.quantity}</span></p>
                          {item.toppings?.length > 0 && (
                            <p className="text-[11px] text-gray-500 italic mt-0.5">
                              + {item.toppings.map(t => t.name).join(", ")}
                            </p>
                          )}
                        </div>
                        <span className="font-bold text-gray-600">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER ĐƠN HÀNG */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => loadTimeline(order.id)}
                      className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors underline flex items-center gap-1"
                    >
                      {timelines[order.id] ? "Ẩn tiến trình" : "Lịch sử trạng thái"}
                    </button>

                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none">Tổng thanh toán</p>
                        <p className="text-xl font-black text-[#4A2C2A]">
                            {order.total.toLocaleString("vi-VN")}₫
                        </p>
                    </div>
                  </div>

                  {/* TIMELINE (HIỂN THỊ KHI BẤM XEM) */}
                  {timelines[order.id] && (
                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200 animate-in slide-in-from-top duration-300">
                      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-3 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:via-gray-200 before:to-transparent">
                        {timelines[order.id].map((step, idx) => (
                          <div key={idx} className="relative flex items-center justify-between pl-8">
                            <div className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-gray-200 shadow-sm transition-colors group-hover:border-[#4A2C2A]">
                                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                            </div>
                            <div className="flex flex-1 justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">{step.status}</span>
                                <span className="text-[10px] text-gray-400 italic">
                                    {new Date(step.updated_at).toLocaleString("vi-VN")}
                                </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NÚT HỦY ĐƠN */}
                  {order.status === "Pending" && (
                    <button
                      onClick={async () => {
                        if (!window.confirm("Bạn chắc chắn muốn hủy đơn này?")) return;
                        try {
                          await cancelOrder(order.id);
                          loadOrders();
                        } catch (err) {
                          alert(err.response?.data || "❌ Lỗi khi hủy đơn");
                        }
                      }}
                      className="w-full mt-4 py-3 border-2 border-rose-50 text-rose-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
                    >
                      Hủy đơn hàng ngay
                    </button>
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