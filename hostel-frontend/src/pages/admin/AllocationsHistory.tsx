import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AllocationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await api.get("/api/admin/allocations/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading allocation history...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Allocation History</h1>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Student</th>
            <th className="p-2 text-left">Room</th>
            <th className="p-2 text-left">Bed</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {!history.length && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No allocations found.
              </td>
            </tr>
          )}

          {history.map((a) => (
            <tr
              key={a.id}
              className={`border-b hover:bg-gray-100 ${
                a.active ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <td className="p-2">
                {a.student.name} ({a.student.rollNo})
              </td>
              <td className="p-2">
                {a.room.block} - {a.room.roomNumber}
              </td>
              <td className="p-2">Bed {a.bedNumber}</td>
              <td className="p-2">{a.active ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
