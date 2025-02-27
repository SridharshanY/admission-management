import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../assets/backgrounds/bg-img-2.jpg";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/application/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplication(res.data.application);
      } catch (error) {
        console.error("Error fetching application details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, token]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/application/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        alert("✅ Application deleted successfully!");
        navigate("/dashboard");
      } else {
        alert("❌ Failed to delete application. Please try again.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Error deleting application. Please try again later.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
        <p>Loading application details...</p>
      </div>
    );

  if (!application)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        <p>❌ Application not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6" style={{ backgroundImage: `url(${bg})` }}>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">📋 Application Details</h2>
          <Link to="/dashboard" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
            Back to Dashboard
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">👤 Personal Info</h3>
            <p><strong>Name:</strong> {application.firstName} {application.lastName}</p>
            <p><strong>Email:</strong> {application.email}</p>
            <p><strong>Phone:</strong> {application.phone}</p>
            <p><strong>DOB:</strong> {new Date(application.dob).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {application.gender}</p>
            <p><strong>Nationality:</strong> {application.nationality}</p>
          </div>

          {/* Academic Details */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">📚 Academic Info</h3>
            <p><strong>Class 10 %:</strong> {application.class10Percentage}%</p>
            <p><strong>Class 12 %:</strong> {application.class12Percentage}%</p>
            <p><strong>Passed Year:</strong> {application.passedOutYear}</p>
            <p><strong>Applying for:</strong> {application.ugOrPg}</p>
          </div>

          {/* Guardian Details */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">👨‍👩‍👧 Guardian Info</h3>
            <p><strong>Name:</strong> {application.guardianName}</p>
            <p><strong>Contact:</strong> {application.guardianContact}</p>
            <p><strong>Occupation:</strong> {application.guardianOccupation}</p>
          </div>

          {/* Other Information */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">📝 Additional Info</h3>
            <p><strong>Caste:</strong> {application.caste}</p>
            <p><strong>Religion:</strong> {application.religion}</p>
            <p><strong>Disability:</strong> {application.disability ? "✅ Yes" : "❌ No"}</p>
          </div>
        </div>

        {/* Documents */}
        {application.documents && application.documents.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">📂 Uploaded Documents</h3>
            <ul className="list-disc list-inside space-y-1">
              {application.documents.map((doc, index) => (
                <li key={index}>
                  <a href={`http://localhost:5000/uploads/${doc}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    📄 {doc}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Status & Submission Date */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center">
          <p className="text-lg">
            <strong>📌 Status:</strong>{" "}
            <span className={`px-3 py-1 rounded-lg text-white font-medium ${application.status === "Approved" ? "bg-green-500" : application.status === "Rejected" ? "bg-red-500" : "bg-yellow-500"}`}>
              {application.status}
            </span>
          </p>
          <p className="text-gray-500 text-sm">🗓 Submitted on: {new Date(application.appliedAt).toLocaleString()}</p>
        </div>

        {/* Delete Button */}
        <div className="mt-6 flex justify-end">
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition">
            🗑 Delete Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
