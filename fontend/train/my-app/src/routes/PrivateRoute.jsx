import React from "react";
import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.dispatchEvent(new Event("openLoginModal"));

    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        <p>🔒 Vui lòng đăng nhập để sử dụng chức năng này</p>
      </div>
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
