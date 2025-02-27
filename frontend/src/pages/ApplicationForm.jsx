// src/pages/ApplicationForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/backgrounds/bg-img-2.jpg";

const ApplicationForm = () => {
  const [documents, setDocuments] = useState("Transcript.pdf, Recommendation_Letter.docx");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Dummy sample instructions
  const sampleInstructions = [
    "Ensure your transcript is clear and legible.",
    "Attach any certificates or awards (if applicable).",
    "Provide any additional supporting documents.",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // For now, we simply simulate a submission.
    setMessage("Application submitted successfully!");
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6" style={{ backgroundImage: `url(${bg})` }}>
      <div className="bg-white rounded shadow-lg p-8 max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4">Submit Your Application</h2>
        <p className="text-gray-600 mb-4">
          Please provide the documents required for admission. You may submit multiple documents separated by commas.
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-500">
          {sampleInstructions.map((inst, idx) => (
            <li key={idx}>{inst}</li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Documents</label>
            <input
              type="text"
              value={documents}
              onChange={(e) => setDocuments(e.target.value)}
              placeholder="e.g., Transcript.pdf, CV.docx"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition duration-200"
          >
            Submit Application
          </button>
        </form>
        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ApplicationForm;
