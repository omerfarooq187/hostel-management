// pages/student/StudentDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const hostelId = localStorage.getItem("selectedHostelId")
      try {
        const studentRes = await api.get("/api/student/me"); // backend should return current user info
        setStudent(studentRes.data);

        if (studentRes.data.studentId) {
          const allocationRes = await api.get(
            `/api/admin/allocations/student/${studentRes.data.studentId}`,
            {
              params: {hostelId}
            }
          );
          setAllocation(allocationRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading your dashboard...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {student.name}</h1>

      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone || "N/A"}</p>
      </div>

      {allocation ? (
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-2">Room Allocation</h2>
          <p><strong>Block:</strong> {allocation.room.block}</p>
          <p><strong>Room:</strong> {allocation.room.roomNumber}</p>
          <p><strong>Bed:</strong> {allocation.bedNumber}</p>
        </div>
      ) : (
        <div className="bg-yellow-100 p-4 rounded">
          <p>Your room has not been allocated yet.</p>
        </div>
      )}
    </div>
  );
}
