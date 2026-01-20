import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);

      if (res.role !== "Admin") {
        setError("Bạn không có quyền admin");
        return;
      }

      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);

      navigate("/admin");
    } catch {
      setError("Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-[#4A2C2A] text-white py-2 rounded">
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
