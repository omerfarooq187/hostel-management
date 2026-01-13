// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState, memo } from "react";
import api from "../../api/axios";
import { 
  BuildingOfficeIcon, 
  UsersIcon, 
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ArrowPathIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    rooms: 0,
    students: 0,
    occupiedBeds: 0,
    totalBeds: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Error dialog state
  const [errorDialog, setErrorDialog] = useState({
    show: false,
    title: "",
    message: "",
  });

  const showError = (title, message) => {
    setErrorDialog({
      show: true,
      title: title || "Error",
      message: message || "An unexpected error occurred"
    });
  };

  const closeErrorDialog = () => {
    setErrorDialog(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const [roomsRes, studentsRes, allocationsRes] = await Promise.all([
          api.get("/api/admin/rooms"),
          api.get("/api/admin/students"),
          api.get("/api/admin/allocations")
        ]);

        if (!isMounted) return;

        // Calculate total beds from rooms
        const totalBeds = roomsRes.data.reduce((sum, room) => sum + room.capacity, 0);
        
        setStats({
          rooms: roomsRes.data.length,
          students: studentsRes.data.length,
          occupiedBeds: allocationsRes.data,
          totalBeds: totalBeds
        });
        
        setLastUpdated(new Date());
      } catch (err) {
        if (!isMounted) return;
        showError(
          "Failed to Load Dashboard",
          err.response?.data?.message || "Unable to load dashboard data. Please try again."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate accurate metrics
  const occupancyRate = stats.totalBeds > 0 
    ? Math.round((stats.occupiedBeds / stats.totalBeds) * 100) 
    : 0;
  
  const availableBeds = Math.max(0, stats.totalBeds - stats.occupiedBeds);
  const occupancyStatus = stats.rooms > 0 
    ? (stats.occupiedBeds / stats.totalBeds * 100).toFixed(1) 
    : "0";

  const refreshData = () => {
    window.location.reload();
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of hostel management system</p>
        </div>
        
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              <ClockIcon className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          )}
          <button
            onClick={refreshData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Rooms" 
          value={stats.rooms} 
          icon={BuildingOfficeIcon}
          color="blue"
          description="Available hostel rooms"
          trend={`${stats.rooms} rooms`}
        />
        <StatCard 
          title="Total Students" 
          value={stats.students} 
          icon={UsersIcon}
          color="green"
          description="Registered students"
          trend={`${stats.students} students`}
        />
        <StatCard 
          title="Occupied Beds" 
          value={stats.occupiedBeds} 
          icon={ClipboardDocumentCheckIcon}
          color="purple"
          description="Currently allocated beds"
          trend={`${stats.occupiedBeds} occupied`}
        />
        <StatCard 
          title="Occupancy Rate" 
          value={`${occupancyRate}%`} 
          icon={ClockIcon}
          color="orange"
          description={`${availableBeds} beds available`}
          trend={`${occupancyStatus}% filled`}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Beds Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Available Beds</h3>
              <p className="text-gray-600 text-sm">Ready for allocation</p>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {availableBeds}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Capacity utilization</span>
              <span className="font-medium">{occupancyRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  occupancyRate > 80 ? 'bg-red-500' :
                  occupancyRate > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, occupancyRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Room Statistics */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Room Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Beds Capacity</span>
              <span className="font-medium">{stats.totalBeds}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Average Beds per Room</span>
              <span className="font-medium">
                {stats.rooms > 0 ? (stats.totalBeds / stats.rooms).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Utilization Status</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                occupancyRate > 80 ? 'bg-red-100 text-red-800' :
                occupancyRate > 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {occupancyRate > 80 ? 'High' :
                 occupancyRate > 60 ? 'Moderate' : 'Low'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Rooms</div>
                  <div className="text-xs text-gray-600">Total count</div>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900">{stats.rooms}</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UsersIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Students</div>
                  <div className="text-xs text-gray-600">Registered</div>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900">{stats.students}</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.rooms}</div>
            <div className="text-sm text-gray-600">Rooms</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.students}</div>
            <div className="text-sm text-gray-600">Students</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.occupiedBeds}</div>
            <div className="text-sm text-gray-600">Active Allocations</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{availableBeds}</div>
            <div className="text-sm text-gray-600">Available Beds</div>
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      {errorDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <ExclamationCircleIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">{errorDialog.title}</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700">{errorDialog.message}</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={closeErrorDialog}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const StatCard = memo(function StatCard({ title, value, icon: Icon, color, description, trend }) {
  const colorClasses = {
    blue: { 
      bg: 'bg-blue-50', 
      iconBg: 'bg-blue-100', 
      iconColor: 'text-blue-600',
      border: 'border-blue-200',
    },
    green: { 
      bg: 'bg-green-50', 
      iconBg: 'bg-green-100', 
      iconColor: 'text-green-600',
      border: 'border-green-200',
    },
    purple: { 
      bg: 'bg-purple-50', 
      iconBg: 'bg-purple-100', 
      iconColor: 'text-purple-600',
      border: 'border-purple-200',
    },
    orange: { 
      bg: 'bg-orange-50', 
      iconBg: 'bg-orange-100', 
      iconColor: 'text-orange-600',
      border: 'border-orange-200',
    },
  };

  return (
    <div className={`${colorClasses[color].bg} border ${colorClasses[color].border} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color].iconBg} group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].iconColor}`} />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{description}</p>
        {trend && (
          <span className="text-sm font-medium text-gray-700">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
});

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* System Status Skeleton */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-100 rounded-lg p-4">
              <div className="h-8 w-16 bg-gray-300 rounded mx-auto mb-2"></div>
              <div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}