// App.jsx
import { Routes, Route } from "react-router-dom";

// Public pages
import PublicLayout from "./layout/PublicLayout";
import Home from "./pages/public/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/public/StudentDashboard";
import Profile from "./pages/public/Profile";
import About from "./pages/public/About";

// Admin pages
import AdminRouteWrapper from "./components/AdminRouteWrapper";
import HostelSelection from "./pages/admin/HostelSelection";
import RoleRoute from "./components/RoleRoute";
import AdminLogin from "./pages/admin/AdminLogin";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
      </Route>

      {/* Hostel selection route */}
      <Route 
        path="/admin/hostel-selection" 
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <HostelSelection />
          </RoleRoute>
        }
      />

      <Route path="/admin/login" element={<AdminLogin />} />

      {/* All other admin routes */}
      <Route 
        path="/admin/*" 
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <AdminRouteWrapper />
          </RoleRoute>
        }
      />

    </Routes>
  );
}