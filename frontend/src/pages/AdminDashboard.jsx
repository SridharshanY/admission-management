import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bg from '../assets/backgrounds/bg-img-2.jpg';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Function to log out the admin
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/application/all",
          {
            headers: { "x-auth-token": token },
          }
        );
        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch (error) {
        console.error(
          "Error fetching applications:",
          error.response?.data || error
        );
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
      <div
        className="min-h-screen flex items-center justify-center bg-gray-100"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <p className="text-lg text-gray-600">Loading applications...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-100 p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-gray-500 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Applications List */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Student Applications
          </h3>

          {applications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200 
                  hover:shadow-xl hover:scale-105 hover:bg-blue-300 transition duration-300 cursor-pointer"
                  onClick={() => navigate(`/admin/application/${app._id}`)}
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    {app.title}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium text-gray-800">Submitted by:</span>{" "}
                    {app.studentId?.name || "Unknown"}
                  </p>

                  {/* Status Badge */}
                  <p className="mt-3">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        app.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : app.status === "Rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </p>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/admin/application/${app._id}`)}
                    className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md 
                    hover:bg-blue-600 hover:brightness-110 transition duration-200"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              No applications submitted by students.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
