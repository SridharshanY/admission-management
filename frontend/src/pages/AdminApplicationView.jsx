import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import bg from "../assets/backgrounds/bg-img-1.jpg";

const AdminApplicationView = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/application/${id}`, {
          headers: { "x-auth-token": token },
        });
        if (res.data.success) {
          setApplication(res.data.application);
        }
      } catch (error) {
        console.error("Error fetching application:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, token]);

  const handleApproval = async (status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/application/${id}/${status}`,
        {},
        { headers: { "x-auth-token": token } }
      );

      if (res.data.success) {
        setMessage(`Application ${status} successfully!`);
        setTimeout(() => navigate("/admin-dashboard"), 1500);
      }
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error.response?.data || error);
      setMessage("Failed to update application status.");
    }
  };

  if (loading) return <LoadingScreen />;
  if (!application) return <NotFoundScreen />;

  return (
    <div className="min-h-screen bg-gray-100 p-6" style={{ backgroundImage: `url(${bg})` }}>
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        
        {/* Title & Status */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Application by {application.firstName} {application.lastName}</h2>
          <StatusBadge status={application.status} />
        </div>

        {/* Applicant Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Detail label="📧 Email" value={application.email} />
          <Detail label="📞 Phone" value={application.phone} />
          <Detail label="🎂 Date of Birth" value={new Date(application.dob).toLocaleDateString()} />
          <Detail label="🏡 Address" value={application.address} />
          <Detail label="🎓 Class 10 Percentage" value={`${application.class10Percentage}%`} />
          <Detail label="🎓 Class 12 Percentage" value={`${application.class12Percentage}%`} />
          <Detail label="🧑‍🎓 UG or PG" value={application.ugOrPg} />
          <Detail label="⚖️ Caste" value={application.caste} />
          <Detail label="🙏 Religion" value={application.religion} />
          <Detail label="📆 Passed Out Year" value={application.passedOutYear} />
          <Detail label="🌎 Nationality" value={application.nationality} />
          <Detail label="🧑‍🤝‍🧑 Guardian Name" value={application.guardianName} />
          <Detail label="📱 Guardian Contact" value={application.guardianContact} />
          <Detail label="💼 Guardian Occupation" value={application.guardianOccupation} />
          <Detail label="♿ Disability" value={application.disability ? "Yes" : "No"} />
          <Detail label="🏛️ Department" value={application.department} />
        </div>

        {/* Documents Section */}
        {application.documents?.length > 0 && (
          <Section title="📁 Attached Documents">
            <ul className="mt-2 space-y-2">
              {application.documents.map((doc, idx) => (
                <li key={idx}>
                  <a href={`http://localhost:5000/uploads/${doc}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700 transition">
                    📄 {doc}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Admin Comments Section */}
        {application.comments?.length > 0 && (
          <Section title="💬 Admin Comments">
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              {application.comments.map((comment, index) => (
                <li key={index} className="p-2 bg-gray-100 rounded-md">{comment}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4">
          <ActionButton onClick={() => handleApproval("approve")} color="green" text="✅ Approve" />
          <ActionButton onClick={() => handleApproval("reject")} color="red" text="❌ Reject" />
          <ActionButton onClick={() => navigate("/admin-dashboard")} color="gray" text="🔙 Back" />
        </div>

        {/* Status Message */}
        {message && <p className="mt-5 text-center text-lg font-semibold text-green-600">{message}</p>}
      </div>
    </div>
  );
};

/* ✅ Reusable Components */
const Detail = ({ label, value }) => (
  <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
    <p className="text-gray-700 text-sm font-semibold">{label}</p>
    <p className="text-gray-900 font-medium">{value || "N/A"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-900">{title}:</h3>
    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    Approved: "bg-green-100 text-green-600",
    Rejected: "bg-red-100 text-red-600",
    Pending: "bg-yellow-100 text-yellow-600",
  };
  return <span className={`px-4 py-2 text-sm font-medium rounded-full ${colors[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>;
};

const ActionButton = ({ onClick, color, text }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 bg-${color}-500 text-white font-semibold rounded-lg shadow-md hover:bg-${color}-600 transition duration-200`}
  >
    {text}
  </button>
);

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <p className="text-lg text-gray-600">Loading application details...</p>
  </div>
);

const NotFoundScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <p className="text-lg text-red-600">Application not found.</p>
  </div>
);

export default AdminApplicationView;
