import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import StudentApplicationForm from "./pages/StudentApplicationForm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import DocumentUpload from "./pages/DocumentUpload";
import ProtectedRoute from "./components/ProtectedRoute";
import ApplicationDetails from "./pages/ApplicationDetails";
import AdminApplicationView from "./pages/AdminApplicationView"; // Import the admin view page

const router = createBrowserRouter([
  { path: "/", element: <StudentLogin /> },
  { path: "/student-login", element: <StudentLogin /> },
  { path: "/application/:id", element: <ApplicationDetails /> },
  { path: "/student-register", element: <StudentRegister /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student-application",
    element: (
      <ProtectedRoute>
        <StudentApplicationForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/application/:id", // ✅ Admin application view route
    element: (
      <ProtectedRoute>
        <AdminApplicationView />
      </ProtectedRoute>
    ),
  },
  { path: "/admin-login", element: <AdminLogin /> },
  { path: "/admin-register", element: <AdminRegister /> },
  {
    path: "/upload-document",
    element: (
      <ProtectedRoute>
        <DocumentUpload />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <p className="text-center mt-10">404 Not Found</p> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
