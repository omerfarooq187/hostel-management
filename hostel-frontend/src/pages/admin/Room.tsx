import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [block, setBlock] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [editingRoomId, setEditingRoomId] = useState(null);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/api/admin/rooms");

      const roomsWithStatus = await Promise.all(
        res.data.map(async (room) => {
          const status = await api.get(`/api/admin/rooms/${room.id}/status`);
          return { ...room, status: status.data };
        })
      );

      setRooms(roomsWithStatus);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openAddModal = () => {
    setEditingRoomId(null);
    setBlock("");
    setRoomNumber("");
    setCapacity("");
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setEditingRoomId(room.id);
    setBlock(room.block);
    setRoomNumber(room.roomNumber);
    setCapacity(room.capacity);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingRoomId) {
        const res = await api.put(`/api/admin/rooms/${editingRoomId}`, {
          block,
          roomNumber,
          capacity: Number(capacity),
        });

        const status = await api.get(`/api/admin/rooms/${editingRoomId}/status`);

        setRooms(
          rooms.map((r) =>
            r.id === editingRoomId ? { ...res.data, status: status.data } : r
          )
        );
      } else {
        const res = await api.post("/api/admin/rooms", {
          block,
          roomNumber,
          capacity: Number(capacity),
        });

        const status = await api.get(`/api/admin/rooms/${res.data.id}/status`);
        setRooms([...rooms, { ...res.data, status: status.data }]);
      }

      setShowModal(false);
    } catch (err) {
      console.error("Failed to save room", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      await api.delete(`/api/admin/rooms/${id}`);
      setRooms(rooms.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete room", err);
    }
  };

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Block</th>
            <th className="p-2">Room</th>
            <th className="p-2">Capacity</th>
            <th className="p-2">Occupied</th>
            <th className="p-2">Available</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-100">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.block}</td>
              <td className="p-2">{r.roomNumber}</td>
              <td className="p-2">{r.capacity}</td>
              <td className="p-2">{r.status.occupiedBeds}</td>
              <td className="p-2">{r.status.availableBeds}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => openEditModal(r)}
                  className="px-2 py-1 bg-yellow-400 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">
              {editingRoomId ? "Edit Room" : "Add Room"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Block"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="text"
                placeholder="Room Number"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="number"
                placeholder="Capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {editingRoomId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
