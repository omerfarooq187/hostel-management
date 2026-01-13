import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  UserCircleIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  PhoneIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  HomeIcon,
  PencilIcon,
  CheckIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

// Add this at the top of your Profile.jsx
const BedIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 14h14M5 17v-4m14 4v-4m-7-7v4m0-4h3m-3 0H8m8 8H8m8 0v2M8 17v2"
    />
  </svg>
);

// Or create a separate BedIcon.jsx component

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const studentRes = await api.get("/api/student/me");
      setStudent(studentRes.data);

      setFormData({
        name: studentRes.data.name,
        phone: studentRes.data.studentRequest?.phone || "",
      });

      try {
        const roomRes = await api.get("/api/student/me/room");
        setRoom(roomRes.data);
      } catch (roomErr) {
        // Room might not be allocated yet
        setRoom(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put("/api/user/me", {
        name: formData.name,
        phone: formData.phone,
      });

      const studentRes = await api.get("/api/student/me");
      setStudent(studentRes.data);

      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account and view allocation details</p>
          </div>
          <button
            onClick={fetchProfile}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student Information Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserCircleIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Student Information</h2>
              </div>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={<UserCircleIcon className="h-5 w-5" />}
                  label="Name"
                  value={student?.name}
                  color="blue"
                />
                <InfoItem
                  icon={<EnvelopeIcon className="h-5 w-5" />}
                  label="Email"
                  value={student?.email}
                  color="green"
                />
                <InfoItem
                  icon={<AcademicCapIcon className="h-5 w-5" />}
                  label="Roll Number"
                  value={student?.studentRequest?.rollNo}
                  color="purple"
                />
                <InfoItem
                  icon={<PhoneIcon className="h-5 w-5" />}
                  label="Phone"
                  value={student?.studentRequest?.phone || "Not provided"}
                  color="orange"
                />
                <InfoItem
                  icon={<UserGroupIcon className="h-5 w-5" />}
                  label="Guardian Name"
                  value={student?.studentRequest?.guardianName || "Not provided"}
                  color="red"
                />
                <InfoItem
                  icon={<PhoneIcon className="h-5 w-5" />}
                  label="Guardian Phone"
                  value={student?.studentRequest?.guardianPhoneNumber || "Not provided"}
                  color="indigo"
                />
              </div>
            )}
          </div>

          {/* Account Status */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Account Status</h3>
                <p className="text-gray-600 text-sm">Your current account information</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-500">Account Type</div>
                <div className="font-semibold text-gray-900 mt-1">Student</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-500">Registration Status</div>
                <div className="font-semibold text-green-600 mt-1">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Allocation Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Room Allocation</h2>
            </div>

            {room ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-gray-900">
                      {room.block} - Room {room.roomNumber}
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Allocated
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <HomeIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Block</span>
                      </div>
                      <div className="font-semibold text-gray-900">{room.block}</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Room</span>
                      </div>
                      <div className="font-semibold text-gray-900">{room.roomNumber}</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <BedIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Bed</span>
                      </div>
                      <div className="font-semibold text-gray-900">{room.bedNumber}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Your room allocation is currently active. Please contact the admin office for any changes or issues.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <HomeIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Room Allocated</h3>
                <p className="text-gray-600 mb-6">
                  Your room allocation is pending. Please wait for admin assignment.
                </p>
                <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                  Pending Allocation
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Contact Admin</div>
                  <div className="text-sm text-gray-600">Request room change or report issues</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left bg-white hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowPathIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Check Allocation Status</div>
                  <div className="text-sm text-gray-600">View latest allocation updates</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-medium text-gray-900 mt-1">{value || "Not provided"}</div>
      </div>
    </div>
  );
};

function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student Info Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-100 rounded-xl">
                  <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    <div className="h-6 w-32 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room Info Skeleton */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              <div className="h-6 w-40 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-gray-200 rounded-xl"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}