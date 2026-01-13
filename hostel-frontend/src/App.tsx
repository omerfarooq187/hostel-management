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
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoomsPage from "./pages/admin/Room";
import StudentsPage from "./pages/admin/Students";
import Allocations from "./pages/admin/Allocations";
import AllocationHistory from "./pages/admin/AllocationsHistory";
import RoomBeds from "./pages/admin/RoomBeds";
import RoleRoute from "./components/RoleRoute";



export default function App() {

  const user = null;
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <RoleRoute allowedRoles={["ADMIN"]}>
          <AdminLayout/>
        </RoleRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="allocations" element={<Allocations />} />
        <Route path="allocations/history" element={<AllocationHistory />} />
        <Route path="rooms/:roomId/beds" element={<RoomBeds />} />
      </Route>
    </Routes>
  );
}
