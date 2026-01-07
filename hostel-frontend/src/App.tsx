import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoomsPage from "./pages/admin/Room";
import StudentsPage from "./pages/admin/Students";
// import Allocations from "./pages/admin/Allocations";
import Login from "./pages/Login";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="students" element={<StudentsPage />} />
          {/* <Route path="allocations" element={<Allocations />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
