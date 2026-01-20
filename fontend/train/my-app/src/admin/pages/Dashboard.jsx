import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService";
import { 
  FiDollarSign, FiShoppingBag, FiCalendar, FiCoffee, FiTrendingUp 
} from "react-icons/fi"; // Dùng icons từ react-icons (Fa, Fi, v.v.)

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler // Thêm Filler để làm biểu đồ vùng
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Không thể tải dữ liệu dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-[#FFDBB6] border-t-[#4A2C2A] rounded-full animate-spin"></div>
        <p className="text-[#4A2C2A] font-bold animate-pulse text-sm uppercase tracking-widest">
          Đang tổng hợp dữ liệu...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-600 p-6 rounded-3xl flex items-center gap-4">
        <span className="text-2xl">⚠️</span>
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  const revenueChartData = {
    labels: stats.revenueByDay.map((x) => x.date),
    datasets: [
      {
        label: "Doanh thu (₫)",
        data: stats.revenueByDay.map((x) => x.revenue),
        fill: true,
        backgroundColor: "rgba(255, 219, 182, 0.2)", // Màu nền dưới đường line
        borderColor: "#4A2C2A",
        borderWidth: 3,
        pointBackgroundColor: "#4A2C2A",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        tension: 0.4, // Độ cong của đường
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#4A2C2A",
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        displayColors: false,
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-700">
      {/* ===== WELCOME SECTION ===== */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#4A2C2A] tracking-tighter uppercase italic">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm font-medium">Chào mừng trở lại, Admin!</p>
        </div>
        <div className="hidden md:flex bg-white px-4 py-2 rounded-2xl shadow-sm border border-orange-50 items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hệ thống ổn định</span>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Doanh thu"
          value={stats.totalRevenue.toLocaleString()}
          unit="₫"
          icon={<FiDollarSign />}
          color="bg-emerald-500"
        />
        <StatCard 
          title="Đơn hàng" 
          value={stats.totalOrders} 
          icon={<FiShoppingBag />}
          color="bg-blue-500"
        />
        <StatCard
          title="Đặt bàn chờ"
          value={stats.pendingReservations}
          icon={<FiCalendar />}
          color="bg-amber-500"
        />
        <StatCard 
          title="Sản phẩm" 
          value={stats.totalProducts} 
          icon={<FiCoffee />}
          color="bg-rose-500"
        />
      </div>

      {/* ===== CHART SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-[#4A2C2A] uppercase tracking-tight flex items-center gap-2">
              <FiTrendingUp className="text-orange-400" /> Biểu đồ doanh thu
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                7 ngày gần nhất
            </span>
          </div>
          <div className="h-[300px]">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* CỘT PHỤ BÊN CẠNH BIỂU ĐỒ (Optional) */}
        <div className="bg-[#4A2C2A] p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between">
            <h3 className="text-xl font-bold leading-tight">Mẹo quản trị hôm nay</h3>
            <p className="text-sm text-[#FFDBB6]/70 leading-relaxed italic">
              "Đừng quên kiểm tra các đặt bàn đang chờ duyệt để mang lại trải nghiệm tốt nhất cho khách hàng."
            </p>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 mt-6">
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FFDBB6]">Hiệu suất</p>
                <p className="text-2xl font-black mt-1">+12.5%</p>
                <p className="text-xs opacity-50 italic">so với tháng trước</p>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, unit, icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-50 hover:shadow-md transition-all group overflow-hidden relative">
    {/* Decor Circle */}
    <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-10 ${color}`}></div>
    
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transition-transform group-hover:scale-110 ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
        <p className="text-2xl font-black text-[#4A2C2A] mt-1">
          {value}{unit && <span className="text-xs ml-1 opacity-50">{unit}</span>}
        </p>
      </div>
    </div>
  </div>
);

export default Dashboard;