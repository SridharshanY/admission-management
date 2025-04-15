import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bg from "../assets/backgrounds/bg-img-2.jpg";

const StudentApplicationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    class10Percentage: "",
    class12Percentage: "",
    gender: "",
    caste: "",
    religion: "",
    passedOutYear: "",
    nationality: "",
    guardianName: "",
    guardianContact: "",
    guardianOccupation: "",
    disability: false,
    ugOrPg: "",
    department: "",
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = [...e.target.files];
    const invalidFiles = selectedFiles.filter(file => file.type !== "application/pdf");
    if (invalidFiles.length > 0) {
      setError("Only PDF files are allowed.");
      return;
    }
    setError("");
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("Authentication required. Please log in.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    files.forEach(file => data.append("documents", file));

    try {
      const res = await axios.post("http://localhost:5000/api/application/submit", data, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setMessage("Application submitted successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage(res.data.msg || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Submission error:", error.response?.data || error);
      setMessage("Failed to submit application. Please try again.");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-100 p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Submit Your Application</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
          {/* Row 1: First Name, Last Name, Email, Phone */}
          <div>
            <label className="block font-semibold">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Row 2: Date of Birth and Address */}
          <div>
            <label className="block font-semibold">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="col-span-3">
            <label className="block font-semibold">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          {/* Row 3: Academic Details */}
          <div>
            <label className="block font-semibold">Class 10 Percentage</label>
            <input
              type="number"
              name="class10Percentage"
              value={formData.class10Percentage}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Class 12 Percentage</label>
            <input
              type="number"
              name="class12Percentage"
              value={formData.class12Percentage}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Passed Out Year</label>
            <input
              type="text"
              name="passedOutYear"
              value={formData.passedOutYear}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Row 4: Guardian Details and Nationality */}
          <div>
            <label className="block font-semibold">Guardian Name</label>
            <input
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Guardian Contact</label>
            <input
              type="text"
              name="guardianContact"
              value={formData.guardianContact}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Guardian Occupation</label>
            <input
              type="text"
              name="guardianOccupation"
              value={formData.guardianOccupation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Row 5: Other Details */}
          <div>
            <label className="block font-semibold">Caste</label>
            <input
              type="text"
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Religion</label>
            <input
              type="text"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="col-span-2 flex items-center">
            <input
              type="checkbox"
              name="disability"
              checked={formData.disability}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="font-semibold">Do you have any disability?</label>
          </div>

          {/* Row 6: UG or PG Radio Buttons */}
          <div className="col-span-2">
            <label className="block font-semibold">Are you applying for UG or PG?</label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="ugOrPg"
                  value="UG"
                  onChange={handleChange}
                  required
                /> UG
              </label>
              <label>
                <input
                  type="radio"
                  name="ugOrPg"
                  value="PG"
                  onChange={handleChange}
                /> PG
              </label>
            </div>
          </div>

          {/* Department */}
          <div className="col-span-2">
            <label className="block font-semibold">Select Department you wish to apply for</label>
            <div className="flex space-x-4">
              <label>
                <select
                name="department"
                onChange={handleChange}
                required
                >
                  <option>Select Department</option>
                  <option value={'B.Sc'}>B.Sc</option>
                  <option value={'BCA'}>BCA</option>
                  <option value={'BBA'}>BBA</option>
                  <option value={'BA'}>BA</option>
                  <option value={'B.Com'}>B.Com</option>
                </select>
              </label>
            </div>
          </div>




          {/* Row 7: File Upload */}
          <div className="col-span-4">
            <label className="block font-semibold">Upload Documents (HSC marks, Community certificate, TC, Conduct certificate, Aadhar card - PDF Only)</label>
            <input
              id="file-upload"
              type="file"
              name="documents"
              multiple
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          {/* Row 8: Submit Button */}
          <div className="col-span-4">
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
              Submit Application
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
      </div>
    </div>
  );
};

export default StudentApplicationForm;
