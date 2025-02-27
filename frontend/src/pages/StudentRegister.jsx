// src/pages/StudentRegister.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: "Jane Doe",
    email: "jane@student.com",
    password: "",
    studentId: "S12345678",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Optionally, you can force the student role on the backend.
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error);
      setErrorMsg("Registration failed. Please check your details and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200 p-4">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Student Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Jane Doe"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              placeholder="e.g., S12345678"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="jane@student.com"
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
              placeholder="Create a strong password"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/student-login" className="text-green-500 hover:underline">
            Login here
          </Link>
        </p>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Tip: Your student ID is required for verification.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
