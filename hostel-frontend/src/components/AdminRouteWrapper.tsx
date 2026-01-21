// src/components/AdminRouteWrapper.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import RoomsPage from "../pages/admin/Room";
import StudentsPage from "../pages/admin/Students";
import Allocations from "../pages/admin/Allocations";
import AllocationHistory from "../pages/admin/AllocationsHistory";
import RoomBeds from "../pages/admin/RoomBeds";
import FeesPage from "../pages/admin/FeesPage";
import SettingsPage from "../pages/admin/Settings";
import KitchenInventoryPage from "../pages/admin/KitchenInventory";

const AdminRouteWrapper = () => {
  const location = useLocation();
  
  // Check if hostel is already selected
  const selectedHostel = localStorage.getItem('selectedHostel');
  const isHostelSelected = selectedHostel && selectedHostel !== 'null';
  
  // If no hostel selected, redirect to selection page
  if (!isHostelSelected) {
    return <Navigate to="/admin/hostel-selection" replace />;
  }
  
  // Render the admin layout with routes
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="rooms/:roomId/beds" element={<RoomBeds />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="allocations" element={<Allocations />} />
        <Route path="allocations/history" element={<AllocationHistory />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="inventory" element={<KitchenInventoryPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRouteWrapper;