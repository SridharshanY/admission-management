// src/pages/AdminLogin.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from '../assets/logo-icon.png'

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "admin@example.com", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Admin login error:", error.response?.data || error);
      setErrorMsg("Invalid email or password for admin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <img src={logo} alt="" />
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="admin@example.com"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Not registered as an admin?{" "}
          <Link to="/admin-register" className="text-red-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
