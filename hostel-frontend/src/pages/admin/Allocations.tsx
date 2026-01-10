import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Allocations() {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [allocations, setAllocations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(true);

  // history modal
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [roomsRes, studentsRes] = await Promise.all([
        api.get("/api/admin/rooms"),
        api.get("/api/admin/students"),
      ]);

      setRooms(roomsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoomAllocations = async (roomId) => {
    setSelectedRoom(roomId);
    if (!roomId) return;

    try {
      const res = await api.get(`/api/admin/allocations/room/${roomId}`);
      setAllocations(res.data);
    } catch (err) {
      console.error("Failed to load allocations", err);
    }
  };

  const handleAllocate = async () => {
    if (!selectedStudent || !selectedRoom) return;

    try {
      await api.post(
        `/api/admin/allocations/student/${selectedStudent}/room/${selectedRoom}`
      );
      loadRoomAllocations(selectedRoom);
      setSelectedStudent("");
    } catch (err) {
      alert(err.response?.data || "Allocation failed");
    }
  };

  const handleDeallocate = async (allocationId) => {
    if (!window.confirm("Deallocate this student?")) return;

    try {
      await api.post(`/api/admin/allocations/deallocate/${allocationId}`);
      loadRoomAllocations(selectedRoom);
    } catch (err) {
      console.error("Failed to deallocate", err);
    }
  };

  const openHistory = async (studentId) => {
    try {
      const res = await api.get(
        `/api/admin/allocations/student/${studentId}/history`
      );
      setHistory(res.data);
      setShowHistory(true);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  if (loading) return <p>Loading allocations...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Allocations</h1>

      {/* Controls */}
      <div className="bg-white p-4 rounded shadow mb-4 space-y-3">
        <select
          value={selectedRoom}
          onChange={(e) => loadRoomAllocations(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Room</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.block} - {r.roomNumber}
            </option>
          ))}
        </select>

        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.user.name} ({s.rollNo})
            </option>
          ))}
        </select>

        <button
          onClick={handleAllocate}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Auto Allocate
        </button>
      </div>

      {/* Allocations Table */}
      {selectedRoom && (
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Student</th>
              <th className="p-2 text-left">Bed</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!allocations.length && (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No allocations
                </td>
              </tr>
            )}

            {allocations.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="p-2">
                  <button
                    onClick={() => openHistory(a.student.id)}
                    className="text-blue-600 underline"
                  >
                    {a.student.user.name} ({a.student.rollNo})
                  </button>
                </td>
                <td className="p-2">Bed {a.bedNumber}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeallocate(a.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Deallocate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Allocation History</h2>

            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Room</th>
                  <th className="p-2 text-left">Bed</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-b">
                    <td className="p-2">
                      {h.room.block} - {h.room.roomNumber}
                    </td>
                    <td className="p-2">Bed {h.bedNumber}</td>
                    <td className="p-2">
                      {h.active ? "Active" : "Inactive"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right mt-4">
              <button
                onClick={() => setShowHistory(false)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
