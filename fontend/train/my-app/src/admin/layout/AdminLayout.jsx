import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  return (
    // Xóa class group ở đây để tránh việc hover bên phải cũng mở Sidebar
    <div className="min-h-screen bg-[#FAF7F2] relative">
      <Sidebar />

      {/* - pl-20: Luôn cách lề 80px để thấy icon Sidebar.
        - [&:has(aside:hover)]:pl-72: Một mẹo Tailwind để đẩy lề trái lên 288px 
          CHỈ KHI thẻ aside bên trong đang được hover.
      */}
      <div className="flex flex-col min-h-screen transition-all duration-500 ease-in-out pl-20 [&:has(aside:hover)]:pl-72">
        <AdminHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;