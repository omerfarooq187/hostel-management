import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // form state
  const [rollNo, setRollNo] = useState("");
  const [phone, setPhone] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  // user search state
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [editingStudentId, setEditingStudentId] = useState(null);

  const fetchData = async () => {
    try {
      const [studentsRes, usersRes] = await Promise.all([
        api.get("/api/admin/students"),
        api.get("/api/admin/users"),
      ]);

      setStudents(studentsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingStudentId(null);
    setRollNo("");
    setPhone("");
    setGuardianName("");
    setGuardianPhone("");
    setUserSearch("");
    setSelectedUser(null);
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudentId(student.id);
    setRollNo(student.rollNo || "");
    setPhone(student.phone || "");
    setGuardianName(student.guardianName || "");
    setGuardianPhone(student.guardianPhone || "");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStudentId) {
        const res = await api.put(`/api/admin/students/${editingStudentId}`, {
          rollNo,
          phoneNumber: phone,
          guardianName,
          guardianPhoneNumber: guardianPhone,
        });

        setStudents(
          students.map((s) => (s.id === editingStudentId ? res.data : s))
        );
      } else {
        if (!selectedUser) {
          alert("Please select a user");
          return;
        }

        const res = await api.post(
          `/api/admin/students/${selectedUser.id}`,
          {
            rollNo,
            phoneNumber: phone,
            guardianName,
            guardianPhoneNumber: guardianPhone,
          }
        );

        setStudents([...students, res.data]);
      }

      setShowModal(false);
    } catch (err) {
      console.error("Failed to save student", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await api.delete(`/api/admin/students/${id}`);
      setStudents(students.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  if (loading) return <p>Loading students...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Student
        </button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Roll No</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b hover:bg-gray-100">
              <td className="p-2">{s.id}</td>
              <td className="p-2">{s.user.name}</td>
              <td className="p-2">{s.user.email}</td>
              <td className="p-2">{s.rollNo}</td>
              <td className="p-2">{s.phone}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => openEditModal(s)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingStudentId ? "Edit Student" : "Add Student"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {!editingStudentId && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search user by name or email"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setSelectedUser(null);
                    }}
                    className="w-full p-2 border rounded"
                  />

                  {userSearch && !selectedUser && (
                    <div className="absolute w-full bg-white border rounded shadow max-h-40 overflow-y-auto z-10">
                      {users
                        .filter(
                          (u) =>
                            u.role !== "ADMIN" &&
                            !students.some((s) => s.user.id === u.id) &&
                            (u.name
                              .toLowerCase()
                              .includes(userSearch.toLowerCase()) ||
                              u.email
                                .toLowerCase()
                                .includes(userSearch.toLowerCase()))
                        )
                        .slice(0, 10)
                        .map((u) => (
                          <div
                            key={u.id}
                            onClick={() => {
                              setSelectedUser(u);
                              setUserSearch(`${u.name} (${u.email})`);
                            }}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                          >
                            <p className="font-medium">{u.name}</p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              <input
                type="text"
                placeholder="Roll Number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded"
              />

              <input
                type="text"
                placeholder="Guardian Name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full p-2 border rounded"
              />

              <input
                type="text"
                placeholder="Guardian Phone"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className="w-full p-2 border rounded"
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
