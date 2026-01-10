import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function RoomBeds() {
  const { roomId } = useParams();

  const [room, setRoom] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const roomRes = await api.get(`/api/admin/rooms/${roomId}`);
    const allocRes = await api.get(`/api/admin/allocations/room/${roomId}`);
    const studentsRes = await api.get("/api/admin/students");

    setRoom(roomRes.data);
    setAllocations(allocRes.data);
    setStudents(studentsRes.data);
  };

  const occupiedMap = {};
  allocations.forEach(a => {
    occupiedMap[a.bedNumber] = a;
  });

  const allocate = async (bedNumber) => {
    if (!selectedStudent) {
      alert("Select student first");
      return;
    }

    await api.post(
      `/api/admin/allocations/student/${selectedStudent}/room/${roomId}/bed/${bedNumber}`
    );

    loadData();
  };

  const deallocate = async (allocationId) => {
    await api.post(`/api/admin/allocations/deallocate/${allocationId}`);
    loadData();
  };

  if (!room) return <p>Loading room...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Room {room.block}-{room.roomNumber}
      </h1>

      <select
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
        className="border p-2 mb-4 w-full max-w-sm"
      >
        <option value="">Select student</option>
        {students.map(s => (
          <option key={s.id} value={s.id}>
            {s.user.name} ({s.rollNo})
          </option>
        ))}
      </select>

      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: room.capacity }).map((_, i) => {
          const bedNumber = i + 1;
          const allocation = occupiedMap[bedNumber];

          return (
            <div
              key={bedNumber}
              className={`p-4 rounded text-center cursor-pointer
                ${allocation ? "bg-red-400" : "bg-green-400"}`}
              onClick={() =>
                allocation
                  ? deallocate(allocation.id)
                  : allocate(bedNumber)
              }
            >
              <p className="font-bold">Bed {bedNumber}</p>
              <p className="text-sm">
                {allocation
                  ? allocation.student.user.name
                  : "Available"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
