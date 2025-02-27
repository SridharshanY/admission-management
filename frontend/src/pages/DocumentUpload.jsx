// src/pages/DocumentUpload.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const dummyUploads = [
  { id: "doc1", name: "Transcript.pdf", uploadedAt: "2025-01-12 10:30 AM" },
  { id: "doc2", name: "Recommendation_Letter.docx", uploadedAt: "2025-01-10 03:45 PM" },
];

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    // Simulate fetching previously uploaded documents
    setUploads(dummyUploads);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first");
      return;
    }
    const formData = new FormData();
    formData.append("document", file);
    try {
      const res = await axios.post("http://localhost:5000/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.msg);
      // Append dummy info to simulate an update in the list.
      setUploads((prev) => [
        ...prev,
        {
          id: `doc${prev.length + 1}`,
          name: file.name,
          uploadedAt: new Date().toLocaleString(),
        },
      ]);
    } catch (error) {
      console.error("Error uploading document:", error.response?.data || error);
      setMessage("Error uploading document");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-6">
      <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Submit Your Document</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200"
          >
            Upload Document
          </button>
        </form>
        {message && <p className="mt-4 text-center text-lg">{message}</p>}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Previous Uploads</h3>
          <ul className="space-y-2">
            {uploads.map((doc) => (
              <li key={doc.id} className="p-3 bg-gray-50 rounded shadow-sm flex justify-between items-center">
                <span>{doc.name}</span>
                <span className="text-sm text-gray-500">{doc.uploadedAt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
