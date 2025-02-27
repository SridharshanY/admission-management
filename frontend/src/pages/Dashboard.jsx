import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/backgrounds/bg-img-2.jpg";

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/student-login");
  };

  // Fetch student applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/application/my", {
          headers: { "x-auth-token": token },
        });
        if (res.data.success) {
          setApplications(res.data.applications);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error("Error fetching applications:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl" style={{ backgroundImage: `url(${bg})` }}>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6" style={{ backgroundImage: `url(${bg})` }}>
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white shadow-lg p-5 rounded-lg mb-8">
        <h1 className="text-3xl font-extrabold text-gray-700">📌 Student Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105"
        >
          Logout 🚪
        </button>
      </div>

      {/* Submit New Application */}
      <div className="mb-6 flex justify-center">
        <Link
          to="/student-application"
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          ➕ Submit New Application
        </Link>
      </div>

      {/* Applications Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📄 My Applications</h2>
        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="p-5 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-700">{app.title}</h3>
                <p className="mt-2 text-gray-600">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-lg text-white text-sm font-semibold ${
                      app.status === "Approved"
                        ? "bg-green-500"
                        : app.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {app.status}
                  </span>
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Submitted on: {new Date(app.appliedAt).toLocaleString()}
                </p>
                <Link
                  to={`/application/${app._id}`}
                  className="inline-block mt-3 text-blue-600 font-medium hover:underline"
                >
                  🔍 View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center text-lg">No applications submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
