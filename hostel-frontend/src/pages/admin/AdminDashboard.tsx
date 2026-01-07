import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    rooms: 0,
    students: 0,
    occupiedBeds: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [roomsRes, studentsRes, allocationsRes] = await Promise.all([
          api.get("/api/admin/rooms"),
          api.get("/api/admin/students"),
          api.get("/api/admin/allocations")
        ]);

        setStats({
          rooms: roomsRes.data.length,
          students: studentsRes.data.length,
          occupiedBeds: allocationsRes.data
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Rooms" value={stats.rooms} />
        <StatCard title="Total Students" value={stats.students} />
        <StatCard title="Occupied Beds" value={stats.occupiedBeds} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
