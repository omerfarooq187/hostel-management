import { Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoomsPage from "./pages/admin/Room";
import StudentsPage from "./pages/admin/Students";
import Allocations from "./pages/admin/Allocations";
import Login from "./pages/Login";
import AllocationHistory from "./pages/admin/AllocationsHistory";
import RoomBeds from "./pages/admin/RoomBeds";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
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
