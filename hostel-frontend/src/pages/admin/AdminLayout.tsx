// src/pages/admin/AdminLayout.jsx
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UsersIcon, 
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigationItems = [
    { 
      name: 'Dashboard', 
      to: '/admin', 
      icon: HomeIcon 
    },
    { 
      name: 'Rooms', 
      to: '/admin/rooms', 
      icon: BuildingOfficeIcon 
    },
    { 
      name: 'Students', 
      to: '/admin/students', 
      icon: UsersIcon 
    },
    { 
      name: 'Allocations', 
      to: '/admin/allocations', 
      icon: ClipboardDocumentCheckIcon 
    },
    { 
      name: 'History', 
      to: '/admin/allocations/history', 
      icon: ClockIcon 
    },
  ];

  // Get current page title for breadcrumb
  const getPageTitle = () => {
    const currentItem = navigationItems.find(item => 
      location.pathname === item.to || 
      location.pathname.startsWith(item.to + '/')
    );
    return currentItem?.name || 'Dashboard';
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-900 to-gray-800 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 shadow-2xl
      `}>
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Hostel Admin</h1>
              <p className="text-gray-400 text-sm">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Settings */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <UserCircleIcon className="h-10 w-10 text-gray-400" />
            <div>
              <p className="text-white font-medium">Admin User</p>
              <p className="text-gray-400 text-sm">Super Administrator</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button className="flex items-center space-x-3 w-full px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Settings</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        

        {/* Main Content Area */}
        <main className="p-6">
          <div className="animate-fadeIn">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Hostel Management System. All rights reserved.</p>
          </footer>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}