import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="space-y-3">
          <Link to="/admin" className="block">Dashboard</Link>
          <Link to="/admin/rooms" className="block">Rooms</Link>
          <Link to="/admin/students" className="block">Students</Link>
          <Link to="/admin/allocations" className="block">Allocations</Link>
          <Link to="/admin/allocations/history" className="block">
            Allocations History
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
