import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const { token } = useAuth();

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90">
          <img
            src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=80"
            alt="Hostel Building"
            loading="eager"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Officers Hostel Management System
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Efficient hostel management for students and administrators
            </p>

            {!token && (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
              >
                Login to Continue
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            )}

            {token && (
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
              >
                Go to Profile
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            System Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools for efficient hostel management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg w-fit mb-4">
              <BuildingOfficeIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Room Management
            </h3>
            <p className="text-gray-600">
              Manage rooms, capacities, and allocations efficiently
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg w-fit mb-4">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Student Management
            </h3>
            <p className="text-gray-600">
              Complete student profiles and allocation tracking
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg w-fit mb-4">
              <Cog6ToothIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Admin Dashboard
            </h3>
            <p className="text-gray-600">
              Full control panel for administrators
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="font-medium">Get Started</span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Manage Your Hostel?
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Simple and effective hostel management system for officers and students
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!token ? (
              <Link
                to="/login"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Login to System
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Go to Dashboard
              </Link>
            )}
            <Link
              to="/rooms"
              className="px-8 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              View Rooms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}