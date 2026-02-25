// App.jsx
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

// Public pages
import PublicLayout from "./layout/PublicLayout";
import Home from "./pages/public/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/public/Profile";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

// Admin pages
import AdminRouteWrapper from "./components/AdminRouteWrapper";
import HostelSelection from "./pages/admin/HostelSelection";
import RoleRoute from "./components/RoleRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import { useEffect } from "react";

export default function App() {

  const location = useLocation();
const navigate = useNavigate();

useEffect(() => {
  if (window.navigator.userAgent.includes("Electron")) {
    if (!location.pathname.startsWith("/admin")) {
      navigate("/admin/login");
    }
  }
}, [location, navigate]);

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        // In your router configuration, keep BOTH routes:
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        // Add these routes to your router configuration
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
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
          <RoleRoute allowedRoles={["ADMIN", "STAFF"]}>
            <AdminRouteWrapper />
          </RoleRoute>
        }
      />

    </Routes>
  );
}